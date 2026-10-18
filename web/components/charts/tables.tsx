import data from "@/content/shopCharts.json";

export type MetricRow = (typeof data.metricTap)[number];

/** Display only: integers in mm hole columns keep one decimal (5 -> 5.0), as printed in the JSON. */
const mm = (v: number | null) =>
  v === null ? "—" : `⌀${Number.isInteger(v) ? v.toFixed(1) : v}`;
const plain = (v: number | null) => (v === null ? "—" : String(v));

export const metricRows = data.metricTap;
export const inchRows = data.inchTap;
export const decimals = data.decimals;

export function MetricTable({ rows, prominent = true }: { rows: MetricRow[]; prominent?: boolean }) {
  return (
    <div className="chart-scroll">
      <table className="chart-table">
        <thead>
          <tr>
            <th>Size</th>
            <th>Series</th>
            <th>Pitch</th>
            <th className="tap">Tap drill 75%</th>
            <th>Hard mat. 65%</th>
            <th>Clear close</th>
            <th>Clear normal</th>
            <th>Clear loose</th>
            <th>SHCS c’bore</th>
            <th>C’bore depth</th>
            <th>FHCS c’sink</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const prom = prominent && r.d >= 1.6 && r.d <= 12;
            return (
              <tr key={`${r.size}-${r.pitch}`} className={prominent ? (prom ? "prom" : "minor") : undefined}>
                <td>{r.size}</td>
                <td className="muted">{r.series}</td>
                <td>{plain(r.pitch)}</td>
                <td className="tap">{mm(r.tap)}</td>
                <td>{mm(r.tapHard)}</td>
                <td>{mm(r.clearClose)}</td>
                <td>{mm(r.clearNormal)}</td>
                <td>{mm(r.clearLoose)}</td>
                <td>{mm(r.shcsCbore)}</td>
                <td>{plain(r.shcsCboreDepth)}</td>
                <td>{mm(r.fhcsCsink)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function InchTable() {
  return (
    <div className="chart-scroll">
      <table className="chart-table">
        <thead>
          <tr>
            <th>Size – TPI</th>
            <th>Series</th>
            <th className="tap">Tap drill</th>
            <th className="tap">Decimal in</th>
            <th>Hard mat.</th>
            <th>Decimal in</th>
            <th>Close clear.</th>
            <th>Decimal in</th>
            <th>Free clear.</th>
            <th>Decimal in</th>
          </tr>
        </thead>
        <tbody>
          {inchRows.map((r) => (
            <tr key={r.size}>
              <td>{/^\d+-/.test(r.size) && !r.size.includes("/") ? `#${r.size}` : r.size}</td>
              <td className="muted">{r.series}</td>
              <td className="tap">{r.tap}</td>
              <td className="tap">⌀{r.tapDec}</td>
              <td>{r.tapHard}</td>
              <td>⌀{r.tapHardDec}</td>
              <td>{r.clearClose}</td>
              <td>⌀{r.clearCloseDec}</td>
              <td>{r.clearFree}</td>
              <td>⌀{r.clearFreeDec}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function chunk<T>(a: T[], n: number): T[][] {
  const size = Math.ceil(a.length / n);
  return Array.from({ length: n }, (_, i) => a.slice(i * size, (i + 1) * size));
}

function DecTable({ head, rows }: { head: string; rows: { k: string; i: number; m: number }[] }) {
  return (
    <table className="chart-table">
      <thead>
        <tr><th>{head}</th><th>Inch</th><th>mm</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.k}>
            <td>{r.k}</td>
            <td>⌀{r.i}</td>
            <td>⌀{r.m}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DecimalSections() {
  const fr = chunk(decimals.fractions.map((f) => ({ k: f.frac, i: f.in, m: f.mm })), 2);
  const nu = chunk(decimals.number.map((f) => ({ k: `#${f.n}`, i: f.in, m: f.mm })), 4);
  const le = chunk(decimals.letter.map((f) => ({ k: f.l, i: f.in, m: f.mm })), 2);
  return (
    <>
      <section className="chart-sec">
        <h2>Fractions <small>1/64 – 1 in</small></h2>
        <div className="chart-cols c2">{fr.map((r, i) => <DecTable key={i} head="Fraction" rows={r} />)}</div>
      </section>
      <section className="chart-sec">
        <h2>Number drills <small>#80 – #1</small></h2>
        <div className="chart-cols c4">{nu.map((r, i) => <DecTable key={i} head="Number" rows={r} />)}</div>
      </section>
      <section className="chart-sec">
        <h2>Letter drills <small>A – Z</small></h2>
        <div className="chart-cols c2">{le.map((r, i) => <DecTable key={i} head="Letter" rows={r} />)}</div>
      </section>
    </>
  );
}
