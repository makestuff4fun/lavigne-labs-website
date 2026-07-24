import { Button, Container, Eyebrow, ArrowIcon } from "./ui";
import { ProjectCard } from "./ProjectCard";
import { featuredProjects } from "@/content/projects";

export function FeaturedWork() {
  return (
    <section id="work" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>Selected work</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Proof, not promises.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate">
              Boards, mechanisms, and products I designed and built with my own
              hands — the same hands that would be on your factory floor. This is
              what I bring to your product.
            </p>
          </div>
          <Button href="/work" variant="secondary">
            View all work <ArrowIcon />
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.slice(0, 6).map((project, i) => (
            <ProjectCard key={project.slug} project={project} priority={i < 3} />
          ))}
        </div>
      </Container>
    </section>
  );
}
