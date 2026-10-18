import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked, Renderer } from "marked";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tag: string;
  author?: string;
  readingTime: number;
  series?: string;
  seriesOrder?: number;
  /** Slugs of portfolio projects (web/content/projects.ts) this article draws on. */
  related?: string[];
  /** Hero image path (under /images/articles/ or /work/) and its alt text. */
  hero?: string;
  heroAlt?: string;
  /** "Quick answers": questions the article answers, in the article's own words. */
  faq?: FaqItem[];
  /** Step list for HowTo structured data (names/text come from the article). */
  howto?: { name: string; steps: { name: string; text: string }[] };
};

export type FaqItem = { q: string; a: string };

export type Article = ArticleMeta & { html: string };

/** Drops HTML comment blocks starting `<!-- REVIEW NOTE`: notes for the owner, never for readers. */
export function stripReviewNotes(md: string): string {
  return md.replace(/<!--\s*REVIEW NOTE[\s\S]*?-->\s*/g, "");
}

/** Article markdown body (frontmatter and review notes removed). */
export function getArticleBody(slug: string): string {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, `${slug}.md`), "utf8");
  return stripReviewNotes(matter(raw).content).trim();
}

/** Plain text of markdown for comparisons: no emphasis/code/link syntax, collapsed whitespace. */
function plain(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|`)/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

/** Throws unless every sentence of `text` appears verbatim in the article body (keeps FAQ/HowTo faithful). */
function assertInBody(slug: string, body: string, text: string, what: string) {
  for (const s of text.split(/(?<=[.?!:])\s+/)) {
    const frag = s.trim().replace(/[.:]$/, "");
    if (frag && !body.includes(frag)) throw new Error(`${slug}: ${what} not found in article text: "${frag}"`);
  }
}

function parseFaq(slug: string, data: Record<string, unknown>, body: string): FaqItem[] | undefined {
  if (!Array.isArray(data.faq) || !data.faq.length) return undefined;
  const items = data.faq.map((f: { q?: unknown; a?: unknown }) => {
    if (typeof f?.q !== "string" || typeof f?.a !== "string") throw new Error(`${slug}: bad faq entry`);
    assertInBody(slug, body, f.a, "FAQ answer");
    return { q: f.q.trim(), a: f.a.trim() };
  });
  return items;
}

function parseHowto(slug: string, data: Record<string, unknown>, body: string): Article["howto"] {
  const h = data.howto as { name?: unknown; steps?: { name?: unknown; text?: unknown }[] } | undefined;
  if (!h || typeof h.name !== "string" || !Array.isArray(h.steps) || !h.steps.length) return undefined;
  return {
    name: h.name,
    steps: h.steps.map((s) => {
      if (typeof s?.name !== "string" || typeof s?.text !== "string") throw new Error(`${slug}: bad howto step`);
      assertInBody(slug, body, s.text, "HowTo step");
      return { name: s.name, text: s.text };
    }),
  };
}

/** Pixel size of a JPEG under web/public (undefined if unreadable): lets <img> carry width/height. */
function jpegSize(src: string): { w: number; h: number } | undefined {
  try {
    const b = fs.readFileSync(path.join(process.cwd(), "public", src));
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
        return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  } catch {}
  return undefined;
}

const escAttr = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Inline images: lazy, sized (no layout shift), and a <figure> with <figcaption> when a title is given. */
const renderer = new Renderer();
renderer.image = ({ href, title, text }) => {
  const size = jpegSize(href);
  const img = `<img src="${escAttr(href)}" alt="${escAttr(text)}" loading="lazy" decoding="async"${
    size ? ` width="${size.w}" height="${size.h}"` : ""
  } />`;
  return title ? `<figure>${img}<figcaption>${escAttr(title)}</figcaption></figure>` : img;
};

const CALLOUT = /<blockquote>(\s*<p><strong>(Common mistakes|Rules? of thumb|Tip|Note)<\/strong>)/g;

/** Markdown -> HTML. A blockquote opening with **Common mistakes** / **Rule of thumb** becomes a callout box. */
function renderMarkdown(md: string): string {
  const html = marked.parse(md, { renderer }) as string;
  return html
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(CALLOUT, (_m, rest: string, kind: string) => {
    const k = kind.toLowerCase().startsWith("common") ? "mistakes" : "tip";
    return `<blockquote class="callout callout-${k}">${rest}`;
  });
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getArticle(slug: string): Article {
  const fullPath = path.join(ARTICLES_DIR, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content: rawContent } = matter(raw);
  const content = stripReviewNotes(rawContent);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    tag: data.tag ?? "Manufacturing",
    ...(typeof data.author === "string" && data.author.trim()
      ? { author: data.author.trim() }
      : {}),
    ...(typeof data.series === "string" && data.series.trim()
      ? {
          series: data.series.trim(),
          ...(typeof data.seriesOrder === "number" ? { seriesOrder: data.seriesOrder } : {}),
        }
      : {}),
    ...(Array.isArray(data.related) && data.related.length
      ? { related: data.related.filter((s): s is string => typeof s === "string") }
      : {}),
    ...(typeof data.hero === "string" && data.hero.trim()
      ? {
          hero: data.hero.trim(),
          heroAlt: typeof data.heroAlt === "string" ? data.heroAlt.trim() : data.title ?? slug,
        }
      : {}),
    ...(() => {
      const body = plain(content);
      const faq = parseFaq(slug, data, body);
      const howto = parseHowto(slug, data, body);
      return { ...(faq ? { faq } : {}), ...(howto ? { howto } : {}) };
    })(),
    readingTime: readingTime(content),
    html: renderMarkdown(content),
  };
}

export function getAllArticles(): ArticleMeta[] {
  return getArticleSlugs()
    .map((slug) => {
      const { html, ...meta } = getArticle(slug);
      void html;
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Published articles of a series, in reading order (seriesOrder, then date). */
export function getSeriesArticles(series: string): ArticleMeta[] {
  return getAllArticles()
    .filter((a) => a.series === series)
    .sort(
      (a, b) =>
        (a.seriesOrder ?? 1e9) - (b.seriesOrder ?? 1e9) || (a.date < b.date ? -1 : 1),
    );
}

/** Published articles whose `related` includes the given project slug. */
export function getArticlesForProject(projectSlug: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.related?.includes(projectSlug));
}
