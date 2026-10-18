import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import { site, pageUrl, services, engagement, process as howIWork } from "@/content/site";
import { faqs } from "@/content/faq";
import { projects } from "@/content/projects";
import { getAllArticles, getArticle, getArticleSlugs } from "@/lib/articles";

export const API_BASE = "/api/v1";

type Envelope = Record<string, unknown>;

export type Endpoint = {
  /** path under /api/v1/, e.g. "faq.json" */
  path: string;
  name: string;
  description: string;
  mediaType?: string;
  /** listed in index.json (per-article files are served but not listed) */
  listed?: boolean;
  build: () => Envelope;
};

const JSON_TYPE = "application/json";
const url = (p: string) => `${site.url}${API_BASE}/${p}`;
const envelope = (data: Envelope): Envelope => ({
  version: "v1",
  generated: new Date().toISOString(),
  site: site.url,
  ...data,
});

const articleLinks = (slug: string) => ({
  url: pageUrl(`/articles/${slug}`),
  markdownUrl: pageUrl(`/articles/${slug}.md`),
  jsonUrl: url(`articles/${slug}.json`),
});

export function articleBody(slug: string): string {
  const raw = fs.readFileSync(path.join(process.cwd(), "content/articles", `${slug}.md`), "utf8");
  return matter(raw).content.trim();
}

/** Markdown to plain text: drops code fences, images, link syntax, emphasis and heading marks. */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[a-z]*\n?([\s\S]*?)```/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")
    .replace(/(\*\*|__|\*|_|`)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

type SearchRecord = { id: string; type: string; title: string; url: string; text: string; [k: string]: unknown };

function searchRecords(): SearchRecord[] {
  return [
    ...getAllArticles().map((a) => ({
      id: `article:${a.slug}`,
      type: "article",
      slug: a.slug,
      title: a.title,
      url: pageUrl(`/articles/${a.slug}`),
      tag: a.tag,
      excerpt: a.excerpt,
      text: stripMarkdown(articleBody(a.slug)),
    })),
    ...faqs.map((f, i) => ({
      id: `faq:${i + 1}`,
      type: "faq",
      title: f.q,
      url: pageUrl("/faq"),
      text: f.a,
    })),
    ...services.map((s) => ({
      id: `service:${s.id}`,
      type: "service",
      title: s.title,
      url: pageUrl("/"),
      text: [s.summary, ...s.points].join("\n"),
    })),
    ...projects.map((p) => ({
      id: `project:${p.slug}`,
      type: "project",
      title: p.title,
      url: pageUrl("/work"),
      tags: p.tags,
      text: p.blurb,
    })),
    { id: "page:home", type: "page", title: site.name, url: pageUrl("/"), text: site.description },
    { id: "page:work", type: "page", title: "Work", url: pageUrl("/work"), text: projects.map((p) => p.title).join(", ") },
    { id: "page:contact", type: "page", title: "Contact", url: pageUrl("/contact"), text: `Email ${site.email}. ${site.hours}` },
  ];
}

/**
 * THE REGISTRY. Adding an endpoint = adding one entry here; index.json and the
 * static route (app/api/v1/[...endpoint]) pick it up automatically.
 */
export const REGISTRY: Endpoint[] = [
  {
    path: "articles.json",
    name: "articles",
    description: "Every article: slug, title, date, tag, excerpt, readingTime and links to the page, markdown and JSON.",
    build: () => ({ articles: getAllArticles().map((a) => ({ ...a, ...articleLinks(a.slug) })) }),
  },
  {
    path: "services.json",
    name: "services",
    description: "Services offered, plus engagement models and the process for working together.",
    build: () => ({
      services,
      engagement: { intro: engagement.intro, models: engagement.models },
      process: howIWork,
    }),
  },
  {
    path: "faq.json",
    name: "faq",
    description: "All frequently asked questions with answers.",
    build: () => ({ faqs }),
  },
  {
    path: "portfolio.json",
    name: "portfolio",
    description: "Selected projects with summaries, tags and images.",
    build: () => ({
      projects: projects.map((p) => ({ ...p, url: pageUrl("/work"), imageUrl: pageUrl(p.image) })),
    }),
  },
  {
    path: "search-index.json",
    name: "search-index",
    description: "Flat search index: one record (id, type, title, url, text) per article, FAQ, service and project, with full plain-text article bodies.",
    build: () => ({ records: searchRecords() }),
  },
  {
    path: "contact.json",
    name: "contact",
    description: "How to reach Lavigne Labs: email, WeChat, location and hours.",
    build: () => ({
      contact: {
        name: site.founder,
        email: site.email,
        wechat: site.wechat,
        location: site.hours,
        contactPage: pageUrl("/contact"),
      },
    }),
  },
  // Per-article files: served at articles/<slug>.json, not listed individually.
  ...getArticleSlugs().map(
    (slug): Endpoint => ({
      path: `articles/${slug}.json`,
      name: `article:${slug}`,
      description: `Article ${slug}`,
      listed: false,
      build: () => {
        const a = getArticle(slug);
        const { html, ...meta } = a;
        return { ...meta, ...articleLinks(slug), markdown: articleBody(slug), html };
      },
    }),
  ),
];

const INDEX: Endpoint = {
  path: "index.json",
  name: "index",
  description: "Directory of every API endpoint.",
  build: () => ({
    endpoints: [INDEX, ...REGISTRY]
      .filter((e) => e.listed !== false)
      .map((e) => ({
        name: e.name,
        path: `${API_BASE}/${e.path}`,
        url: url(e.path),
        description: e.description,
        mediaType: e.mediaType ?? JSON_TYPE,
      })),
  }),
};

export const ALL_ENDPOINTS: Endpoint[] = [INDEX, ...REGISTRY];

export function findEndpoint(segments: string[]): Endpoint | undefined {
  const p = segments.join("/");
  return ALL_ENDPOINTS.find((e) => e.path === p);
}

export function respond(e: Endpoint): Response {
  return new Response(JSON.stringify(envelope(e.build()), null, 2), {
    headers: { "Content-Type": `${e.mediaType ?? JSON_TYPE}; charset=utf-8` },
  });
}
