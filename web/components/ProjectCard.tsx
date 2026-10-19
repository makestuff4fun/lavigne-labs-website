import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <article className="card group">
      <Link href={`/work/${project.slug}/`} className="flex flex-1 flex-col" aria-label={project.title}>
      <div className="overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          width={800}
          height={600}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="card-media transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="card-body">
        <h3 className="text-lg font-semibold tracking-tight group-hover:text-accent">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate">{project.blurb}</p>
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
      </div>
      </Link>
    </article>
  );
}
