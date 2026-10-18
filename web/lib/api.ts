import { site, pageUrl, services, engagement, philosophy, bestFit, process as howWeWork } from "@/content/site";
import { faqs } from "@/content/faq";
import { projects } from "@/content/projects";
import { projectDetails } from "@/content/projectDetails";
import { projectGalleries } from "@/content/projectGalleries";
import { toolSpecs } from "@/content/toolSpecs";
import { getAllArticles, getArticle, getArticleSlugs, getArticleBody, getSeriesArticles } from "@/lib/articles";
import imageCredits from "@/content/image-credits.json";
import { allSeries } from "@/content/series";
import { chartMetas, chartsCatalog, chartData, chartLinks, chartLicense } from "@/lib/charts";

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

export const articleBody = getArticleBody;

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
      ...(a.author ? { author: a.author } : {}),
      text: stripMarkdown(articleBody(a.slug)),
    })),
    ...getAllArticles().flatMap((a) =>
      (a.faq ?? []).map((f, i) => ({
        id: `article-faq:${a.slug}:${i + 1}`,
        type: "faq",
        title: f.q,
        url: pageUrl(`/articles/${a.slug}#quick-answers`),
        article: a.slug,
        text: f.a,
      })),
    ),
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
      url: pageUrl(`/work/${p.slug}`),
      tags: p.tags,
      text: [p.blurb, stripMarkdown(projectDetails[p.slug]?.description ?? "")].filter(Boolean).join("\n\n"),
    })),
    ...chartMetas.map((m) => ({
      id: `chart:${m.slug}`,
      type: "tool",
      slug: m.slug,
      title: m.title,
      url: chartLinks(m.slug).pageUrl,
      text: [m.description, ...(m.howTo?.steps.map((st) => `${st.name}: ${st.text}`) ?? [])].join("\n"),
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
    path: "image-credits.json",
    name: "image-credits",
    description: "Provenance of every stock (non-original) image used in articles: file, article, source URL, photographer, licence (Unsplash/Pexels) and alt text.",
    build: () => ({
      images: (imageCredits as Array<Record<string, string>>).map((c) => ({
        ...c,
        url: pageUrl(c.file.startsWith("/") ? c.file : `/images/articles/${c.file}`),
      })),
    }),
  },
  {
    path: "articles.json",
    name: "articles",
    description: "Every article: slug, title, date, tag, excerpt, readingTime and links to the page, markdown and JSON.",
    build: () => ({ articles: getAllArticles().map((a) => ({ ...a, ...articleLinks(a.slug) })) }),
  },
  {
    path: "series.json",
    name: "series",
    description: "Article series (e.g. Field Notes from China): slug, title, intro, url and the ordered list of published articles.",
    build: () => ({
      series: allSeries.map((s) => ({
        slug: s.slug,
        title: s.title,
        intro: s.intro,
        url: pageUrl(`/articles/series/${s.slug}`),
        articles: getSeriesArticles(s.slug).map((a, i) => ({
          order: i + 1,
          slug: a.slug,
          title: a.title,
          date: a.date,
          excerpt: a.excerpt,
          ...articleLinks(a.slug),
        })),
      })),
    }),
  },
  {
    path: "services.json",
    name: "services",
    description: "Services offered, plus how we work together (prototype sprints, development to production, production support) and our process.",
    build: () => ({
      services,
      howWeWorkTogether: { intro: engagement.intro, models: engagement.models },
      philosophy,
      bestFit,
      process: howWeWork,
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
      projects: projects.map((p) => ({
        ...p,
        url: pageUrl(`/work/${p.slug}`),
        imageUrl: pageUrl(p.image),
        galleryUrls: (projectGalleries[p.slug] ?? []).map((g) => pageUrl(g.src)),
      })),
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
    description: "How to reach the Lavigne Labs team: email, WeChat, location and hours. Brian Barrett is the first contact.",
    build: () => ({
      contact: {
        name: site.founder,
        email: site.email,
        wechat: site.wechat,
        location: site.hours,
        contactPage: pageUrl("/contact"),
        inquiryNote: "Inquiries can also be sent via the form on /contact.",
      },
    }),
  },
  {
    path: "tools.json",
    name: "tools",
    description: "Machine-readable specs for the site's calculators and reference sheets: listing with links to tools/<id>.json (inputs with units and ranges, outputs, formula, worked examples).",
    build: () => ({
      tools: toolSpecs.map((t) => ({
        id: t.id,
        title: t.title,
        kind: t.kind,
        summary: t.summary,
        jsonUrl: url(`tools/${t.id}.json`),
        pageUrl: t.url,
      })).concat(
        chartMetas.map((m) => ({
          id: m.toolId,
          title: m.title,
          kind: "reference",
          summary: m.description,
          ...chartLinks(m.slug),
        })),
      ),
    }),
  },
  {
    path: "charts.json",
    name: "charts",
    description: "Shop charts as data: metric and inch tap drills, decimal equivalents and the M2–M12 cheat sheet, with the full tables from the printable charts plus page and PDF (A4, US Letter) links.",
    build: () => ({
      license: chartLicense,
      charts: chartMetas.map((m) => ({
        slug: m.slug,
        title: m.title,
        description: m.description,
        ...chartLinks(m.slug),
        data: chartData(m.slug),
      })),
    }),
  },
  ...chartMetas.map(
    (m): Endpoint => ({
      path: `charts/${m.slug}.json`,
      name: `chart:${m.slug}`,
      description: `Chart ${m.slug}`,
      listed: false,
      build: () => ({
        slug: m.slug,
        title: m.title,
        description: m.description,
        license: chartLicense,
        ...chartLinks(m.slug),
        ...(m.howTo ? { howTo: m.howTo } : {}),
        data: chartData(m.slug),
      }),
    }),
  ),
  // Per-chart tool entries: tools/<toolId>.json, same payload as the chart file.
  ...chartMetas.map(
    (m): Endpoint => ({
      path: `tools/${m.toolId}.json`,
      name: `tool:${m.toolId}`,
      description: `Spec for tool ${m.toolId}`,
      listed: false,
      build: () => ({
        id: m.toolId,
        title: m.title,
        kind: "reference",
        summary: m.description,
        url: chartLinks(m.slug).pageUrl,
        ...chartLinks(m.slug),
        ...(m.howTo ? { howTo: m.howTo } : {}),
        data: chartData(m.slug),
      }),
    }),
  ),
  // Per-tool specs: served at tools/<id>.json, not listed individually.
  ...toolSpecs.map(
    (spec): Endpoint => ({
      path: `tools/${spec.id}.json`,
      name: `tool:${spec.id}`,
      description: `Spec for tool ${spec.id}`,
      listed: false,
      build: () => ({ ...spec, jsonUrl: url(`tools/${spec.id}.json`) }),
    }),
  ),
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
