import { site, pageUrl, philosophy } from "@/content/site";
import { allSeries } from "@/content/series";
import { getAllArticles, getSeriesArticles } from "@/lib/articles";
import { projects } from "@/content/projects";
import { chartMetas, chartLinks } from "@/lib/charts";
import { tools, toolHref } from "@/content/tools";

export const dynamic = "force-static"; // for `output: export`

const abs = pageUrl;

const pages = [
  { title: "Home", path: "/", note: "Services and how we work together" },
  { title: "Work", path: "/work", note: "Selected projects" },
  { title: "FAQ", path: "/faq", note: "Common questions" },
  { title: "Contact", path: "/contact", note: "Get in touch" },
  { title: "Lab", path: "/lab", note: "Lab notes" },
  { title: "Play", path: "/play", note: "Games" },
];

export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `Founded by ${site.founder}, who has 13+ years in China, ran an LED factory for Black & Decker for six years and worked with two EV startups. ${philosophy.line} Best fit: funded startups and teams with a completed Kickstarter.`,
    "",
    `Contact: ${site.email} (inquiries can also be sent via the form on /contact)`,
    "",
    `Full site as one Markdown document: [llms-full.txt](${abs("/llms-full.txt")})`,
    "",
    `JSON API: [index.json](${abs("/api/v1/index.json")}) lists every endpoint; OpenAPI 3.1 description: [openapi.json](${abs("/openapi.json")})`,
    "",
    "## Article series",
    "",
    ...allSeries.flatMap((s) => [
      `- [${s.title}](${abs(`/articles/series/${s.slug}`)}): ${s.intro}`,
      ...getSeriesArticles(s.slug).map(
        (a, i) => `  ${i + 1}. [${a.title}](${abs(`/articles/${a.slug}`)})`,
      ),
    ]),
    "",
    "## Articles",
    "",
    ...getAllArticles().map(
      (a) => `- [${a.title}](${abs(`/articles/${a.slug}`)}): ${a.excerpt} ([markdown](${abs(`/articles/${a.slug}.md`)}))`,
    ),
    "",
    "## Work",
    "",
    ...projects.map((p) => `- [${p.title}](${abs(`/work/${p.slug}`)}): ${p.blurb}`),
    "",
    "## Tools",
    "",
    ...tools.map((t) => `- [${t.title}](${abs(toolHref(t))}): ${t.blurb}`),
    "",
    "## Shop charts (data + printable PDFs)",
    "",
    `- [All charts as JSON](${abs("/api/v1/charts.json")}): full tables for the four charts below`,
    ...chartMetas.map((m) => {
      const l = chartLinks(m.slug);
      return `- [${m.title}](${l.pageUrl}): ${m.description} ([JSON](${l.jsonUrl}), [A4 PDF](${l.pdfA4Url}), [Letter PDF](${l.pdfLetterUrl}))`;
    }),
    "",
    "## Pages",
    "",
    ...pages.map((p) => `- [${p.title}](${abs(p.path)}): ${p.note}`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
