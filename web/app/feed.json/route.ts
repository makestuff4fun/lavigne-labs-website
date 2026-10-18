import { site } from "@/content/site";
import { getAllArticles, getArticle } from "@/lib/articles";

export const dynamic = "force-static"; // for `output: export`

export function GET() {
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: site.name,
    description: site.description,
    home_page_url: site.url,
    feed_url: `${site.url}/feed.json`,
    language: "en",
    authors: [{ name: site.founder }],
    items: getAllArticles().map((a) => {
      const url = `${site.url}/articles/${a.slug}`;
      return {
        id: url,
        url,
        title: a.title,
        summary: a.excerpt,
        content_html: getArticle(a.slug).html,
        date_published: new Date(a.date).toISOString(),
        tags: [a.tag],
      };
    }),
  };
  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
}
