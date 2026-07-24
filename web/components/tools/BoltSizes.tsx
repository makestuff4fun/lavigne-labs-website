type Row = {
  size: string;
  pitch: number; // coarse, mm
  tapDrill: number; // mm
  clearance: number; // normal clearance hole, mm
  hex: number; // hex head / nut across flats, mm (ISO)
  key: number; // socket cap head hex key, mm
};

// Coarse-thread metric fasteners. Hex A/F per ISO 4017/4032; socket-cap key per ISO 4762.
const ROWS: Row[] = [
  { size: "M1.6", pitch: 0.35, tapDrill: 1.25, clearance: 1.8, hex: 3.2, key: 1.5 },
  { size: "M2", pitch: 0.4, tapDrill: 1.6, clearance: 2.4, hex: 4, key: 1.5 },
  { size: "M2.5", pitch: 0.45, tapDrill: 2.05, clearance: 2.9, hex: 5, key: 2 },
  { size: "M3", pitch: 0.5, tapDrill: 2.5, clearance: 3.4, hex: 5.5, key: 2.5 },
  { size: "M4", pitch: 0.7, tapDrill: 3.3, clearance: 4.5, hex: 7, key: 3 },
  { size: "M5", pitch: 0.8, tapDrill: 4.2, clearance: 5.5, hex: 8, key: 4 },
  { size: "M6", pitch: 1.0, tapDrill: 5.0, clearance: 6.6, hex: 10, key: 5 },
  { size: "M8", pitch: 1.25, tapDrill: 6.8, clearance: 9, hex: 13, key: 6 },
  { size: "M10", pitch: 1.5, tapDrill: 8.5, clearance: 11, hex: 16, key: 8 },
  { size: "M12", pitch: 1.75, tapDrill: 10.2, clearance: 13.5, hex: 18, key: 10 },
];

const th = "px-3 py-2.5 text-left font-mono text-xs uppercase tracking-wide text-slate";
const td = "px-3 py-2.5 text-sm tabular-nums";

export function BoltSizes() {
  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-2xl border border-line shadow-card">
        <table className="w-full min-w-[640px] border-collapse">
          <thead className="bg-mist">
            <tr>
              <th className={th}>Size</th>
              <th className={th}>Pitch (mm)</th>
              <th className={th}>Tap drill (mm)</th>
              <th className={th}>Clearance (mm)</th>
              <th className={th}>Hex A/F (mm)</th>
              <th className={th}>Cap key (mm)</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.size} className={i % 2 ? "bg-white" : "bg-mist/40"}>
                <td className={`${td} font-mono font-semibold text-ink`}>{r.size}</td>
                <td className={td}>{r.pitch}</td>
                <td className={`${td} text-accent`}>{r.tapDrill}</td>
                <td className={td}>{r.clearance}</td>
                <td className={td}>{r.hex}</td>
                <td className={td}>{r.key}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm leading-relaxed text-slate">
        <strong className="text-ink">Tap drill</strong> sizes are for standard
        coarse-pitch threads (~75% thread engagement).{" "}
        <strong className="text-ink">Clearance</strong> is the normal-fit through
        hole. Hex across-flats follows ISO; some DIN parts differ (e.g. M10 hex
        is 17&nbsp;mm under DIN 933). Always confirm against your hardware.
      </p>
    </div>
  );
}
