import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, ArrowIcon } from "@/components/ui";
import { tools, getTool } from "@/content/tools";
import { QrTimeSync } from "@/components/tools/QrTimeSync";

const components: Record<string, React.ComponentType> = {
  "qr-sync": QrTimeSync,
};

export function generateStaticParams() {
  // Tools with an href are standalone pages under public/ — no route here.
  return tools.filter((t) => !t.href).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return { title: tool.title, description: tool.blurb };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  const Tool = components[slug];
  if (!tool || !Tool) notFound();

  return (
    <section className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate transition hover:text-ink"
        >
          <ArrowIcon className="rotate-180" /> All tools
        </Link>
        <span className="mt-6 block font-mono text-[11px] uppercase tracking-wide text-accent">
          {tool.kind}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {tool.title}
        </h1>
        <p className="mt-3 text-lg text-slate">{tool.blurb}</p>

        <div className="mt-10">
          <Tool />
        </div>
      </Container>
    </section>
  );
}
