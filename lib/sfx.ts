/*
 * Tiny Web Audio SFX engine — synthesized placeholder sound effects for the
 * games (no asset files). Designed to be swapped for the real Freezing Fortress
 * clips later: drop WAV/MP3 files in /public/games/sfx/ and call
 *   sfx.useSamples({ move: "/games/sfx/move_dragon.mp3", ... })
 * and those buffers override the synth for any named effect.
 *
 * Browser audio is blocked until a user gesture, so call sfx.unlock() from a
 * click/keydown/touch handler (the games already do this on first input).
 */

export type SfxName =
  | "flap"
  | "score"
  | "crash"
  | "move"
  | "push"
  | "iceFire"
  | "drop"
  | "levelStart"
  | "levelComplete"
  | "button";

const MUTE_KEY = "sfx-muted";
const VOL_KEY = "sfx-volume";
const MAXGAIN = 0.5; // master gain at full volume

type Ctx = AudioContext;

let ctx: Ctx | null = null;
let master: GainNode | null = null;
let muted = false;
let volume = 1; // 0..1
const samples: Partial<Record<SfxName, AudioBuffer>> = {};
const fetched: Partial<Record<SfxName, ArrayBuffer>> = {}; // bytes awaiting decode (after unlock)
const listeners = new Set<(m: boolean) => void>();

function applyGain() {
  if (master) master.gain.value = muted ? 0 : volume * MAXGAIN;
}

function load() {
  if (typeof window === "undefined") return;
  try {
    muted = localStorage.getItem(MUTE_KEY) === "1";
    const v = Number(localStorage.getItem(VOL_KEY));
    if (Number.isFinite(v) && v >= 0 && v <= 1) volume = v;
  } catch {}
}
load();

function ensure(): Ctx | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : volume * MAXGAIN;
    master.connect(ctx.destination);
  }
  return ctx;
}

// Called from the first user gesture. Creating the AudioContext here (not earlier)
// is required for iOS/Safari — a context made outside a gesture can't be resumed.
function unlock() {
  const ac = ensure();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume().catch(() => {});
  decodePending();
}

// Decode any pre-fetched sample bytes, once the context exists (i.e. after unlock).
function decodePending() {
  if (!ctx) return;
  for (const key of Object.keys(fetched) as SfxName[]) {
    const buf = fetched[key];
    if (!buf || samples[key]) continue;
    delete fetched[key];
    ctx
      .decodeAudioData(buf)
      .then((b) => {
        samples[key] = b;
      })
      .catch(() => {});
  }
}

// ---------- synth primitives ----------
function tone(
  ac: Ctx,
  dest: AudioNode,
  opts: { type?: OscillatorType; f0: number; f1?: number; dur: number; gain?: number; delay?: number },
) {
  const { type = "square", f0, f1 = f0, dur, gain = 0.2, delay = 0 } = opts;
  const t = ac.currentTime + delay;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + 0.03);
}

function noise(
  ac: Ctx,
  dest: AudioNode,
  opts: { dur: number; gain?: number; type?: BiquadFilterType; freq?: number; freqTo?: number; q?: number },
) {
  const { dur, gain = 0.2, type = "highpass", freq = 2000, freqTo, q = 0.7 } = opts;
  const t = ac.currentTime;
  const buf = ac.createBuffer(1, Math.max(1, Math.floor(ac.sampleRate * dur)), ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const f = ac.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  if (freqTo) f.frequency.exponentialRampToValueAtTime(Math.max(1, freqTo), t + dur);
  f.Q.value = q;
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(dest);
  src.start(t);
  src.stop(t + dur + 0.03);
}

// ---------- the synth voices (placeholders, tuned to feel close to the badge) ----------
const synth: Record<SfxName, (ac: Ctx, out: AudioNode) => void> = {
  flap: (ac, o) => tone(ac, o, { type: "square", f0: 380, f1: 720, dur: 0.08, gain: 0.16 }),
  score: (ac, o) => {
    tone(ac, o, { type: "sine", f0: 988, dur: 0.16, gain: 0.22 });
    tone(ac, o, { type: "sine", f0: 1976, dur: 0.16, gain: 0.06 });
  },
  crash: (ac, o) => {
    noise(ac, o, { dur: 0.3, gain: 0.3, type: "highpass", freq: 2600, q: 0.5 });
    tone(ac, o, { type: "square", f0: 220, f1: 70, dur: 0.22, gain: 0.18 });
  },
  move: (ac, o) => tone(ac, o, { type: "triangle", f0: 300, f1: 440, dur: 0.05, gain: 0.12 }),
  push: (ac, o) => {
    noise(ac, o, { dur: 0.13, gain: 0.18, type: "lowpass", freq: 900, freqTo: 250, q: 1 });
    tone(ac, o, { type: "square", f0: 180, f1: 110, dur: 0.12, gain: 0.12 });
  },
  iceFire: (ac, o) => {
    tone(ac, o, { type: "triangle", f0: 1300, f1: 620, dur: 0.12, gain: 0.18 });
    noise(ac, o, { dur: 0.18, gain: 0.12, type: "highpass", freq: 4000, freqTo: 1200 });
  },
  drop: (ac, o) => tone(ac, o, { type: "square", f0: 320, f1: 110, dur: 0.18, gain: 0.18 }),
  levelStart: (ac, o) => {
    tone(ac, o, { type: "square", f0: 523, dur: 0.08, gain: 0.16 });
    tone(ac, o, { type: "square", f0: 784, dur: 0.1, gain: 0.16, delay: 0.09 });
  },
  levelComplete: (ac, o) => {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone(ac, o, { type: "square", f0: f, dur: 0.12, gain: 0.18, delay: i * 0.1 }),
    );
  },
  button: (ac, o) => tone(ac, o, { type: "square", f0: 1200, dur: 0.03, gain: 0.1 }),
};

function play(name: SfxName) {
  // No-op until the first gesture has created the context (don't create it here —
  // a context made outside a gesture is silent on iOS).
  if (muted || !ctx || !master) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  const sample = samples[name];
  if (sample) {
    const src = ctx.createBufferSource();
    src.buffer = sample;
    src.connect(master);
    src.start();
    return;
  }
  try {
    synth[name](ctx, master);
  } catch {}
}

function setMuted(m: boolean) {
  muted = m;
  applyGain();
  try {
    localStorage.setItem(MUTE_KEY, m ? "1" : "0");
  } catch {}
  listeners.forEach((fn) => fn(m));
}

function setVolume(v: number) {
  volume = Math.max(0, Math.min(1, v));
  applyGain();
  try {
    localStorage.setItem(VOL_KEY, String(volume));
  } catch {}
}

/** Override synth voices with real audio files. The bytes are fetched now, but
 *  decoding waits until the first gesture (unlock) so the AudioContext is created
 *  in-gesture — required for audio to work on iOS/Safari. */
async function useSamples(map: Partial<Record<SfxName, string>>) {
  await Promise.all(
    (Object.entries(map) as [SfxName, string][]).map(async ([name, url]) => {
      try {
        fetched[name] = await (await fetch(url)).arrayBuffer();
      } catch {}
    }),
  );
  decodePending(); // decode now if already unlocked; otherwise unlock() will
}

export const sfx = {
  unlock,
  play,
  isMuted: () => muted,
  setMuted,
  toggle: () => setMuted(!muted),
  getVolume: () => volume,
  setVolume,
  subscribe: (fn: (m: boolean) => void) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  useSamples,
};
