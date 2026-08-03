export type ToolCategory = "Fasteners" | "Electronics";

export type Tool = {
  slug: string;
  title: string;
  blurb: string;
  kind: "calculator" | "reference" | "field tool";
  /** Section the tool is grouped under on the /tools page. */
  category: ToolCategory;
  /**
   * When set, the tool is a standalone static page (served from public/) and the
   * card links straight to it instead of to a /tools/[slug] React component.
   * These open in a new tab — they carry their own full-page layout.
   */
  href?: string;
};

/** Section order + intro copy for the /tools page. */
export const toolCategories: { name: ToolCategory; blurb: string }[] = [
  {
    name: "Fasteners",
    blurb:
      "Screw and nut sizing — dimensions, hole prep, holding force, and tightening torque, in metric and inch.",
  },
  {
    name: "Electronics",
    blurb: "PCB and circuit math for board layout and bring-up.",
  },
];

export const tools: Tool[] = [
  {
    slug: "fastener-sheet-metric",
    title: "Fastener Sheet — Metric",
    blurb:
      "Dimensions, hole prep, and a three-view drawing for M2–M20 screws and nuts.",
    kind: "reference",
    category: "Fasteners",
    href: "/tools/fasteners/fastener-sheet.html",
  },
  {
    slug: "fastener-sheet-inch",
    title: "Fastener Sheet — Inch",
    blurb: "The same worksheet for #2–3/4in UNC/UNF screws and nuts.",
    kind: "reference",
    category: "Fasteners",
    href: "/tools/fasteners/fastener-sheet-inch.html",
  },
  {
    slug: "holding-force-metric",
    title: "Holding Force — Metric",
    blurb:
      "Pick a screw by the load it must hold — safe working load for metric sizes.",
    kind: "calculator",
    category: "Fasteners",
    href: "/tools/fasteners/holding-force-metric.html",
  },
  {
    slug: "holding-force-inch",
    title: "Holding Force — Inch",
    blurb:
      "Pick a screw by the load it must hold — safe working load for inch sizes.",
    kind: "calculator",
    category: "Fasteners",
    href: "/tools/fasteners/holding-force-inch.html",
  },
  {
    slug: "torque-metric",
    title: "Tightening Torque — Metric",
    blurb:
      "How tight? Tightening torque, including what the tapped hole can take.",
    kind: "calculator",
    category: "Fasteners",
    href: "/tools/fasteners/torque-metric.html",
  },
  {
    slug: "torque-inch",
    title: "Tightening Torque — Inch",
    blurb:
      "How tight? Tightening torque for inch sizes, hole strength included.",
    kind: "calculator",
    category: "Fasteners",
    href: "/tools/fasteners/torque-inch.html",
  },
  {
    slug: "pcb",
    title: "Copper & Patina — PCB Calculators",
    blurb:
      "Ten hobbyist PCB calculators on one page — trace width, vias, impedance, dividers, filters, shunts, and reference tables.",
    kind: "calculator",
    category: "Electronics",
    href: "/tools/pcb/pcb-calculator.html",
  },
];

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}

/** Public URL for a tool's card — its static page (href) or its /tools/[slug] route. */
export function toolHref(t: Tool) {
  return t.href ?? `/tools/${t.slug}`;
}

/** Tools belonging to a category, in declared order. */
export function toolsInCategory(category: ToolCategory) {
  return tools.filter((t) => t.category === category);
}
