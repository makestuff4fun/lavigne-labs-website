import data from "@/content/shopCharts.json";
import { pageUrl } from "@/content/site";

export type HowToStep = { name: string; text: string };

export type ChartMeta = {
  slug: string;
  /** slug of the matching entry in content/tools.ts */
  toolId: string;
  title: string;
  description: string;
  howTo?: { name: string; steps: HowToStep[] };
};

export const chartLicense =
  "Reference values published as-is for free use and printing in your own shop; verify against your own tooling before cutting. Attribution to Lavigne Labs appreciated.";

export const chartMetas: ChartMeta[] = [
  {
    slug: "metric-tap-drills",
    toolId: "chart-metric-tap-drills",
    title: "Metric Tap Drill Chart (M1–M24)",
    description:
      "ISO metric coarse and fine tap drill sizes M1–M24 (75% thread, 65% for hard material) with clearance holes, SHCS counterbores and FHCS countersinks. All sizes in mm.",
    howTo: {
      name: "How to pick a metric tap drill",
      steps: [
        { name: "Find the thread", text: "Locate the screw size (for example M6) in the Size column and choose coarse or fine by its pitch." },
        { name: "Read the tap drill", text: "Use the Tap drill 75% column for the drill diameter in mm (M6 coarse: 5.0 mm)." },
        { name: "Adjust for hard material", text: "For stainless steel or tool steel use the Hard mat. 65% column, which is slightly larger and easier on the tap." },
        { name: "Drill, then tap", text: "Drill the hole to the full thread depth plus a few threads, deburr it, then cut the thread with a tap lubricated for the material." },
      ],
    },
  },
  {
    slug: "inch-tap-drills",
    toolId: "chart-inch-tap-drills",
    title: "Inch Tap Drill Chart (UNC / UNF #0–1/2)",
    description:
      "UNC and UNF tap drill sizes #0 to 1/2 inch with number, letter and fraction drill designations, decimal inches, hard-material drills and clearance holes.",
    howTo: {
      name: "How to pick an inch tap drill",
      steps: [
        { name: "Find the thread", text: "Locate the screw size and threads per inch (for example 1/4-20 UNC) in the Size – TPI column." },
        { name: "Read the tap drill", text: "Use the Tap drill column for the drill designation (number, letter or fraction) and the Decimal in column for its diameter (1/4-20: #7, 0.201 in)." },
        { name: "Adjust for hard material", text: "For hard or tough material use the Hard mat. column, the next drill size up." },
        { name: "Drill, then tap", text: "Drill to the full thread depth plus a few threads, deburr, then cut the thread with a tap and cutting fluid." },
      ],
    },
  },
  {
    slug: "decimal-equivalents",
    toolId: "chart-decimal-equivalents",
    title: "Drill Decimal Equivalents",
    description:
      "Fraction (1/64–1 in), number (#80–#1) and letter (A–Z) drill sizes with decimal inch and millimetre equivalents.",
  },
  {
    slug: "cheat-sheet",
    toolId: "chart-cheat-sheet",
    title: "Metric Hole Cheat Sheet (M2–M12)",
    description:
      "One-page cheat sheet: tap drill, clearance hole and counterbore for the most-used coarse metric sizes M2, M2.5, M3, M4, M5, M6, M8, M10, M12.",
  },
];

export const cheatSizes = ["M2", "M2.5", "M3", "M4", "M5", "M6", "M8", "M10", "M12"];

export const getChartMeta = (slug: string) => chartMetas.find((c) => c.slug === slug);

export const chartLinks = (slug: string) => ({
  pageUrl: pageUrl(`/tools/charts/${slug}`),
  pdfA4Url: pageUrl(`/tools/charts/${slug}-a4.pdf`),
  pdfLetterUrl: pageUrl(`/tools/charts/${slug}-letter.pdf`),
  jsonUrl: pageUrl(`/api/v1/charts/${slug}.json`),
});

type Metric = (typeof data.metricTap)[number];

function cheatRows(): Metric[] {
  return cheatSizes
    .map((s) => data.metricTap.find((r) => r.size === s && r.series === "coarse"))
    .filter((r): r is Metric => !!r);
}

/** The real table data for one chart, straight from content/shopCharts.json. */
export function chartData(slug: string): Record<string, unknown> {
  switch (slug) {
    case "metric-tap-drills":
      return {
        units: "mm",
        notes: "tap = 75% thread drill; tapHard = 65% thread drill for hard material; clear* = clearance holes (close/normal/loose); shcsCbore/shcsCboreDepth = socket head cap screw counterbore diameter and depth; fhcsCsink = flat head countersink diameter. null = no value listed.",
        rows: data.metricTap,
      };
    case "inch-tap-drills":
      return {
        units: "inch (decimal columns *Dec)",
        notes: "tap = standard (about 75%) drill designation, tapHard = next size up for hard material, clearClose/clearFree = clearance-hole fits; *Dec = decimal inches.",
        rows: data.inchTap,
      };
    case "decimal-equivalents":
      return { units: "inch and mm", ...data.decimals };
    case "cheat-sheet":
      return { units: "mm", notes: "Coarse thread only.", sizes: cheatSizes, rows: cheatRows() };
    default:
      throw new Error(`unknown chart ${slug}`);
  }
}

export function chartsCatalog() {
  return chartMetas.map((m) => ({
    slug: m.slug,
    title: m.title,
    description: m.description,
    license: chartLicense,
    ...chartLinks(m.slug),
    ...(m.howTo ? { howTo: m.howTo } : {}),
  }));
}

const cell = (v: unknown) => (v === null || v === undefined ? "—" : String(v));
const md = (head: string[], rows: unknown[][]) =>
  [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.map(cell).join(" | ")} |`)].join("\n");

const metricMd = (rows: Metric[]) =>
  md(
    ["Size", "Series", "Pitch", "Tap 75%", "Hard 65%", "Clear close", "Clear normal", "Clear loose", "SHCS c'bore", "c'bore depth", "FHCS c'sink"],
    rows.map((r) => [r.size, r.series, r.pitch, r.tap, r.tapHard, r.clearClose, r.clearNormal, r.clearLoose, r.shcsCbore, r.shcsCboreDepth, r.fhcsCsink]),
  );

/** Markdown rendering of one chart's tables (for llms-full.txt). */
export function chartMarkdown(slug: string): string {
  switch (slug) {
    case "metric-tap-drills":
      return `All sizes in mm.\n\n${metricMd(data.metricTap)}`;
    case "inch-tap-drills":
      return md(
        ["Size", "Series", "Tap drill", "Tap (in)", "Hard mat.", "Hard (in)", "Close clear.", "Close (in)", "Free clear.", "Free (in)"],
        data.inchTap.map((r) => [r.size, r.series, r.tap, r.tapDec, r.tapHard, r.tapHardDec, r.clearClose, r.clearCloseDec, r.clearFree, r.clearFreeDec]),
      );
    case "decimal-equivalents":
      return [
        "Fractions:\n\n" + md(["Fraction", "Inch", "mm"], data.decimals.fractions.map((r) => [r.frac, r.in, r.mm])),
        "Number drills:\n\n" + md(["Number", "Inch", "mm"], data.decimals.number.map((r) => [`#${r.n}`, r.in, r.mm])),
        "Letter drills:\n\n" + md(["Letter", "Inch", "mm"], data.decimals.letter.map((r) => [r.l, r.in, r.mm])),
      ].join("\n\n");
    case "cheat-sheet":
      return `Coarse thread, mm.\n\n${metricMd(cheatRows())}`;
    default:
      return "";
  }
}

/** JSON-LD for a chart page: Dataset plus (where defined) HowTo. */
export function chartJsonLd(slug: string) {
  const m = getChartMeta(slug);
  if (!m) return [];
  const l = chartLinks(slug);
  const creator = { "@type": "Organization", name: "Lavigne Labs", url: pageUrl() };
  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: m.title,
    description: m.description,
    url: l.pageUrl,
    creator,
    publisher: creator,
    license: chartLicense,
    isAccessibleForFree: true,
    inLanguage: "en",
    keywords: ["tap drill", "machining", "thread", "drill size", "shop chart"],
    distribution: [
      { "@type": "DataDownload", name: `${m.title} (A4 PDF)`, encodingFormat: "application/pdf", contentUrl: l.pdfA4Url },
      { "@type": "DataDownload", name: `${m.title} (US Letter PDF)`, encodingFormat: "application/pdf", contentUrl: l.pdfLetterUrl },
      { "@type": "DataDownload", name: `${m.title} (JSON)`, encodingFormat: "application/json", contentUrl: l.jsonUrl },
    ],
  };
  const howTo = m.howTo && {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: m.howTo.name,
    description: m.description,
    step: m.howTo.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text, url: `${l.pageUrl}#how-to-use` })),
  };
  return howTo ? [dataset, howTo] : [dataset];
}
