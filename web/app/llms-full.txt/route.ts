import { site, pageUrl, services, engagement, process as howIWork } from "@/content/site";
import { faqs } from "@/content/faq";
import { projects } from "@/content/projects";
import { getAllArticles } from "@/lib/articles";
import { articleBody } from "@/lib/api";

export const dynamic = "force-static"; // for `output: export`

export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.founder} helps US and Canadian hardware teams manufacture in China: electronics and PCB design, prototyping, and production, from Shenzhen.`,
    "",
    `Contact: ${site.email}`,
    `Website: ${pageUrl()}`,
    `JSON API: ${pageUrl("/api/v1/index.json")} (OpenAPI 3.1: ${pageUrl("/openapi.json")})`,
    "",
    "## Services",
    "",
    ...services.flatMap((s) => [`### ${s.title}`, "", s.summary, "", ...s.points.map((p) => `- ${p}`), ""]),
    "## Engagement models",
    "",
    engagement.intro,
    "",
    ...engagement.models.flatMap((m) => [`### ${m.name} (${m.tag})`, "", m.body, ""]),
    "## How I work",
    "",
    ...howIWork.map((s) => `${s.step}. **${s.title}**: ${s.body}`),
    "",
    "## FAQ",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Work",
    "",
    ...projects.flatMap((p) => [`### ${p.title}`, "", `URL: ${pageUrl(`/work/${p.slug}`)}`, "", p.blurb, ""]),
    "## Articles",
    "",
    ...getAllArticles().flatMap((a) => [
      `### ${a.title}`,
      "",
      `URL: ${pageUrl(`/articles/${a.slug}`)}`,
      `Tag: ${a.tag} | Date: ${a.date}`,
      "",
      articleBody(a.slug),
      "",
    ]),
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
