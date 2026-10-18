import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { SearchBox } from "@/components/SearchBox";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search articles, FAQ answers, services and projects on Lavigne Labs.",
};

export default function SearchPage() {
  return (
    <>
      <section className="border-b border-line bg-mist py-16 sm:py-20">
        <Container>
          <Eyebrow>Search</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Search the site.
          </h1>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SearchBox />
          <noscript>
            <p className="mt-6 text-slate">
              Search needs JavaScript. You can browse the raw index at{" "}
              <a href="/api/v1/search-index.json">/api/v1/search-index.json</a> or
              read everything in <a href="/llms-full.txt">/llms-full.txt</a>.
            </p>
          </noscript>
        </Container>
      </section>
    </>
  );
}
