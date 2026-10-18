import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

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
};

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
    readingTime: readingTime(content),
    html: marked.parse(content) as string,
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
