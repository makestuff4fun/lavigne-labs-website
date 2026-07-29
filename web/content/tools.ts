export type Tool = {
  slug: string;
  title: string;
  blurb: string;
  kind: "calculator" | "reference";
  /**
   * When set, the tool is a standalone static page (served from public/) and the
   * card links straight to it instead of to a /tools/[slug] React component.
   * These open in a new tab — they carry their own full-page layout.
   */
  href?: string;
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
    slug: "fastener-sheet-metric",
    title: "Fastener Sheet — Metric",
    blurb:
      "Dimensions, hole prep, and a three-view drawing for M2–M20 screws and nuts.",
    kind: "reference",
    href: "/tools/fasteners/fastener-sheet.html",
  },
  {
    slug: "fastener-sheet-inch",
    title: "Fastener Sheet — Inch",
    blurb:
      "The same worksheet for #2–3/4in UNC/UNF screws and nuts.",
    kind: "reference",
    href: "/tools/fasteners/fastener-sheet-inch.html",
  },
  {
    slug: "holding-force-metric",
    title: "Holding Force — Metric",
    blurb:
      "Pick a screw by the load it must hold — safe working load for metric sizes.",
    kind: "calculator",
    href: "/tools/fasteners/holding-force-metric.html",
  },
  {
    slug: "holding-force-inch",
    title: "Holding Force — Inch",
    blurb:
      "Pick a screw by the load it must hold — safe working load for inch sizes.",
    kind: "calculator",
    href: "/tools/fasteners/holding-force-inch.html",
  },
  {
    slug: "torque-metric",
    title: "Tightening Torque — Metric",
    blurb:
      "How tight? Tightening torque, including what the tapped hole can take.",
    kind: "calculator",
    href: "/tools/fasteners/torque-metric.html",
  },
  {
    slug: "torque-inch",
    title: "Tightening Torque — Inch",
    blurb:
      "How tight? Tightening torque for inch sizes, hole strength included.",
    kind: "calculator",
    href: "/tools/fasteners/torque-inch.html",
  },
];

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}
