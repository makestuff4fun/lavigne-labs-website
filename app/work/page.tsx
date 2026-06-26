import type { Metadata } from "next";
import { Container, Eyebrow, Button, ArrowIcon } from "@/components/ui";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected hardware projects from Lavigne Labs — PCBs, prototypes, and products designed and built to be manufactured at volume.",
};

export default function WorkPage() {
  return (
    <>
      <section className="border-b border-line bg-mist py-16 sm:py-20">
        <Container>
          <Eyebrow>Portfolio</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Things I&apos;ve designed, built, and made real.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
            Each of these blends electronics, mechanical design, and a path to
            production. It&apos;s the same approach I bring to taking your product
            to manufacturing.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} priority={i < 3} />
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-line bg-white px-7 py-14 text-center shadow-card">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Want this kind of engineer on your team?
            </h2>
            <p className="max-w-xl text-slate">
              Bring your prototype, product, or open role — I&apos;ll help you
              design it and get it built, reliably, at volume.
            </p>
            <Button href="/contact">
              Get in touch <ArrowIcon />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
