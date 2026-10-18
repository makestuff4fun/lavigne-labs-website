import type { Metadata } from "next";
import { ChartShell } from "@/components/charts/ChartShell";
import { HoleDiagram } from "@/components/charts/HoleDiagram";
import { MetricTable, metricRows } from "@/components/charts/tables";

export const metadata: Metadata = {
  title: "Metric Tap Drill Chart (M1–M24)",
  description:
    "ISO metric coarse and fine tap drill sizes M1–M24 with hard-material drills, clearance holes, counterbores and countersinks. Printable A4 / US Letter.",
  alternates: { canonical: "/tools/charts/metric-tap-drills/" },
};

export default function Page() {
  return (
    <ChartShell
      slug="metric-tap-drills"
      title="Metric tap drills"
      sub="ISO coarse + fine, M1–M24. Tap drill at 75% thread, 65% for hard material. All sizes in mm."
    >
      <HoleDiagram />
      <section className="chart-sec">
        <h2>Coarse <small>M1.6 – M12 emphasised</small></h2>
        <MetricTable rows={metricRows.filter((r) => r.series === "coarse")} />
      </section>
      <section className="chart-sec">
        <h2>Fine <small>M1.6 – M12 emphasised</small></h2>
        <MetricTable rows={metricRows.filter((r) => r.series === "fine")} />
      </section>
      <p className="chart-note">
        SHCS = socket head cap screw counterbore (diameter and depth). FHCS = flat head countersink diameter. “—” = no value listed.
      </p>
    </ChartShell>
  );
}
