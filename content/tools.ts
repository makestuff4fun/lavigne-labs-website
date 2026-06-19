export type Tool = {
  slug: string;
  title: string;
  blurb: string;
  kind: "calculator" | "reference";
};

export const tools: Tool[] = [
  {
    slug: "resistor-calculator",
    title: "Resistor Color Code",
    blurb: "Decode a 4-band resistor to resistance and tolerance — and back.",
    kind: "calculator",
  },
  {
    slug: "voltage-divider",
    title: "Voltage Divider",
    blurb: "Solve Vout, current, and power for a two-resistor divider.",
    kind: "calculator",
  },
  {
    slug: "wire-gauge",
    title: "Wire Gauge & Ampacity",
    blurb: "AWG to diameter, cross-section, resistance, and current capacity.",
    kind: "reference",
  },
  {
    slug: "bolt-sizes",
    title: "Metric Bolt & Thread Sizes",
    blurb: "Pitch, tap-drill, clearance holes, and hex sizes for M-series bolts.",
    kind: "reference",
  },
];

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}
