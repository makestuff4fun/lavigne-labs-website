"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sfx";

/*
 * Shiverwing — a 1:1 browser reproduction of Brian's ESP32 badge game
 * (firmware: shiverwing_fb / bc_shiverwing_lcd8_te.ino).
 *
 * Everything is faithful to the firmware: the 240x320 playfield, the physics
 * constants tuned for 60fps, the parallax layers, the 4-frame flap, pixel-
 * accurate collision against the bird's opaque pixels, and the real sprite/font
 * art extracted from the .h files. The badge's "Hi, I'm Brian" splash (a
 * trade-show intro) is omitted on the web — we open straight on the attract
 * screen:
 *
 *   attract --press--> play --die--> game-over --press--> play
 *                                          |
 *                                      5s timeout -> attract
 */

const SCREEN_W = 240;
const SCREEN_H = 320;

// --- badge bezel geometry (badge-bezel.png is BADGE_W x BADGE_H px) ---
const BADGE_W = 1147;
const BADGE_H = 1804;
// the LCD screen cutout, as fractions of the badge image
const LCD = { left: 0.1683, top: 0.0843, width: 0.6774, height: 0.5759 };
// zoom modes — crop rectangles (fractions of the badge). 0: full badge,
// 1: full WIDTH, cropped height (LCD framed with equal top/bottom bezel),
// 2: LCD only.
const ZOOM_MODES = [
  { fx: 0, fy: 0, fw: 1, fh: 1 },
  { fx: 0, fy: 0, fw: 1, fh: LCD.top * 2 + LCD.height },
  { fx: LCD.left, fy: LCD.top, fw: LCD.width, fh: LCD.height },
];
const ZOOM_KEY = "shiverwing-zoom";

// --- constants lifted verbatim from the firmware ---
const GRAVITY = 0.125;
const JUMP_FORCE = 3.0;
const FC_SPEED = 2;
const GND_SPEED = 2;
const CLOUD_SPEED = 1;
const MOUNTAIN_SPEED = 0.5;
const SW_ANIMATE_SPEED = 6;
const GAP_HEIGHT = 90;
const FLOOR_HEIGHT = 50;
const FLOOR_Y = SCREEN_H - FLOOR_HEIGHT; // 270
const FC_WIDTH = 40;
const FC_HEIGHT = 180;
const SW_WIDTH = 34;
const SW_HEIGHT = 24;
const PIPE_SPACING = 140;
const GAP_MIN = 20;
const GAP_MAX = SCREEN_H - FLOOR_HEIGHT - GAP_HEIGHT - 20; // 160

const STEP_MS = 1000 / 60;
const GAMEOVER_FREEZE_MS = 350;
const GAMEOVER_TIMEOUT_MS = 5000;
const BEST_KEY = "shiverwing-best";

// digit/label geometry (from ui_assets.h)
const DIGIT_SM_W = 21;
const DIGIT_SM_H = 28;
const LBL_H = 39;
const LBL_SCORE_W = 99;
const LBL_HIGH_W = 79;
const PS_X = (SCREEN_W - 224) / 2; // 8
const PS_Y = 55;
const GAMEOVER_W = 186;

type Phase = "loading" | "attract" | "play" | "gofreeze" | "goprompt";
type Column = { x: number; gapY: number };

const A = {
  sky: "/games/shiverwing/sky_background.png",
  mountain: "/games/shiverwing/mountain_background.png",
  lava: "/games/shiverwing/lava_background.png",
  topFC: "/games/shiverwing/top_fire_column.png",
  botFC: "/games/shiverwing/bot_fire_column.png",
  sw1: "/games/shiverwing/sw1.png",
  sw2: "/games/shiverwing/sw2.png",
  sw3: "/games/shiverwing/sw3.png",
  press: "/games/shiverwing/press_start.png",
  gameover: "/games/shiverwing/gameover.png",
  digits: "/games/shiverwing/digits_sm.png",
  lblScore: "/games/shiverwing/lbl_score.png",
  lblHigh: "/games/shiverwing/lbl_high.png",
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

// opaque-pixel mask of a 34x24 bird sprite, for pixel-accurate collision
function buildMask(img: HTMLImageElement): Uint8Array {
  const c = document.createElement("canvas");
  c.width = SW_WIDTH;
  c.height = SW_HEIGHT;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, SW_WIDTH, SW_HEIGHT).data;
  const m = new Uint8Array(SW_WIDTH * SW_HEIGHT);
  for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 0 ? 1 : 0;
  return m;
}

function rand(a: number, b: number) {
  return Math.floor(a + Math.random() * (b - a));
}

export default function Shiverwing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null); // whole badge = the tap/click region
  const btnRef = useRef<HTMLImageElement>(null); // the "button pressed" overlay
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(0); // 0 full badge · 1 LCD+border · 2 LCD only

  useEffect(() => {
    const z = Number(localStorage.getItem(ZOOM_KEY));
    if (z === 1 || z === 2) setZoom(z);
  }, []);

  // Real badge sound effects (recorded from the WT588F voice chip). These
  // override the synth placeholders for these events; everything else is unchanged.
  useEffect(() => {
    sfx.useSamples({
      flap: "/games/sfx/move_dragon.mp3", // id 7
      crash: "/games/sfx/spare_cymbal.mp3", // id 3
      // no `score`: the badge plays nothing on passing a pipe
    });
  }, []);

  const g = useRef({
    phase: "loading" as Phase,
    clockMs: 0,
    phaseStart: 0,
    goFreezeUntil: 0,
    birdY: SCREEN_H / 2,
    velY: 0,
    frameIdx: 0,
    animTick: 0,
    cols: [] as Column[],
    cloudX: 0,
    mtnX: 0,
    gndX: 0,
    score: 0,
    best: 0,
  });

  useEffect(() => {
    g.current.best = Number(localStorage.getItem(BEST_KEY) || 0);

    let raf = 0;
    let acc = 0;
    let last = performance.now();
    let mounted = true;
    let btnTimer: ReturnType<typeof setTimeout>;
    type Imgs = Record<keyof typeof A, HTMLImageElement>;
    let img: Imgs | null = null;
    let frames: HTMLImageElement[] = []; // [sw1, sw2, sw3, sw2]
    let masks: Uint8Array[] = [];

    function gameInit() {
      const s = g.current;
      s.birdY = SCREEN_H / 2;
      s.velY = 0;
      s.score = 0;
      s.cols = [
        { x: SCREEN_W, gapY: rand(GAP_MIN, GAP_MAX) },
        { x: SCREEN_W + PIPE_SPACING, gapY: rand(GAP_MIN, GAP_MAX) },
      ];
    }

    function toAttract() {
      gameInit();
      g.current.phase = "attract";
      g.current.phaseStart = g.current.clockMs;
    }
    function toPlay() {
      gameInit();
      g.current.velY = -JUMP_FORCE; // start press is the first flap
      g.current.phase = "play";
      g.current.phaseStart = g.current.clockMs;
    }

    // briefly show the pressed-button overlay on every press (physical feedback)
    function flashButton() {
      const el = btnRef.current;
      if (!el) return;
      el.style.opacity = "1";
      clearTimeout(btnTimer);
      btnTimer = setTimeout(() => {
        if (btnRef.current) btnRef.current.style.opacity = "0";
      }, 110);
    }

    function press() {
      const s = g.current;
      sfx.unlock();
      flashButton();
      switch (s.phase) {
        case "attract":
          toPlay();
          sfx.play("flap");
          break;
        case "play":
          s.velY = -JUMP_FORCE;
          sfx.play("flap");
          break;
        case "goprompt":
          toPlay();
          sfx.play("flap");
          break;
        // gofreeze: ignore (firmware swallows presses during the 350ms freeze)
      }
    }

    function step() {
      const s = g.current;
      s.clockMs += STEP_MS;

      // flap advances only while the bird is alive (attract + play). On collision
      // the frame freezes on the death pose, exactly like the badge. (Splash uses
      // its own time-based flap frame, so it's unaffected.)
      if (s.phase === "attract" || s.phase === "play") {
        s.animTick++;
        if (s.animTick >= SW_ANIMATE_SPEED) {
          s.animTick = 0;
          s.frameIdx = (s.frameIdx + 1) % 4;
        }
      }

      // parallax scrolls everywhere EXCEPT the frozen game-over tableau
      if (s.phase === "attract" || s.phase === "play") {
        s.cloudX = (s.cloudX + CLOUD_SPEED) % SCREEN_W;
        s.mtnX = (s.mtnX + MOUNTAIN_SPEED) % SCREEN_W;
        s.gndX = (s.gndX + GND_SPEED) % SCREEN_W;
      }

      if (s.phase === "attract") {
        return; // idles here until the player presses (no splash to fall back to)
      }
      if (s.phase === "gofreeze") {
        if (s.clockMs >= s.goFreezeUntil) {
          s.phase = "goprompt";
          s.phaseStart = s.clockMs;
        }
        return;
      }
      if (s.phase === "goprompt") {
        if (s.clockMs - s.phaseStart >= GAMEOVER_TIMEOUT_MS) toAttract();
        return;
      }
      if (s.phase !== "play") return;

      // --- physics ---
      s.velY += GRAVITY;
      s.birdY += s.velY;
      if (s.birdY < 0) {
        s.birdY = 0;
        s.velY = 0;
      }
      if (s.birdY > SCREEN_H - SW_HEIGHT) {
        s.birdY = SCREEN_H - SW_HEIGHT;
        s.velY = 0;
      }

      // --- columns (score++ on wrap, exactly like the firmware) ---
      for (const col of s.cols) {
        col.x -= FC_SPEED;
        if (col.x < -FC_WIDTH) {
          col.x = SCREEN_W;
          col.gapY = rand(GAP_MIN, GAP_MAX);
          s.score++; // badge is silent on passing a pipe — no score sound, by design
        }
      }

      // --- pixel-accurate collision against the bird's opaque pixels ---
      const mask = masks[s.frameIdx];
      const dx0 = 60;
      const dy0 = Math.round(s.birdY);
      let dead = false;
      outer: for (let j = 0; j < SW_HEIGHT; j++) {
        const py = dy0 + j;
        for (let i = 0; i < SW_WIDTH; i++) {
          if (!mask[j * SW_WIDTH + i]) continue;
          const px = dx0 + i;
          if (py >= FLOOR_Y) {
            dead = true;
            break outer;
          }
          for (const col of s.cols) {
            if (px >= col.x && px < col.x + FC_WIDTH && (py < col.gapY || py >= col.gapY + GAP_HEIGHT)) {
              dead = true;
              break outer;
            }
          }
        }
      }
      if (dead) {
        sfx.play("crash");
        if (s.score > s.best) {
          s.best = s.score;
          try {
            localStorage.setItem(BEST_KEY, String(s.best));
          } catch {}
        }
        s.phase = "gofreeze";
        s.goFreezeUntil = s.clockMs + GAMEOVER_FREEZE_MS;
      }
    }

    // ---------- rendering ----------
    function tile(ctx: CanvasRenderingContext2D, im: HTMLImageElement, y: number, off: number) {
      const o = ((off % SCREEN_W) + SCREEN_W) % SCREEN_W;
      ctx.drawImage(im, -o, y);
      ctx.drawImage(im, SCREEN_W - o, y);
    }
    function drawBackground(ctx: CanvasRenderingContext2D) {
      const s = g.current;
      tile(ctx, img!.sky, 0, s.cloudX);
      tile(ctx, img!.mountain, 194, s.mtnX);
      tile(ctx, img!.lava, FLOOR_Y, s.gndX);
    }
    function drawColumns(ctx: CanvasRenderingContext2D) {
      for (const col of g.current.cols) {
        const topH = col.gapY;
        const botY = col.gapY + GAP_HEIGHT;
        const botH = FLOOR_Y - botY;
        if (topH > 0)
          ctx.drawImage(img!.topFC, 0, FC_HEIGHT - topH, FC_WIDTH, topH, col.x, 0, FC_WIDTH, topH);
        if (botH > 0) ctx.drawImage(img!.botFC, 0, 0, FC_WIDTH, botH, col.x, botY, FC_WIDTH, botH);
      }
    }
    function drawBird(ctx: CanvasRenderingContext2D) {
      ctx.drawImage(frames[g.current.frameIdx], 60, Math.round(g.current.birdY));
    }
    function numWidth(v: number) {
      return String(Math.max(0, v | 0)).length * DIGIT_SM_W;
    }
    function drawNumber(ctx: CanvasRenderingContext2D, v: number, x: number, y: number) {
      for (const ch of String(Math.max(0, v | 0))) {
        const d = ch.charCodeAt(0) - 48;
        ctx.drawImage(img!.digits, d * DIGIT_SM_W, 0, DIGIT_SM_W, DIGIT_SM_H, x, y, DIGIT_SM_W, DIGIT_SM_H);
        x += DIGIT_SM_W;
      }
    }
    function drawScore(ctx: CanvasRenderingContext2D) {
      const w = numWidth(g.current.score);
      drawNumber(ctx, g.current.score, Math.floor((SCREEN_W - w) / 2), 6);
    }
    function labelValue(ctx: CanvasRenderingContext2D, lbl: HTMLImageElement, lblW: number, v: number, y: number) {
      const total = lblW + 8 + numWidth(v);
      const x = Math.floor((SCREEN_W - total) / 2);
      ctx.drawImage(lbl, x, y);
      drawNumber(ctx, v, x + lblW + 8, y + Math.floor((LBL_H - DIGIT_SM_H) / 2));
    }
    function blinkPress(ctx: CanvasRenderingContext2D, y: number) {
      if (g.current.clockMs % 900 < 600) ctx.drawImage(img!.press, PS_X, y);
    }

    function render(ctx: CanvasRenderingContext2D) {
      const s = g.current;
      drawBackground(ctx);

      if (s.phase === "attract") {
        drawBird(ctx);
        blinkPress(ctx, PS_Y);
        return;
      }

      // play / gofreeze / goprompt all show the live (or frozen) scene
      drawColumns(ctx);
      drawBird(ctx);

      if (s.phase === "play") {
        drawScore(ctx);
      } else if (s.phase === "goprompt") {
        ctx.drawImage(img!.gameover, Math.floor((SCREEN_W - GAMEOVER_W) / 2), 8);
        labelValue(ctx, img!.lblScore, LBL_SCORE_W, s.score, 150);
        labelValue(ctx, img!.lblHigh, LBL_HIGH_W, s.best, 196);
        blinkPress(ctx, 244);
      }
    }

    function loop(now: number) {
      if (!mounted) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx && img) {
        acc += now - last;
        last = now;
        if (acc > 200) acc = 200;
        while (acc >= STEP_MS) {
          step();
          acc -= STEP_MS;
        }
        ctx.imageSmoothingEnabled = false;
        render(ctx);
      } else {
        last = now;
      }
      raf = requestAnimationFrame(loop);
    }

    (async () => {
      try {
        const keys = Object.keys(A) as (keyof typeof A)[];
        const loaded = await Promise.all(keys.map((k) => loadImage(A[k])));
        if (!mounted) return;
        const map = {} as Imgs;
        keys.forEach((k, i) => (map[k] = loaded[i]));
        img = map;
        frames = [map.sw1, map.sw2, map.sw3, map.sw2];
        masks = [buildMask(map.sw1), buildMask(map.sw2), buildMask(map.sw3), buildMask(map.sw2)];
        gameInit();
        g.current.phase = "attract";
        g.current.phaseStart = 0;
        setLoading(false);
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } catch {
        /* asset load failed */
      }
    })();

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        press();
      }
    };
    const onPointer = (e: Event) => {
      if ((e.target as Element | null)?.closest?.("[data-noflap]")) return; // zoom button
      e.preventDefault();
      press();
    };
    window.addEventListener("keydown", onKey);
    // Press anywhere on the badge (incl. the physical-button area) to flap — not
    // just the screen. The bezel img is pointer-events-none so taps fall through
    // to this wrapper.
    const el = wrapRef.current;
    el?.addEventListener("mousedown", onPointer);
    el?.addEventListener("touchstart", onPointer, { passive: false });

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      clearTimeout(btnTimer);
      window.removeEventListener("keydown", onKey);
      el?.removeEventListener("mousedown", onPointer);
      el?.removeEventListener("touchstart", onPointer);
    };
  }, []);

  const z = ZOOM_MODES[zoom];
  // canvas covers the LCD (+ a hair of overlap so no edge gap when zoomed)
  const lcdStyle = {
    left: `${(LCD.left - 0.004) * 100}%`,
    top: `${(LCD.top - 0.004) * 100}%`,
    width: `${(LCD.width + 0.008) * 100}%`,
    height: `${(LCD.height + 0.008) * 100}%`,
  } as const;
  return (
    <div className="flex flex-col items-center">
      {/* The viewport crops to the current zoom mode; the badge "stage" is sized
          and shifted so the crop fills it. Tap anywhere = flap (the screen and the
          physical-button area); the zoom button is excluded. Corners rounded 20px. */}
      <div
        ref={wrapRef}
        className="relative cursor-pointer select-none touch-none overflow-hidden"
        style={{
          width: "min(94vw, 52dvh)",
          aspectRatio: `${z.fw * BADGE_W} / ${z.fh * BADGE_H}`,
          borderRadius: 20,
        }}
      >
        <div
          className="absolute"
          style={{
            width: `${100 / z.fw}%`,
            left: `${-(z.fx / z.fw) * 100}%`,
            top: `${-(z.fy / z.fh) * 100}%`,
          }}
        >
          <canvas
            ref={canvasRef}
            width={SCREEN_W}
            height={SCREEN_H}
            className="absolute block"
            style={{ ...lcdStyle, objectFit: "fill", imageRendering: "pixelated" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/games/shiverwing/badge-bezel.png"
            alt="Shiverwing badge"
            draggable={false}
            className="pointer-events-none relative block w-full select-none"
          />
          {/* pressed-button overlay (same 1147x1804 canvas, transparent except the
              button in its down state); flashed on each press */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={btnRef}
            src="/games/shiverwing/badge-bezel-down.png"
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-0 block h-full w-full select-none"
            style={{ opacity: 0, transition: "opacity 80ms ease-out" }}
          />
          {loading && (
            <div className="absolute grid place-items-center bg-ink" style={lcdStyle}>
              <p className="font-mono text-sm text-white/60">Loading…</p>
            </div>
          )}
        </div>

        {/* zoom toggle — full badge → LCD+border → LCD only */}
        <button
          type="button"
          data-noflap
          aria-label="Change zoom"
          onClick={() =>
            setZoom((m) => {
              const n = (m + 1) % 3;
              try {
                localStorage.setItem(ZOOM_KEY, String(n));
              } catch {}
              return n;
            })
          }
          className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.2-4.2M8 11h6M11 8v6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-slate">
        Tap / click / Space to fly · the zoom icon (top-right) frames the badge. The real
        badge game — exact sprites, fonts, physics &amp; screens.
      </p>
    </div>
  );
}
