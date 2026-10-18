import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { site, mailtoHref, pageUrl } from "@/content/site";
import { Container, Eyebrow, ArrowIcon, Button } from "@/components/ui";
import { projects } from "@/content/projects";
import { projectDetails } from "@/content/projectDetails";
import { getArticlesForProject, formatDate } from "@/lib/articles";
import { projectGalleries } from "@/content/projectGalleries";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const first = projectGalleries[slug]?.[0];
  return {
    title: project.title,
    description: project.blurb,
    openGraph: {
      title: project.title,
      description: project.blurb,
      type: "article",
      ...(first ? { images: [{ url: pageUrl(first.src), width: first.width, height: first.height, alt: first.alt }] } : {}),
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const gallery = projectGalleries[slug] ?? [];
  const detail = projectDetails[slug];
  const description = detail?.description?.trim() ?? "";
  const html = description ? (marked.parse(description) as string) : "";

  const writtenUp = getArticlesForProject(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.blurb,
    image: gallery.map((g) => pageUrl(g.src)),
    keywords: project.tags,
    author: { "@type": "Person", name: site.founder, url: site.url },
    url: pageUrl(`/work/${slug}`),
  };

  return (
    <article className="py-14 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Container className="max-w-4xl">
        <Link
          href="/work/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate transition hover:text-ink"
        >
          <ArrowIcon className="rotate-180" /> All work
        </Link>

        <div className="mt-6">
          <Eyebrow>Project</Eyebrow>
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-mist px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-slate"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-6 text-lg leading-relaxed text-slate">{project.blurb}</p>

        {gallery.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {gallery.map((g, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={g.src}
                src={g.src}
                alt={g.alt}
                width={g.width}
                height={g.height}
                loading={i === 0 ? undefined : "lazy"}
                className="h-auto w-full rounded-xl border border-line bg-mist"
              />
            ))}
          </div>
        )}

        {html && (
          <div
            className="prose prose-slate mt-10 max-w-none prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
        {detail && !detail.verified && (
          <p className="mt-6 text-sm text-slate">Description recovered from the original site</p>
        )}

        {writtenUp.length > 0 && (
          <section className="mt-12" aria-label="Written up in">
            <h2 className="font-mono text-xs uppercase tracking-widest text-slate">
              Written up in
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {writtenUp.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/articles/${a.slug}/`}
                    className="group block h-full rounded-xl border border-line bg-white p-5 transition hover:border-accent/40"
                  >
                    <span className="font-semibold tracking-tight group-hover:text-accent">
                      {a.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate">{formatDate(a.date)}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-slate">{a.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 rounded-2xl border border-line bg-mist p-7 text-center">
          <p className="text-lg font-semibold">Building hardware?</p>
          <p className="mt-2 text-slate">
            I&apos;m a hardware engineer in Shenzhen — open to full-time roles and
            focused projects.
          </p>
          <Button href={mailtoHref} className="mt-5">
            Get in touch <ArrowIcon />
          </Button>
        </div>
      </Container>
    </article>
  );
}
