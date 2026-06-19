"use client";

import { useState } from "react";

type Band = {
  name: string;
  hex: string;
  digit: number | null;
  multiplier: number;
  tolerance: number | null;
  text?: "light";
};

const BANDS: Band[] = [
  { name: "Black", hex: "#0b1220", digit: 0, multiplier: 1, tolerance: null, text: "light" },
  { name: "Brown", hex: "#7c3f12", digit: 1, multiplier: 10, tolerance: 1, text: "light" },
  { name: "Red", hex: "#dc2626", digit: 2, multiplier: 100, tolerance: 2, text: "light" },
  { name: "Orange", hex: "#ea7317", digit: 3, multiplier: 1_000, tolerance: null },
  { name: "Yellow", hex: "#facc15", digit: 4, multiplier: 10_000, tolerance: null },
  { name: "Green", hex: "#16a34a", digit: 5, multiplier: 100_000, tolerance: 0.5, text: "light" },
  { name: "Blue", hex: "#2563eb", digit: 6, multiplier: 1_000_000, tolerance: 0.25, text: "light" },
  { name: "Violet", hex: "#7c3aed", digit: 7, multiplier: 10_000_000, tolerance: 0.1, text: "light" },
  { name: "Grey", hex: "#6b7280", digit: 8, multiplier: 100_000_000, tolerance: 0.05, text: "light" },
  { name: "White", hex: "#f8fafc", digit: 9, multiplier: 1_000_000_000, tolerance: null },
  { name: "Gold", hex: "#caa53d", digit: null, multiplier: 0.1, tolerance: 5 },
  { name: "Silver", hex: "#c0c5ce", digit: null, multiplier: 0.01, tolerance: 10 },
];

const digits = BANDS.filter((b) => b.digit !== null);
const multipliers = BANDS.filter((b) => b.name !== "Gold" || true).filter(
  (b) => b.multiplier !== undefined,
);
const tolerances = BANDS.filter((b) => b.tolerance !== null);

function formatOhms(value: number): string {
  if (value >= 1_000_000) return `${trim(value / 1_000_000)} MΩ`;
  if (value >= 1_000) return `${trim(value / 1_000)} kΩ`;
  return `${trim(value)} Ω`;
}
function trim(n: number): string {
  return parseFloat(n.toPrecision(6)).toString();
}

function Swatch({ band }: { band: Band }) {
  return (
    <span
      className="inline-block h-3.5 w-3.5 shrink-0 rounded-sm ring-1 ring-black/10"
      style={{ background: band.hex }}
    />
  );
}

function BandSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Band[];
  value: string;
  onChange: (v: string) => void;
}) {
  const selected = options.find((b) => b.name === value);
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-slate">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 focus-within:border-accent">
        {selected && <Swatch band={selected} />}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        >
          {options.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

export function ResistorCalculator() {
  const [b1, setB1] = useState("Brown");
  const [b2, setB2] = useState("Black");
  const [mult, setMult] = useState("Red");
  const [tol, setTol] = useState("Gold");

  const d1 = digits.find((b) => b.name === b1)!.digit!;
  const d2 = digits.find((b) => b.name === b2)!.digit!;
  const m = multipliers.find((b) => b.name === mult)!.multiplier;
  const t = tolerances.find((b) => b.name === tol)!.tolerance!;
  const value = (d1 * 10 + d2) * m;

  const bandColors = [
    digits.find((b) => b.name === b1)!,
    digits.find((b) => b.name === b2)!,
    multipliers.find((b) => b.name === mult)!,
    tolerances.find((b) => b.name === tol)!,
  ];

  return (
    <div className="space-y-8">
      {/* Resistor preview */}
      <div className="flex items-center justify-center rounded-2xl bg-mist py-10">
        <div className="h-2 w-10 bg-slate/40" />
        <div className="relative flex h-16 items-center gap-2 rounded-lg bg-[#e8d8b0] px-5 shadow-card ring-1 ring-black/10">
          {bandColors.map((b, i) => (
            <span
              key={i}
              className="h-16 w-3 rounded-sm"
              style={{ background: b.hex }}
            />
          ))}
        </div>
        <div className="h-2 w-10 bg-slate/40" />
      </div>

      {/* Result */}
      <div className="rounded-2xl bg-ink px-6 py-7 text-center text-white">
        <p className="font-mono text-3xl font-bold sm:text-4xl">{formatOhms(value)}</p>
        <p className="mt-2 text-sm text-white/60">± {t}% tolerance</p>
      </div>

      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-4">
        <BandSelect label="Band 1" options={digits} value={b1} onChange={setB1} />
        <BandSelect label="Band 2" options={digits} value={b2} onChange={setB2} />
        <BandSelect label="Multiplier" options={multipliers} value={mult} onChange={setMult} />
        <BandSelect label="Tolerance" options={tolerances} value={tol} onChange={setTol} />
      </div>
    </div>
  );
}
