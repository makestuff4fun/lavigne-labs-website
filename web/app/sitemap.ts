import type { MetadataRoute } from "next";
import { site, pageUrl } from "@/content/site";
import { getArticleSlugs } from "@/lib/articles";
import { allSeries } from "@/content/series";
import { projects } from "@/content/projects";
import { tools, toolHref } from "@/content/tools";

export const dynamic = "force-static"; // for `output: export`

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/work",
    "/contact",
    "/faq",
    "/search",
    "/articles",
    "/tools",
    "/lab",
    "/play",
    "/play/shiverwing",
    "/play/freezing-fortress",
    "/api/v1/index.json",
    "/openapi.json",
  ];
  const articleRoutes = getArticleSlugs().map((slug) => `/articles/${slug}`);
  const seriesRoutes = allSeries.map((s) => `/articles/series/${s.slug}`);
  const workRoutes = projects.map((p) => `/work/${p.slug}`);
  const toolRoutes = tools.map(toolHref);

  return [...staticRoutes, ...workRoutes, ...seriesRoutes, ...articleRoutes, ...toolRoutes].map((path) => ({
    url: pageUrl(path),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
