import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { renderProjectBody } from "@/lib/projectBody";
import { site, mailtoHref, pageUrl } from "@/content/site";
import { Container, Eyebrow, ArrowIcon, Button } from "@/components/ui";
import { projects } from "@/content/projects";
import { projectDetails } from "@/content/projectDetails";
import { getArticlesForProject, formatDate } from "@/lib/articles";
import { ImageViewer } from "@/components/ImageViewer";
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
  const html = description ? renderProjectBody(description, project.title) : "";

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
      <Container className="max-w-6xl">
        <Link
          href="/work/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate transition hover:text-ink"
        >
          <ArrowIcon className="rotate-180" /> All work
        </Link>

        <div
          className={`mt-8 grid gap-8 lg:gap-12 ${gallery.length > 0 ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" : "max-w-3xl"}`}
        >
          {gallery.length > 0 && (
            <div className="min-w-0 sticky-viewer">
              <ImageViewer images={gallery} label={project.title} />
            </div>
          )}
          <div className="min-w-0">
            <Eyebrow>Project</Eyebrow>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {project.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-mist px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-slate"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-6 text-lg leading-relaxed text-slate">{project.blurb}</p>

            {html && (
              <div
                className="prose prose-slate mt-8 max-w-none border-t border-line pt-8 prose-headings:tracking-tight prose-h3:mb-3 prose-h3:mt-9 prose-h3:text-xl prose-h3:font-semibold prose-p:leading-relaxed prose-p:my-4 prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
            {detail && !detail.verified && (
              <p className="mt-6 text-sm text-slate">Description recovered from the original site</p>
            )}
          </div>
        </div>

        {writtenUp.length > 0 && (
          <section className="mt-14" aria-label="Written up in">
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
            We&apos;re a Shenzhen hardware product-development team, ready to help you
            build it.
          </p>
          <Button href={mailtoHref} className="mt-5">
            Get in touch <ArrowIcon />
          </Button>
        </div>
      </Container>
    </article>
  );
}
