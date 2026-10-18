import { site, pageUrl } from "@/content/site";
import { getAllArticles } from "@/lib/articles";
import { tools, toolHref } from "@/content/tools";

export const dynamic = "force-static"; // for `output: export`

const abs = pageUrl;

const pages = [
  { title: "Home", path: "/", note: "Services and how I work" },
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
    `${site.founder} helps US and Canadian hardware teams manufacture in China: electronics and PCB design, prototyping, and production, from Shenzhen.`,
    "",
    `Contact: ${site.email}`,
    "",
    "## Articles",
    "",
    ...getAllArticles().map(
      (a) => `- [${a.title}](${abs(`/articles/${a.slug}`)}): ${a.excerpt} ([markdown](${abs(`/articles/${a.slug}.md`)}))`,
    ),
    "",
    "## Tools",
    "",
    ...tools.map((t) => `- [${t.title}](${abs(toolHref(t))}): ${t.blurb}`),
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
