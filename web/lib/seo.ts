import type { Metadata } from "next";
import { site } from "@/content/site";

// Feeds and the JSON API, advertised from every page as <link rel="alternate">.
export const feeds = {
  "application/rss+xml": `${site.url}/rss.xml`,
  "application/feed+json": `${site.url}/feed.json`,
  "application/json": `${site.url}/api/v1/index.json`,
};

// Every page must name ITSELF as canonical. Next.js merges metadata shallowly, so a canonical set
// in the root layout is inherited by every page that doesn't set its own: until 2026-11-09 that
// told Google every page was a duplicate of the home page. `path` is root-relative with a
// trailing slash (trailingSlash: true), resolved against metadataBase.
export function alternates(path: string, types: Record<string, string> = {}): Metadata["alternates"] {
  return { canonical: path, types: { ...feeds, ...types } };
}
