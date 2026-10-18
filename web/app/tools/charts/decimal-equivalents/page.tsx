import type { Metadata } from "next";
import { ChartShell } from "@/components/charts/ChartShell";
import { DecimalSections } from "@/components/charts/tables";

export const metadata: Metadata = {
  title: "Drill Decimal Equivalents Chart",
  description:
    "Fraction, number (#80–#1) and letter (A–Z) drill sizes with decimal inch and millimetre equivalents side by side. Printable A4 / US Letter.",
  alternates: { canonical: "/tools/charts/decimal-equivalents/" },
};

export default function Page() {
  return (
    <ChartShell
      slug="decimal-equivalents"
      title="Decimal equivalents"
      sub="Fraction 1/64–1 in, number #80–#1, letter A–Z. Inch and mm side by side."
    >
      <DecimalSections />
    </ChartShell>
  );
}
