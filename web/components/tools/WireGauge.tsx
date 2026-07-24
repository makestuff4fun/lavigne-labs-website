type Row = {
  awg: string;
  dia: number; // mm
  area: number; // mm^2
  ohms: number; // ohms / km, copper
  chassis: number; // max amps, chassis wiring
  power: number; // max amps, power transmission
};

// Source: standard AWG / PowerStream current-limit reference (copper).
const ROWS: Row[] = [
  { awg: "4", dia: 5.189, area: 21.2, ohms: 0.815, chassis: 135, power: 60 },
  { awg: "6", dia: 4.115, area: 13.3, ohms: 1.296, chassis: 101, power: 37 },
  { awg: "8", dia: 3.264, area: 8.37, ohms: 2.061, chassis: 73, power: 24 },
  { awg: "10", dia: 2.588, area: 5.26, ohms: 3.277, chassis: 55, power: 15 },
  { awg: "12", dia: 2.053, area: 3.31, ohms: 5.211, chassis: 41, power: 9.3 },
  { awg: "14", dia: 1.628, area: 2.08, ohms: 8.286, chassis: 32, power: 5.9 },
  { awg: "16", dia: 1.291, area: 1.31, ohms: 13.17, chassis: 22, power: 3.7 },
  { awg: "18", dia: 1.024, area: 0.823, ohms: 20.95, chassis: 16, power: 2.3 },
  { awg: "20", dia: 0.812, area: 0.518, ohms: 33.31, chassis: 11, power: 1.5 },
  { awg: "22", dia: 0.644, area: 0.326, ohms: 52.96, chassis: 7, power: 0.92 },
  { awg: "24", dia: 0.511, area: 0.205, ohms: 84.22, chassis: 3.5, power: 0.577 },
  { awg: "26", dia: 0.405, area: 0.129, ohms: 133.9, chassis: 2.2, power: 0.361 },
  { awg: "28", dia: 0.321, area: 0.081, ohms: 212.9, chassis: 1.4, power: 0.226 },
  { awg: "30", dia: 0.255, area: 0.051, ohms: 338.6, chassis: 0.86, power: 0.142 },
];

const th = "px-3 py-2.5 text-left font-mono text-xs uppercase tracking-wide text-slate";
const td = "px-3 py-2.5 text-sm tabular-nums";

export function WireGauge() {
  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-2xl border border-line shadow-card">
        <table className="w-full min-w-[640px] border-collapse">
          <thead className="bg-mist">
            <tr>
              <th className={th}>AWG</th>
              <th className={th}>Ø (mm)</th>
              <th className={th}>Area (mm²)</th>
              <th className={th}>Ω / km</th>
              <th className={th}>Chassis (A)</th>
              <th className={th}>Power (A)</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.awg} className={i % 2 ? "bg-white" : "bg-mist/40"}>
                <td className={`${td} font-mono font-semibold text-ink`}>{r.awg}</td>
                <td className={td}>{r.dia}</td>
                <td className={td}>{r.area}</td>
                <td className={td}>{r.ohms}</td>
                <td className={`${td} font-medium text-ink`}>{r.chassis}</td>
                <td className={`${td} text-accent`}>{r.power}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm leading-relaxed text-slate">
        <strong className="text-ink">Chassis</strong> figures suit short, open,
        well-ventilated runs;{" "}
        <strong className="text-ink">power transmission</strong> is the
        conservative column for long runs and bundled wire. Real ampacity also
        depends on insulation rating, ambient temperature, and bundling — treat
        this as a starting point, not a spec.
      </p>
    </div>
  );
}
