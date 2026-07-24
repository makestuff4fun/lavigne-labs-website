import Image from "next/image";
import type { Project } from "@/content/projects";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate">{project.blurb}</p>
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
      </div>
    </article>
  );
}
