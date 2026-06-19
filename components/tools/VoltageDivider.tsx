"use client";

import { useState } from "react";

function NumberField({
  label,
  unit,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-slate">
        {label}
      </span>
      <div className="flex items-center rounded-xl border border-line bg-white px-3 focus-within:border-accent">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-2.5 text-sm outline-none"
        />
        <span className="pl-2 text-sm text-slate">{unit}</span>
      </div>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 px-4 py-4 text-center">
      <p className="font-mono text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-white/55">{label}</p>
    </div>
  );
}

function fmt(n: number, unit: string): string {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1 || n === 0) return `${parseFloat(n.toPrecision(4))} ${unit}`;
  if (Math.abs(n) >= 1e-3) return `${parseFloat((n * 1e3).toPrecision(4))} m${unit}`;
  return `${parseFloat((n * 1e6).toPrecision(4))} µ${unit}`;
}

export function VoltageDivider() {
  const [vin, setVin] = useState("5");
  const [r1, setR1] = useState("10000");
  const [r2, setR2] = useState("10000");

  const Vin = parseFloat(vin);
  const R1 = parseFloat(r1);
  const R2 = parseFloat(r2);
  const total = R1 + R2;

  const vout = (Vin * R2) / total;
  const current = Vin / total; // amps
  const power = Vin * current; // watts dissipated by the pair

  return (
    <div className="space-y-7">
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Vin" unit="V" value={vin} onChange={setVin} />
        <NumberField label="R1 (top)" unit="Ω" value={r1} onChange={setR1} />
        <NumberField label="R2 (bottom)" unit="Ω" value={r2} onChange={setR2} />
      </div>

      <div className="rounded-2xl bg-ink p-6 text-white">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-white/45">
          Vout = Vin × R2 / (R1 + R2)
        </p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <Stat label="Vout" value={fmt(vout, "V")} />
          <Stat label="Current" value={fmt(current, "A")} />
          <Stat label="Power (R1+R2)" value={fmt(power, "W")} />
        </div>
      </div>

      <p className="text-sm leading-relaxed text-slate">
        Vout is the voltage at the junction between R1 and R2, measured to ground.
        These figures assume a high-impedance load — if your load draws meaningful
        current, put it in parallel with R2 and recompute.
      </p>
    </div>
  );
}
