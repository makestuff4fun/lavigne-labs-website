import { site, pageUrl, services, engagement, philosophy, bestFit, founderStory, process as howWeWork } from "@/content/site";
import { faqs } from "@/content/faq";
import { projects } from "@/content/projects";
import { allSeries } from "@/content/series";
import { getAllArticles, getSeriesArticles } from "@/lib/articles";
import { chartMetas, chartLinks, chartMarkdown, chartLicense } from "@/lib/charts";
import { articleBody } from "@/lib/api";

export const dynamic = "force-static"; // for `output: export`

export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `Founded by ${site.founder}: ${site.name} is a Shenzhen hardware product-development team (electronics and PCB design, prototyping, and production).`,
    "",
    `Contact: ${site.email}`,
    `Website: ${pageUrl()}`,
    `JSON API: ${pageUrl("/api/v1/index.json")} (OpenAPI 3.1: ${pageUrl("/openapi.json")})`,
    "",
    "## Services",
    "",
    ...services.flatMap((s) => [`### ${s.title}`, "", s.summary, "", ...s.points.map((p) => `- ${p}`), ""]),
    "## Philosophy",
    "",
    philosophy.line,
    "",
    philosophy.body,
    "",
    `## ${bestFit.title}`,
    "",
    ...bestFit.lines.map((l) => `- ${l}`),
    "",
    `## ${founderStory.heading}`,
    "",
    ...founderStory.paragraphs.flatMap((p) => [p, ""]),
    "## How we work together",
    "",
    engagement.intro,
    "",
    ...engagement.models.flatMap((m) => [`### ${m.name} (${m.tag})`, "", m.body, ""]),
    "## How we work",
    "",
    ...howWeWork.map((s) => `${s.step}. **${s.title}**: ${s.body}`),
    "",
    "## FAQ",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Work",
    "",
    ...projects.flatMap((p) => [`### ${p.title}`, "", `URL: ${pageUrl(`/work/${p.slug}`)}`, "", p.blurb, ""]),
    "## Shop charts",
    "",
    `Printable reference charts, also served as data at ${pageUrl("/api/v1/charts.json")}. ${chartLicense}`,
    "",
    ...chartMetas.flatMap((m) => {
      const l = chartLinks(m.slug);
      return [
        `### ${m.title}`,
        "",
        `URL: ${l.pageUrl}`,
        `JSON: ${l.jsonUrl} | PDF: ${l.pdfA4Url} (A4), ${l.pdfLetterUrl} (US Letter)`,
        "",
        m.description,
        "",
        chartMarkdown(m.slug),
        "",
        ...(m.howTo ? [`#### HowTo: ${m.howTo.name}`, "", ...m.howTo.steps.map((s, i) => `${i + 1}. ${s.name}: ${s.text}`), ""] : []),
      ];
    }),
    "## Article series",
    "",
    ...allSeries.flatMap((s) => [
      `### ${s.title}`,
      "",
      `URL: ${pageUrl(`/articles/series/${s.slug}`)}`,
      "",
      s.intro,
      "",
      ...getSeriesArticles(s.slug).map((a, i) => `${i + 1}. [${a.title}](${pageUrl(`/articles/${a.slug}`)})`),
      "",
    ]),
    "## Articles",
    "",
    ...getAllArticles().flatMap((a) => [
      `### ${a.title}`,
      "",
      `URL: ${pageUrl(`/articles/${a.slug}`)}`,
      `Tag: ${a.tag} | Date: ${a.date}${a.author ? ` | Author: ${a.author}` : ""}`,
      "",
      articleBody(a.slug),
      "",
      ...(a.faq?.length ? ["#### Quick answers", "", ...a.faq.flatMap((f) => [`Q: ${f.q}`, `A: ${f.a}`, ""])] : []),
      ...(a.howto ? [`#### HowTo: ${a.howto.name}`, "", ...a.howto.steps.map((s, i) => `${i + 1}. ${s.name}: ${s.text}`), ""] : []),
    ]),
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
