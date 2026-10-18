import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, mailtoHref, pageUrl } from "@/content/site";
import { projects } from "@/content/projects";
import { getSeries } from "@/content/series";
import { Container, ArrowIcon, Button } from "@/components/ui";
import {
  getArticle,
  getArticleSlugs,
  getAllArticles,
  getSeriesArticles,
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
  const penName = !!a.author && a.author !== site.founder;
  return {
    title: a.title,
    description: a.excerpt,
    // A pen-named article must not inherit the founder from the root layout
    // (authors, and the twitter description which is the site description).
    ...(penName
      ? {
          authors: [{ name: a.author }],
          twitter: {
            card: "summary_large_image",
            title: a.title,
            description: a.excerpt,
            ...(a.hero ? { images: [a.hero] } : {}),
          },
        }
      : {}),
    openGraph: {
      title: a.title,
      description: a.excerpt,
      type: "article",
      ...(a.hero ? { images: [{ url: a.hero, alt: a.heroAlt }] } : {}),
    },
    ...(a.hero && !penName
      ? { twitter: { card: "summary_large_image", title: a.title, description: a.excerpt, images: [a.hero] } }
      : {}),
    alternates: { types: { "text/markdown": `/articles/${slug}.md` } },
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
  const penName = !!article.author && article.author !== site.founder;
  const more = getAllArticles().filter((a) => a.slug !== slug).slice(0, 2);

  const relatedProjects = (article.related ?? [])
    .map((r) => projects.find((p) => p.slug === r))
    .filter((p): p is (typeof projects)[number] => !!p);

  const series = article.series ? getSeries(article.series) : undefined;
  const members = series ? getSeriesArticles(series.slug) : [];
  const idx = members.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? members[idx - 1] : undefined;
  const next = idx >= 0 ? members[idx + 1] : undefined;

  const url = pageUrl(`/articles/${slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    articleSection: article.tag,
    ...(article.hero ? { image: [pageUrl(article.hero)] } : {}),
    url,
    mainEntityOfPage: url,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: article.author ?? site.founder,
      ...(article.author && article.author !== site.founder ? {} : { url: site.url }),
    },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <article className="py-14 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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

        {series && idx >= 0 && (
          <div className="mt-6 rounded-xl border border-accent/30 bg-mist px-5 py-4 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-slate">Series</span>{" "}
            <Link href={`/articles/series/${series.slug}`} className="font-semibold text-accent hover:underline">
              {series.title}
            </Link>
            <span className="text-slate">
              {" "}
              · Part {idx + 1} of {members.length}
            </span>
          </div>
        )}

        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {article.title}
        </h1>

        {article.hero && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.hero}
            alt={article.heroAlt ?? article.title}
            width={1600}
            height={900}
            fetchPriority="high"
            className="mt-8 aspect-[16/9] w-full rounded-2xl border border-line object-cover shadow-card"
          />
        )}

        <div
          className="article-body prose prose-slate mt-8 max-w-none prose-headings:tracking-tight prose-h2:text-2xl prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-accent prose-blockquote:text-ink prose-th:text-left"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />

        {series && (prev || next) && (
          <nav aria-label={`${series.title} navigation`} className="mt-12 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link href={`/articles/${prev.slug}`} className="rounded-xl border border-line bg-white p-5 transition hover:border-accent/40">
                <span className="font-mono text-xs uppercase tracking-widest text-slate">&larr; Previous</span>
                <span className="mt-1 block font-semibold tracking-tight">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/articles/${next.slug}`} className="rounded-xl border border-line bg-white p-5 text-right transition hover:border-accent/40 sm:col-start-2">
                <span className="font-mono text-xs uppercase tracking-widest text-slate">Next &rarr;</span>
                <span className="mt-1 block font-semibold tracking-tight">{next.title}</span>
              </Link>
            )}
          </nav>
        )}

        {relatedProjects.length > 0 && (
          <section className="mt-12" aria-label="Related projects">
            <h2 className="font-mono text-xs uppercase tracking-widest text-slate">
              Related projects
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {relatedProjects.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/work/${p.slug}/`}
                    className="group block h-full rounded-xl border border-line bg-white p-5 transition hover:border-accent/40"
                  >
                    <span className="font-semibold tracking-tight group-hover:text-accent">
                      {p.title}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-slate">{p.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 rounded-2xl border border-line bg-mist p-7 text-center">
          <p className="text-lg font-semibold">Building hardware?</p>
          <p className="mt-2 text-slate">
            {penName
              ? "Lavigne Labs helps hardware teams manufacture in China — get in touch."
              : "I\u2019m a hardware engineer in Shenzhen — open to full-time roles and focused projects."}
          </p>
          <Button href={mailtoHref} className="mt-5">
            Get in touch <ArrowIcon />
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
