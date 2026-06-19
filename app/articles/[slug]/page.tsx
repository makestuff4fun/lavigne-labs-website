import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, ArrowIcon, Button } from "@/components/ui";
import {
  getArticle,
  getArticleSlugs,
  getAllArticles,
  formatDate,
} from "@/lib/articles";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getArticleSlugs().includes(slug)) return {};
  const a = getArticle(slug);
  return {
    title: a.title,
    description: a.excerpt,
    openGraph: { title: a.title, description: a.excerpt, type: "article" },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getArticleSlugs().includes(slug)) notFound();
  const article = getArticle(slug);
  const more = getAllArticles().filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate transition hover:text-ink"
        >
          <ArrowIcon className="rotate-180" /> All articles
        </Link>

        <div className="mt-6 flex items-center gap-3 text-xs">
          <span className="rounded-full bg-accent/10 px-2.5 py-1 font-mono uppercase tracking-wide text-accent">
            {article.tag}
          </span>
          <span className="text-slate">
            {formatDate(article.date)} · {article.readingTime} min read
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {article.title}
        </h1>

        <div
          className="prose prose-slate mt-8 max-w-none prose-headings:tracking-tight prose-h2:text-2xl prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-accent prose-blockquote:text-ink prose-th:text-left"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />

        <div className="mt-12 rounded-2xl border border-line bg-mist p-7 text-center">
          <p className="text-lg font-semibold">Manufacturing in China soon?</p>
          <p className="mt-2 text-slate">
            I help US &amp; Canadian teams do it without the costly mistakes.
          </p>
          <Button href="/contact" className="mt-5">
            Start a project <ArrowIcon />
          </Button>
        </div>
      </Container>

      {more.length > 0 && (
        <Container className="mt-16 max-w-3xl">
          <h2 className="font-mono text-xs uppercase tracking-widest text-slate">
            Keep reading
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {more.map((a) => (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}`}
                className="group rounded-xl border border-line bg-white p-5 transition hover:border-accent/40"
              >
                <h3 className="font-semibold tracking-tight group-hover:text-accent">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </Container>
      )}
    </article>
  );
}
