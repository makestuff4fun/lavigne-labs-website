"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildMatrix, QR_SIZE } from "@/lib/qrTimeSync";

const QUIET = 4; // quiet-zone modules on each side of the code

function fmtClock(t: number): string {
  const d = new Date(t);
  const p = (n: number, w: number) => String(n).padStart(w, "0");
  return `${p(d.getHours(), 2)}:${p(d.getMinutes(), 2)}:${p(d.getSeconds(), 2)}.${p(d.getMilliseconds(), 3)}`;
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist font-mono text-xs font-bold text-accent">
        {n}
      </span>
      <span className="leading-relaxed text-slate">{children}</span>
    </li>
  );
}

export function QrTimeSync() {
  const [running, setRunning] = useState(false);
  const [sizeFrac, setSizeFrac] = useState(0.75);
  const [showReadout, setShowReadout] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  const epochRef = useRef<HTMLDivElement>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const stop = useCallback(() => setRunning(false), []);

  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    let scale = 10;
    const layout = () => {
      const avail = Math.min(window.innerWidth, window.innerHeight * 0.78) * sizeFrac;
      scale = Math.max(4, Math.floor(avail / (QR_SIZE + 2 * QUIET)));
      const px = scale * (QR_SIZE + 2 * QUIET);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = px * dpr;
      canvas.height = px * dpr;
      canvas.style.width = `${px}px`;
      canvas.style.height = `${px}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    layout();

    let raf = 0;
    let lastMs = 0;
    const frame = () => {
      const now = Date.now();
      if (now !== lastMs) {
        lastMs = now;
        const m = buildMatrix(String(now));
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        for (let r = 0; r < QR_SIZE; r++) {
          for (let c = 0; c < QR_SIZE; c++) {
            if (m[r][c]) ctx.fillRect((c + QUIET) * scale, (r + QUIET) * scale, scale, scale);
          }
        }
        if (clockRef.current) clockRef.current.textContent = fmtClock(now);
        if (epochRef.current) epochRef.current.textContent = `${now} ms unix`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const acquireWakeLock = async () => {
      try {
        wakeLockRef.current = (await navigator.wakeLock?.request("screen")) ?? null;
      } catch {
        // unsupported or denied — the user's screen-timeout setting applies
      }
    };
    stageRef.current?.requestFullscreen?.({ navigationUI: "hide" }).catch(() => {});
    acquireWakeLock();

    const onVisibility = () => {
      if (document.visibilityState === "visible") acquireWakeLock();
    };
    const onFullscreenExit = () => {
      if (!document.fullscreenElement) stop();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
    };
    window.addEventListener("resize", layout);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("fullscreenchange", onFullscreenExit);
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("fullscreenchange", onFullscreenExit);
      document.removeEventListener("keydown", onKey);
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [running, sizeFrac, stop]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-line bg-white p-7 shadow-card">
        <div className="flex flex-col gap-5">
          <label className="flex items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-medium">QR size</span>
              <span className="block text-xs text-slate">
                Larger is easier to decode from a distance
              </span>
            </span>
            <select
              value={sizeFrac}
              onChange={(e) => setSizeFrac(parseFloat(e.target.value))}
              className="rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            >
              <option value={0.5}>Small</option>
              <option value={0.75}>Medium</option>
              <option value={0.95}>Large</option>
            </select>
          </label>
          <label className="flex items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-medium">Show time readout</span>
              <span className="block text-xs text-slate">
                Human-readable clock under the code
              </span>
            </span>
            <input
              type="checkbox"
              checked={showReadout}
              onChange={(e) => setShowReadout(e.target.checked)}
              className="h-5 w-5 accent-accent"
            />
          </label>
          <button
            onClick={() => setRunning(true)}
            className="rounded-xl bg-ink px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-ink/85"
          >
            Start sync display
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold tracking-tight">How to use it</h2>
        <ol className="mt-4 space-y-3">
          <Step n={1}>
            Set screen brightness to <strong className="text-ink">maximum</strong> and turn off
            auto-brightness.
          </Step>
          <Step n={2}>
            Tap <strong className="text-ink">Start</strong> — the display flashes the current time
            in milliseconds as a QR code, updated every screen refresh, and keeps the screen awake.
          </Step>
          <Step n={3}>
            With every camera already recording, hold the screen in front of each lens for 3–5
            seconds, close enough that the code is sharp.
          </Step>
          <Step n={4}>
            Repeat at the <strong className="text-ink">end</strong> of the session to measure
            clock drift on long recordings.
          </Step>
          <Step n={5}>
            Run the{" "}
            <a
              href="/qr-sync/decode_sync.py"
              download
              className="font-medium text-accent underline underline-offset-2"
            >
              decoder script
            </a>{" "}
            (Python + OpenCV) on each camera&apos;s footage — it decodes the stamps and prints each
            camera&apos;s clock offset and drift, aligning all recordings to one clock.
          </Step>
        </ol>
        <p className="mt-5 text-sm leading-relaxed text-slate">
          Every camera films the same screen, so display latency cancels and the relative sync
          between cameras is sub-frame after the decoder&apos;s linear fit — the same technique
          large egocentric-video datasets use to align head-mounted and tripod cameras. Quick
          link for the field: <span className="font-mono text-ink">lavignelabs.com/qr-sync</span>
        </p>
      </div>

      {running && (
        <div
          ref={stageRef}
          onClick={stop}
          role="button"
          aria-label="Stop sync display (tap anywhere)"
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center gap-6 bg-white"
        >
          <canvas ref={canvasRef} style={{ imageRendering: "pixelated" }} />
          {showReadout && (
            <div className="text-center font-mono tabular-nums text-ink">
              <div ref={clockRef} className="text-3xl font-semibold sm:text-4xl" />
              <div ref={epochRef} className="mt-1 text-sm text-slate" />
            </div>
          )}
          <div className="pointer-events-none fixed inset-x-0 bottom-4 text-center font-mono text-[11px] uppercase tracking-widest text-slate">
            tap anywhere to stop
          </div>
        </div>
      )}
    </div>
  );
}
