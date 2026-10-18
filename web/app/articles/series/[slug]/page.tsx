import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Eyebrow, ArrowIcon } from "@/components/ui";
import { allSeries, getSeries } from "@/content/series";
import { getSeriesArticles, formatDate } from "@/lib/articles";

export const dynamicParams = false;

export function generateStaticParams() {
  return allSeries.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getSeries(slug);
  if (!s) return {};
  return { title: s.title, description: s.intro };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) notFound();
  const articles = getSeriesArticles(slug);

  return (
    <>
      <section className="border-b border-line bg-mist py-16 sm:py-20">
        <Container>
          <Link
            href="/articles"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate transition hover:text-ink"
          >
            <ArrowIcon className="rotate-180" /> All articles
          </Link>
          <Eyebrow>Series</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{series.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">{series.intro}</p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <ol className="space-y-5">
            {articles.map((a, i) => (
              <li key={a.slug}>
                <Link
                  href={`/articles/${a.slug}`}
                  className="group block rounded-2xl border border-line bg-white p-6 shadow-card transition hover:border-accent/40"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-slate">
                    Part {i + 1} · {formatDate(a.date)}
                  </span>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-accent">{a.title}</h2>
                  <p className="mt-2 leading-relaxed text-slate">{a.excerpt}</p>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
