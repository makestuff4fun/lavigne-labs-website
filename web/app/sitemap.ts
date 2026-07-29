import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getArticleSlugs } from "@/lib/articles";
import { tools, toolHref } from "@/content/tools";

export const dynamic = "force-static"; // for `output: export`

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/work",
    "/contact",
    "/faq",
    "/articles",
    "/tools",
    "/lab",
    "/play",
    "/play/shiverwing",
    "/play/freezing-fortress",
  ];
  const articleRoutes = getArticleSlugs().map((slug) => `/articles/${slug}`);
  const toolRoutes = tools.map(toolHref);

  return [...staticRoutes, ...articleRoutes, ...toolRoutes].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
