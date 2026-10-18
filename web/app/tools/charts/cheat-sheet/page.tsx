import type { Metadata } from "next";
import { ChartShell } from "@/components/charts/ChartShell";
import { HoleDiagram } from "@/components/charts/HoleDiagram";
import { MetricTable, metricRows } from "@/components/charts/tables";

export const metadata: Metadata = {
  title: "Metric Hole Cheat Sheet (M2–M12)",
  description:
    "One-page cheat sheet: tap drill, clearance hole and counterbore for the most-used metric sizes M2, M2.5, M3, M4, M5, M6, M8, M10, M12.",
  alternates: { canonical: "/tools/charts/cheat-sheet/" },
};

const wanted = ["M2", "M2.5", "M3", "M4", "M5", "M6", "M8", "M10", "M12"];

export default function Page() {
  const rows = wanted
    .map((s) => metricRows.find((r) => r.size === s && r.series === "coarse"))
    .filter((r): r is NonNullable<typeof r> => !!r);
  return (
    <ChartShell
      slug="cheat-sheet"
      title="Drill press cheat sheet"
      sub="Most-used metric sizes, coarse thread. Tap, clearance and counterbore in mm."
    >
      <HoleDiagram />
      <section className="chart-sec">
        <MetricTable rows={rows} prominent={false} />
      </section>
    </ChartShell>
  );
}
