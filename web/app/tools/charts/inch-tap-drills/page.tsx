import type { Metadata } from "next";
import { ChartShell } from "@/components/charts/ChartShell";
import { InchTable } from "@/components/charts/tables";

export const metadata: Metadata = {
  title: "Inch Tap Drill Chart (UNC / UNF #0–1/2)",
  description:
    "UNC and UNF tap drill sizes #0 to 1/2 inch with number, letter and fraction drills, decimal equivalents, hard-material drills and clearance holes. Printable.",
  alternates: { canonical: "/tools/charts/inch-tap-drills/" },
};

export default function Page() {
  return (
    <ChartShell
      slug="inch-tap-drills"
      title="Inch tap drills"
      sub="UNC / UNF, #0 to 1/2 in. Drill designation with decimal inches."
    >
      <section className="chart-sec">
        <InchTable />
      </section>
      <p className="chart-note">
        Tap drill in the red column is the standard (about 75%) drill; the hard-material column is the next size up. Close and free are clearance-hole fits.
      </p>
    </ChartShell>
  );
}
