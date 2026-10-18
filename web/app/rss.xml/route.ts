import { site, pageUrl } from "@/content/site";
import { getAllArticles } from "@/lib/articles";

export const dynamic = "force-static"; // for `output: export`

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function GET() {
  const items = getAllArticles().map((a) => {
    const url = pageUrl(`/articles/${a.slug}`);
    return [
      "    <item>",
      `      <title>${esc(a.title)}</title>`,
      `      <link>${esc(url)}</link>`,
      `      <guid isPermaLink="true">${esc(url)}</guid>`,
      `      <pubDate>${new Date(a.date).toUTCString()}</pubDate>`,
      `      <description>${esc(a.excerpt)}</description>`,
      `      <category>${esc(a.tag)}</category>`,
      ...(a.author && a.author !== site.founder ? [`      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">${esc(a.author)}</dc:creator>`] : []),
      "    </item>",
    ].join("\n");
  });
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${esc(site.name)}</title>`,
    `    <link>${esc(site.url)}</link>`,
    `    <description>${esc(site.description)}</description>`,
    "    <language>en</language>",
    `    <atom:link href="${esc(site.url)}/rss.xml" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
