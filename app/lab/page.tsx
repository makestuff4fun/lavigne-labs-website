import type { Metadata } from "next";
import Image from "next/image";
import { Container, Eyebrow } from "@/components/ui";
import { labNotes } from "@/content/labNotes";
import { formatDate } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Lab Notes",
  description:
    "Behind-the-scenes from the Lavigne Labs bench — side projects, experiments, and the maker habit that keeps my manufacturing instincts sharp.",
};

export default function LabPage() {
  return (
    <>
      <section className="border-b border-line bg-mist py-16 sm:py-20">
        <Container>
          <Eyebrow>Lab Notes</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            What I tinker with when nobody's paying me.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
            The side projects and experiments behind the work. Half of what I
            know about making things well, I learned messing around on the bench
            with no deadline and no client.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-10">
            {labNotes.map((note, i) => (
              <article
                key={i}
                className="grid gap-5 border-b border-line pb-10 last:border-0 sm:grid-cols-[200px_1fr] sm:gap-7"
              >
                {note.image && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-mist ring-1 ring-line sm:aspect-square">
                    <Image
                      src={note.image}
                      alt={note.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 200px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-slate">
                    {formatDate(note.date)}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight">
                    {note.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-slate">{note.body}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
