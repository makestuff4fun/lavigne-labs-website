import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, ArrowIcon } from "@/components/ui";
import { getAllArticles, formatDate } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Field notes on manufacturing in China — sourcing, costing, quality, and the lessons that save hardware teams real money.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <>
      <section className="border-b border-line bg-mist py-16 sm:py-20">
        <Container>
          <Eyebrow>Articles</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Lessons from the factory floor.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
            Hard-won notes on sourcing, costing, and quality from 13+ years
            making products in China — the things I wish every team knew before
            they wired their first deposit.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="group flex flex-col rounded-2xl border border-line bg-white p-7 shadow-card transition hover:border-accent/40"
              >
                <div className="flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-accent/10 px-2.5 py-1 font-mono uppercase tracking-wide text-accent">
                    {a.tag}
                  </span>
                  <span className="text-slate">
                    {formatDate(a.date)} · {a.readingTime} min read
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-tight group-hover:text-accent">
                  {a.title}
                </h2>
                <p className="mt-3 flex-1 leading-relaxed text-slate">{a.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Read <ArrowIcon className="transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
