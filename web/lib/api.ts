import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import { site, services, engagement, process as howIWork } from "@/content/site";
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
  url: `${site.url}/articles/${slug}`,
  markdownUrl: `${site.url}/articles/${slug}.md`,
  jsonUrl: url(`articles/${slug}.json`),
});

function articleBody(slug: string): string {
  const raw = fs.readFileSync(path.join(process.cwd(), "content/articles", `${slug}.md`), "utf8");
  return matter(raw).content.trim();
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
      projects: projects.map((p) => ({ ...p, url: `${site.url}/work`, imageUrl: `${site.url}${p.image}` })),
    }),
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
        contactPage: `${site.url}/contact`,
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
