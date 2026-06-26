"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sfx";
import {
  palette,
  pitFrames,
  cubePitFrames,
  dragonPitFrames,
  shiverwingFrames,
  cubeMeltFrames,
  digitGlyphs,
  menuFrames,
  menuGrey,
  menuRed,
  barGreen,
  barYellow,
  barBlue,
  volumeBar,
  brightBar,
  vibBar,
} from "./ffData";

/*
 * Freezing Fortress (featuring Shiverwing) — a faithful browser port of Brian's
 * 14x10 addressable-LED Sokoban game (firmware: Software/Holtek/ff_500_levels).
 *
 * It's a generic Sokoban engine fed by an external level file (standard .xsb
 * text, so any of the ~500 real levels can be dropped in). The board renders as
 * the real device does — each cell a diffused square LED, brighter in the centre,
 * glowing on black — using the exact colour/animation tables from the firmware.
 *
 * Tile codes match the firmware:
 *   0 empty · 1 wall · 2 pit(goal) · 3 cube(box) · 4 dragon · 5 cube+pit · 6 dragon+pit
 */

const COLS = 14;
const ROWS = 10;
const N = COLS * ROWS;

const CELL = 26;
const GAP = 4;
// On the real panel the bezel sits one inter-LED gap from the edge LEDs, so the
// board margin equals GAP. This also makes the board aspect (1.395) match the
// bezel cutout exactly, so the grid fills the cutout edge-to-edge.
const PAD = GAP;
const BOARD_W = COLS * CELL + (COLS - 1) * GAP + 2 * PAD;
const BOARD_H = ROWS * CELL + (ROWS - 1) * GAP + 2 * PAD;

const PIT_MS = 70; // fire flicker frame time
const MELT_MS = 45; // cube-melt frame time on solve
const SHIM_MS = 55; // dragon shimmer frame time (one-shot per move)
const INTRO_MS = 1100; // level-number readout duration
// zoom modes — each is a self-contained bezel + board composition. The LED board
// is seated in the bezel's cutout (fractions of the bezel image).
//   0: no border (board only) · 1: original snowflake bezel (its previous size)
//   2: full landscape bezel
const ZOOM_MODES = [
  { bezel: null, bw: BOARD_W, bh: BOARD_H, maxW: 600, round: 14,
    cut: { left: 0, top: 0, width: 1, height: 1 } },
  { bezel: "/games/freezing-fortress/bezel-snowflake.png?v=5", bw: 1092, bh: 802, maxW: 680, round: 0,
    cut: { left: 0.0595, top: 0.0698, width: 0.88, height: 0.8591 } },
  { bezel: "/games/freezing-fortress/bezel.png?v=5", bw: 995, bh: 468, maxW: 600, round: 0,
    cut: { left: 0.2362, top: 0.0855, width: 0.5256, height: 0.8248 } },
];
const ZOOM_KEY = "ff-zoom";

// --- device settings (faithful to the firmware menu) ---
const BRIGHT_KEY = "ff-brightness"; // 0..2 (default 2 = max)
const SOUND_KEY = "ff-sound-v2"; // 0..5 (default 5 = max); -v2 discards 0s from the old null-parse bug
const VIB_KEY = "ff-vibration"; // 0..2 (default 0 = off)
const BRIGHT_FILTER = [0.5, 0.73, 1]; // CSS brightness per level
const LEVELS_URL = "/games/freezing-fortress/levels.txt";
const PROGRESS_KEY = "ff-max-level";

type Phase = "loading" | "intro" | "play" | "solved";

// ---------- colour helpers ----------
function parseColor(c: string): [number, number, number] {
  if (c[0] === "#") {
    const n = parseInt(c.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = c.match(/\d+/g) ?? ["0", "0", "0"];
  return [+m[0], +m[1], +m[2]];
}
function mix(h: string, target: number, amt: number) {
  const [r, g, b] = parseColor(h);
  const m = (c: number) => Math.round(c + (target - c) * amt);
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}
const lighten = (h: string, a: number) => mix(h, 255, a);
const darken = (h: string, a: number) => mix(h, 0, a);
// Small global brightness bump for the web — the LED data is conservative, and a
// brighter base also makes the dragon's one-shot shimmer flash read less harsh.
const BRIGHT = 1.18;
function brighten(h: string) {
  const [r, g, b] = parseColor(h);
  const m = (c: number) => Math.min(255, Math.round(c * BRIGHT));
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}

// ---------- level parsing (standard .xsb) ----------
const CHAR: Record<string, number> = { " ": 0, "-": 0, "_": 0, "#": 1, ".": 2, "$": 3, "@": 4, "*": 5, "+": 6 };

// Levels are delimited by ";Level N" markers; each level is the next ROWS lines
// (empty interior rows are fine — they're just floor rows, not separators).
function parseLevels(text: string): Uint8Array[] {
  const levels: Uint8Array[] = [];
  let rows: string[] | null = null;
  const flush = () => {
    if (!rows) return;
    const board = new Uint8Array(N);
    for (let r = 0; r < ROWS; r++) {
      const line = rows[r] ?? "";
      for (let c = 0; c < COLS && c < line.length; c++) board[r * COLS + c] = CHAR[line[c]] ?? 0;
    }
    levels.push(board);
  };
  for (const raw of text.split("\n")) {
    if (raw.startsWith(";")) {
      flush();
      rows = [];
      continue;
    }
    if (rows && rows.length < ROWS) rows.push(raw);
  }
  flush();
  return levels;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export default function FreezingFortress() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [levelNo, setLevelNo] = useState(0); // 0-based
  const [moves, setMoves] = useState(0);
  const [pushes, setPushes] = useState(0);
  const [total, setTotal] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [zoom, setZoom] = useState(0); // 0 board · 1 snowflake · 2 full bezel
  const [menuOpen, setMenuOpen] = useState(false);
  const [brightness, setBrightness] = useState(2); // 0..2
  const [soundLevel, setSoundLevel] = useState(5); // 0..5
  const [vibration, setVibration] = useState(0); // 0..2
  const [menuPage, setMenuPage] = useState(0); // 0 level · 1 vol · 2 bright · 3 vib · 4 reset · 5 confirm
  const [newLevel, setNewLevel] = useState(0); // level previewed in the menu (applied on close)
  const [resetArmed, setResetArmed] = useState(false);
  const [confirmYes, setConfirmYes] = useState(false);

  const g = useRef({
    levels: [] as Uint8Array[],
    board: new Uint8Array(N),
    player: 0,
    level: 0,
    moves: 0,
    pushes: 0,
    history: [] as { board: Uint8Array<ArrayBuffer>; player: number; moves: number; pushes: number }[],
    phase: "loading" as Phase,
    phaseStart: 0,
    clock: 0,
    shimmerStart: -1e9, // dragon shimmer trigger time (one-shot per move)
    vibration: 0, // 0..2 haptic intensity (mobile only)
    // --- LED menu (rendered on the board, like the real device) ---
    menuOpen: false,
    menuPage: 0, // 0 level · 1 volume · 2 brightness · 3 vibration · 4 reset · 5 confirm
    newLevel: 0, // level being previewed in the menu (applied on exit)
    resetArmed: false,
    confirmYes: false,
    volumeV: 5,
    brightnessV: 2,
  });
  const menuRef = useRef(false); // gate game keyboard while the menu is open
  const menuApi = useRef({
    pageDelta: (_d: number) => {},
    adjust: (_up: boolean) => {},
    ok: () => {},
    toggle: () => {},
  });

  // ---- engine actions exposed to the keyboard + on-screen controls ----
  const api = useRef({
    move: (_d: number) => {},
    undo: () => {},
    reset: () => {},
    go: (_n: number) => {},
    goto: (_n: number) => {},
  });

  useEffect(() => {
    const z = Number(localStorage.getItem(ZOOM_KEY));
    if (z === 1 || z === 2) setZoom(z);
    // read a 0..max setting, falling back to `fb` when unset (null) or invalid.
    // (Number(null) is 0, so a plain Number() parse would wrongly default to 0.)
    const get = (key: string, max: number, fb: number) => {
      const raw = localStorage.getItem(key);
      if (raw === null) return fb;
      const v = Number(raw);
      return Number.isFinite(v) && v >= 0 && v <= max ? v : fb;
    };
    setBrightness(get(BRIGHT_KEY, 2, 2));
    setSoundLevel(get(SOUND_KEY, 5, 5));
    setVibration(get(VIB_KEY, 2, 0));
  }, []);

  // sound level → master volume (0..5 → 0..1)
  useEffect(() => {
    sfx.setVolume(soundLevel / 5);
  }, [soundLevel]);

  // Real device sound effects (recorded from the WT588F voice chip), overriding
  // the synth placeholders for these events.
  useEffect(() => {
    sfx.useSamples({
      move: "/games/sfx/move_dragon.mp3", // id 7
      push: "/games/sfx/push_ice.mp3", // id 4
      iceFire: "/games/sfx/ice_cube_fire.mp3", // id 9
      levelStart: "/games/sfx/level_start.mp3", // id 14
      levelComplete: "/games/sfx/level_complete.mp3", // id 13
      button: "/games/sfx/menu_up.mp3", // id 2 (menu navigation)
    });
  }, []);

  // keep the engine's vibration intensity in sync (read inside the loop ref)
  useEffect(() => {
    g.current.vibration = vibration;
  }, [vibration]);

  // mirror the menu/setting state into the engine ref so the render loop can draw it
  useEffect(() => {
    const s = g.current;
    s.menuOpen = menuOpen;
    s.menuPage = menuPage;
    s.newLevel = newLevel;
    s.resetArmed = resetArmed;
    s.confirmYes = confirmYes;
    s.volumeV = soundLevel;
    s.brightnessV = brightness;
    menuRef.current = menuOpen;
  }, [menuOpen, menuPage, newLevel, resetArmed, confirmYes, soundLevel, brightness]);

  const persistSet =
    (key: string, set: (v: number) => void) => (v: number) => {
      set(v);
      try {
        localStorage.setItem(key, String(v));
      } catch {}
    };
  const setBright = persistSet(BRIGHT_KEY, setBrightness);
  const setSound = persistSet(SOUND_KEY, setSoundLevel);
  const setVib = persistSet(VIB_KEY, setVibration);
  const clamp = (v: number, hi: number) => Math.max(0, Math.min(hi, v));

  // ---- LED menu navigation (mirrors the firmware's do_menu) ----
  const openMenu = () => {
    setNewLevel(levelNo);
    setMenuPage(0);
    setResetArmed(false);
    setConfirmYes(false);
    setMenuOpen(true);
    sfx.unlock();
  };
  const exitMenu = () => {
    setMenuOpen(false);
    if (newLevel !== levelNo) api.current.goto(newLevel);
  };
  const menuPageDelta = (d: number) => {
    setResetArmed(false);
    setConfirmYes(false);
    setMenuPage((p) => ((p === 5 ? 4 : p) + d + 5) % 5); // cycle pages 0..4
    sfx.play("button");
  };
  const menuAdjust = (up: boolean) => {
    if (menuPage === 0) setNewLevel((n) => (up ? Math.min(total - 1, n + 1) : Math.max(0, n - 1)));
    else if (menuPage === 1) setSound(clamp(soundLevel + (up ? 1 : -1), 5));
    else if (menuPage === 2) setBright(clamp(brightness + (up ? 1 : -1), 2));
    else if (menuPage === 3) {
      setVib(clamp(vibration + (up ? 1 : -1), 2));
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(60);
    } else if (menuPage === 4) setResetArmed(up); // right arms (red), left disarms
    else if (menuPage === 5) setConfirmYes(!up); // left → Yes, right → No
    sfx.play("button");
  };
  const menuOk = () => {
    if (menuPage === 4 && resetArmed) {
      setMenuPage(5);
      setConfirmYes(false);
      sfx.play("button");
    } else if (menuPage === 5 && confirmYes) {
      try {
        localStorage.removeItem(PROGRESS_KEY);
      } catch {}
      sfx.play("levelComplete");
      setMenuOpen(false);
      api.current.goto(0);
    }
  };
  const toggleMenu = () => (menuOpen ? exitMenu() : openMenu());

  menuApi.current.pageDelta = menuPageDelta;
  menuApi.current.adjust = menuAdjust;
  menuApi.current.ok = menuOk;
  menuApi.current.toggle = toggleMenu;

  const onDir = (dx: number, dy: number) => {
    if (menuOpen) {
      if (dy < 0) menuPageDelta(-1);
      else if (dy > 0) menuPageDelta(1);
      else if (dx < 0) menuAdjust(false);
      else if (dx > 0) menuAdjust(true);
    } else {
      api.current.move(dy !== 0 ? dy * COLS : dx);
    }
  };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastRender = 0;
    let mounted = true;
    const s = g.current;

    function loadLevel(n: number) {
      const lv = s.levels[n];
      if (!lv) return;
      s.level = n;
      s.board = new Uint8Array(lv);
      s.player = s.board.indexOf(4) >= 0 ? s.board.indexOf(4) : s.board.indexOf(6);
      s.moves = 0;
      s.pushes = 0;
      s.history = [];
      s.shimmerStart = -1e9;
      s.phase = "intro";
      s.phaseStart = s.clock;
      try {
        const max = Number(localStorage.getItem(PROGRESS_KEY) || 0);
        if (n > max) localStorage.setItem(PROGRESS_KEY, String(n));
      } catch {}
      setLevelNo(n);
      setMoves(0);
      setPushes(0);
      setCanUndo(false);
      setPhase("intro");
      sfx.play("levelStart"); // no-op on first mount (audio not unlocked yet)
    }

    function snapshot() {
      s.history.push({ board: new Uint8Array(s.board), player: s.player, moves: s.moves, pushes: s.pushes });
      if (s.history.length > 400) s.history.shift();
      setCanUndo(true);
    }

    function checkWin(): boolean {
      for (let i = 0; i < N; i++) if (s.board[i] === 2 || s.board[i] === 3) return false;
      return true;
    }

    // haptic buzz on mobile, scaled by the vibration setting (no-op elsewhere)
    function buzz(strong = false) {
      if (!s.vibration) return;
      const nav = typeof navigator !== "undefined" ? navigator : null;
      if (nav && typeof nav.vibrate === "function") {
        nav.vibrate((strong ? 18 : 8) * s.vibration);
      }
    }

    // dir: -COLS up, +COLS down, -1 left, +1 right
    function move(dir: number) {
      if (s.phase !== "play") return;
      const b = s.board;
      const p = s.player;
      // bounds + no horizontal row-wrap
      const col = p % COLS;
      if (dir === -1 && col === 0) return;
      if (dir === 1 && col === COLS - 1) return;
      const t = p + dir;
      if (t < 0 || t >= N) return;

      if (b[t] === 0 || b[t] === 2) {
        // step
        snapshot();
        b[p] -= 4;
        b[t] += 4;
        s.player = t;
        if (b[t] === 4) s.shimmerStart = s.clock; // shimmer only on plain floor
        s.moves++;
        setMoves(s.moves);
        sfx.play("move");
        buzz();
        return;
      }
      if (b[t] === 3 || b[t] === 5) {
        // push — beyond must be in bounds, not wrap, and be floor/pit
        const bcol = t % COLS;
        if (dir === -1 && bcol === 0) return;
        if (dir === 1 && bcol === COLS - 1) return;
        const u = t + dir;
        if (u < 0 || u >= N) return;
        if (b[u] === 0 || b[u] === 2) {
          snapshot();
          b[u] += 3; // cube onto floor(→3) or pit(→5)
          b[t] -= 3; // cube leaves
          b[t] += 4; // dragon arrives
          b[p] -= 4; // dragon leaves
          s.player = t;
          if (b[t] === 4) s.shimmerStart = s.clock;
          s.moves++;
          s.pushes++;
          setMoves(s.moves);
          setPushes(s.pushes);
          sfx.play(b[u] === 5 ? "iceFire" : "push"); // ice cube into a fire pit vs onto floor
          buzz(b[u] === 5);
          if (checkWin()) {
            s.phase = "solved";
            s.phaseStart = s.clock;
            setPhase("solved");
            sfx.play("levelComplete");
            buzz(true);
          }
        }
      }
    }

    function undo() {
      if (s.phase !== "play" || s.history.length === 0) return;
      const h = s.history.pop()!;
      s.board = h.board;
      s.player = h.player;
      s.moves = h.moves;
      s.pushes = h.pushes;
      setMoves(s.moves);
      setPushes(s.pushes);
      setCanUndo(s.history.length > 0);
    }

    function reset() {
      if (s.phase === "loading") return;
      loadLevel(s.level);
    }

    function go(delta: number) {
      const n = Math.min(s.levels.length - 1, Math.max(0, s.level + delta));
      loadLevel(n);
    }

    function goto(n: number) {
      loadLevel(Math.min(s.levels.length - 1, Math.max(0, n)));
    }

    api.current = { move, undo, reset, go, goto };

    // ---------- rendering ----------
    function cellXY(i: number) {
      const c = i % COLS;
      const r = (i / COLS) | 0;
      return [PAD + c * (CELL + GAP), PAD + r * (CELL + GAP)] as const;
    }

    function drawLED(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, glow = true) {
      const cx = x + CELL / 2;
      const cy = y + CELL / 2;
      const c = brighten(color); // small overall brightness bump
      ctx.save();
      if (glow) {
        ctx.shadowColor = c;
        ctx.shadowBlur = CELL * 0.5;
      }
      const grad = ctx.createRadialGradient(cx, cy, CELL * 0.06, cx, cy, CELL * 0.62);
      grad.addColorStop(0, lighten(c, 0.45));
      grad.addColorStop(0.55, c);
      grad.addColorStop(1, darken(c, 0.18)); // less edge falloff -> brighter cell
      ctx.fillStyle = grad;
      roundRect(ctx, x, y, CELL, CELL, CELL * 0.24);
      ctx.fill();
      ctx.restore();
    }

    function drawOff(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.fillStyle = "#0b0f16";
      roundRect(ctx, x, y, CELL, CELL, CELL * 0.24);
      ctx.fill();
    }

    function tileColor(tile: number): string | null {
      switch (tile) {
        case 1:
          return palette[1];
        case 2:
          return pitFrames[Math.floor(s.clock / PIT_MS) % pitFrames.length];
        case 3:
          return palette[3];
        case 4: {
          // dragon: one-shot shimmer (bright flash → base purple) on each move
          const f = Math.floor((s.clock - s.shimmerStart) / SHIM_MS);
          return f >= 0 && f < shiverwingFrames.length ? shiverwingFrames[f] : palette[4];
        }
        case 5:
          return cubePitFrames[Math.floor(s.clock / PIT_MS) % cubePitFrames.length];
        case 6:
          return dragonPitFrames[Math.floor(s.clock / PIT_MS) % dragonPitFrames.length];
        default:
          return null; // empty
      }
    }

    function drawBoard(ctx: CanvasRenderingContext2D, meltColor: string | null) {
      for (let i = 0; i < N; i++) {
        const [x, y] = cellXY(i);
        let color = tileColor(s.board[i]);
        if (meltColor && s.board[i] === 5) color = meltColor; // cube-melt on solve
        if (color) drawLED(ctx, x, y, color);
        else drawOff(ctx, x, y);
      }
    }

    function drawDigits(ctx: CanvasRenderingContext2D, value: number) {
      // off board first
      for (let i = 0; i < N; i++) {
        const [x, y] = cellXY(i);
        drawOff(ctx, x, y);
      }
      const str = String(value).padStart(value >= 100 ? 3 : 2, "0").slice(-3);
      const startCols = [0, 5, 10]; // firmware digit offsets (cols 0,5,10 on row 2)
      const digs = str.padStart(3, " ");
      for (let d = 0; d < 3; d++) {
        const ch = digs[d];
        if (ch === " ") continue;
        const glyph = digitGlyphs[Number(ch)];
        const c0 = startCols[d];
        for (let gy = 0; gy < 6; gy++) {
          for (let gx = 0; gx < 4; gx++) {
            const v = glyph[gy * 4 + gx];
            if (!v) continue;
            const idx = (gy + 2) * COLS + (c0 + gx);
            const [x, y] = cellXY(idx);
            drawLED(ctx, x, y, mix(palette[3], 0, (3 - v) * 0.25), v >= 3);
          }
        }
      }
    }

    function render(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "#04060a";
      ctx.fillRect(0, 0, BOARD_W, BOARD_H);

      if (s.phase === "intro") {
        drawDigits(ctx, s.level + 1);
        return;
      }
      if (s.phase === "solved") {
        const f = Math.min(cubeMeltFrames.length - 1, Math.floor((s.clock - s.phaseStart) / MELT_MS));
        drawBoard(ctx, cubeMeltFrames[f]);
        return;
      }
      drawBoard(ctx, null);
    }

    // The device's on-LED settings menu (Holtek ff_500_levels: menus.h / main.c)
    function renderMenu(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = "#04060a";
      ctx.fillRect(0, 0, BOARD_W, BOARD_H);
      const page = s.menuPage;
      if (page === 0) {
        drawDigits(ctx, s.newLevel + 1); // level select shows the level number
        return;
      }
      const key =
        page === 1 ? "volume" : page === 2 ? "brightness" : page === 3 ? "vibration" : page === 4 ? "clearAll" : "confirm";
      const bmp = menuFrames[key];
      const armed = page === 4 && s.resetArmed;
      for (let i = 0; i < N; i++) {
        const [x, y] = cellXY(i);
        const v = bmp[i];
        if (v > 0) drawLED(ctx, x, y, (armed ? menuRed : menuGrey)[v]);
        else drawOff(ctx, x, y);
      }
      // value bar on rows 7 & 8 (green volume / yellow brightness / blue vibration)
      if (page >= 1 && page <= 3) {
        const len = page === 1 ? volumeBar[s.volumeV] : page === 2 ? brightBar[s.brightnessV] : vibBar[s.vibration];
        const color = page === 1 ? barGreen : page === 2 ? barYellow : barBlue;
        for (let c = 0; c < len; c++) {
          for (const r of [7, 8]) {
            const [x, y] = cellXY(r * COLS + c);
            drawLED(ctx, x, y, color);
          }
        }
      }
      // confirm: highlight Y (cols 0-4) or N (cols 10-13) red over rows 6-9
      if (page === 5) {
        const cols = s.confirmYes ? [0, 1, 2, 3, 4] : [10, 11, 12, 13];
        for (let r = 6; r < 10; r++) {
          for (const c of cols) {
            const i = r * COLS + c;
            const v = bmp[i];
            if (v > 0) {
              const [x, y] = cellXY(i);
              drawLED(ctx, x, y, menuRed[v]);
            }
          }
        }
      }
    }

    function loop(now: number) {
      if (!mounted) return;
      s.clock += now - last;
      last = now;

      // phase timers
      if (s.phase === "intro" && s.clock - s.phaseStart >= INTRO_MS) {
        s.phase = "play";
        setPhase("play");
      }
      if (s.phase === "solved") {
        const meltDone = (s.clock - s.phaseStart) / MELT_MS >= cubeMeltFrames.length;
        if (s.clock - s.phaseStart >= cubeMeltFrames.length * MELT_MS + 700 && meltDone) {
          go(1); // advance to next level
        }
      }

      // throttle the (glow-heavy) draw to ~30fps; the flicker frame time is 70ms
      if (now - lastRender >= 32) {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          if (s.menuOpen) renderMenu(ctx);
          else render(ctx);
        }
        lastRender = now;
      }
      raf = requestAnimationFrame(loop);
    }

    (async () => {
      try {
        const res = await fetch(LEVELS_URL);
        const text = await res.text();
        if (!mounted) return;
        s.levels = parseLevels(text);
        setTotal(s.levels.length);
        let start = 0;
        try {
          start = Math.min(s.levels.length - 1, Number(localStorage.getItem(PROGRESS_KEY) || 0));
        } catch {}
        loadLevel(start);
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } catch {
        /* load failed */
      }
    })();

    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      sfx.unlock();
      if (menuRef.current) {
        // menu navigation: ▲▼ page · ◀▶ adjust · Enter/B select · Esc/M close
        if (k === "arrowup" || k === "w") menuApi.current.pageDelta(-1);
        else if (k === "arrowdown" || k === "s") menuApi.current.pageDelta(1);
        else if (k === "arrowleft" || k === "a") menuApi.current.adjust(false);
        else if (k === "arrowright" || k === "d") menuApi.current.adjust(true);
        else if (k === "enter" || k === "b" || k === " ") menuApi.current.ok();
        else if (k === "escape" || k === "m") menuApi.current.toggle();
        else return;
        e.preventDefault();
        return;
      }
      const map: Record<string, number> = {
        arrowup: -COLS, w: -COLS,
        arrowdown: COLS, s: COLS,
        arrowleft: -1, a: -1,
        arrowright: 1, d: 1,
      };
      if (k in map) {
        e.preventDefault();
        api.current.move(map[k]);
      } else if (k === "u" || k === "z") {
        e.preventDefault();
        api.current.undo();
      } else if (k === "r") {
        e.preventDefault();
        api.current.reset();
      } else if (k === "m") {
        e.preventDefault();
        menuApi.current.toggle(); // open the menu
      } else if (k === "[") {
        api.current.go(-1);
      } else if (k === "]") {
        api.current.go(1);
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // ---------- on-screen controls (faithful D-pad + buttons) ----------
  const DPad = () => (
    <div className="grid grid-cols-3 grid-rows-3 gap-1.5" style={{ width: 168 }}>
      <span />
      <PadBtn label="▲" onPress={() => onDir(0, -1)} />
      <span />
      <PadBtn label="◀" onPress={() => onDir(-1, 0)} />
      <span />
      <PadBtn label="▶" onPress={() => onDir(1, 0)} />
      <span />
      <PadBtn label="▼" onPress={() => onDir(0, 1)} />
      <span />
    </div>
  );

  const m = ZOOM_MODES[zoom];
  const cut = m.cut;
  // canvas covers the cutout (+ a hair of overlap so no edge gap)
  const cutStyle = {
    left: `${(cut.left - 0.004) * 100}%`,
    top: `${(cut.top - 0.004) * 100}%`,
    width: `${(cut.width + 0.008) * 100}%`,
    height: `${(cut.height + 0.008) * 100}%`,
  } as const;
  return (
    <div className="relative flex flex-col items-center">
      {/* Each zoom mode is a self-contained bezel + board: no border, the original
          snowflake bezel, or the full landscape bezel. The board sits in the cutout
          over a black backstop (any sub-pixel gap reads black, not the page). */}
      <div
        className="relative select-none overflow-hidden"
        style={{
          width: `min(92vw, ${m.maxW}px)`,
          aspectRatio: `${m.bw} / ${m.bh}`,
          borderRadius: m.round,
        }}
      >
        <div className="absolute bg-black" style={cutStyle} />
        <canvas
          ref={canvasRef}
          width={BOARD_W}
          height={BOARD_H}
          className="absolute block"
          style={{ ...cutStyle, objectFit: "fill", filter: `brightness(${BRIGHT_FILTER[brightness]})` }}
        />
        {m.bezel && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={m.bezel}
            alt="Freezing Fortress bezel"
            draggable={false}
            className="pointer-events-none absolute inset-0 block h-full w-full select-none"
          />
        )}
        {phase === "loading" && (
          <div className="absolute grid place-items-center bg-black" style={cutStyle}>
            <p className="font-mono text-sm text-white/60">Loading…</p>
          </div>
        )}

        {/* menu / settings (the device's on-LED menu) */}
        <button
          type="button"
          aria-label="Menu"
          onClick={toggleMenu}
          className={`absolute left-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full text-white backdrop-blur-sm transition ${menuOpen ? "bg-accent" : "bg-black/45 hover:bg-black/65"}`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3.2" />
            <path
              d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7L5.3 5.3"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* zoom toggle — no border → snowflake bezel → full bezel */}
        <button
          type="button"
          aria-label="Change zoom"
          onClick={() =>
            setZoom((prev) => {
              const n = (prev + 1) % 3;
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

      {/* HUD */}
      <div className="mt-4 flex items-center gap-5 font-mono text-xs text-slate">
        <span>
          Level <span className="text-ink">{levelNo + 1}</span>
          {total > 0 && <span className="text-slate/60"> / {total}</span>}
        </span>
        <span>Moves <span className="text-ink">{moves}</span></span>
        <span>Pushes <span className="text-ink">{pushes}</span></span>
      </div>

      {/* Controls — the D-pad drives the game, or the menu when it's open */}
      <div className="mt-5 flex w-full max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-5">
        <DPad />
        {menuOpen ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <ActionBtn label="OK" onClick={menuOk} />
              <ActionBtn label="Close" onClick={exitMenu} />
            </div>
            <p className="max-w-[160px] text-center text-[11px] leading-snug text-slate">
              ▲▼ page · ◀▶ adjust · OK to confirm reset
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <ActionBtn label="Undo" onClick={() => api.current.undo()} disabled={!canUndo} />
              <ActionBtn label="Reset" onClick={() => api.current.reset()} />
            </div>
            <div className="flex gap-2">
              <ActionBtn label="◀ Prev" onClick={() => api.current.go(-1)} disabled={levelNo === 0} />
              <ActionBtn label="Next ▶" onClick={() => api.current.go(1)} disabled={levelNo >= total - 1} />
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 max-w-md text-center text-xs leading-relaxed text-slate">
        Push every ice cube into a fire pit. Arrow keys / WASD to move, U to undo,
        R to reset, M for the menu. The real 14×10 LED game — exact colours,
        fire-flicker, cube-melt, and the on-screen menu straight from the firmware.
      </p>
    </div>
  );
}

function PadBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        sfx.unlock();
        onPress();
      }}
      className="grid h-12 w-12 touch-none place-items-center rounded-xl bg-ink text-lg text-white ring-1 ring-white/10 transition active:bg-accent"
    >
      {label}
    </button>
  );
}

function ActionBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink ring-1 ring-line transition hover:ring-accent hover:text-accent disabled:opacity-40 disabled:hover:text-ink disabled:hover:ring-line"
    >
      {label}
    </button>
  );
}
