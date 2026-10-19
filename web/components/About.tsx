import Image from "next/image";
import { Container, Eyebrow } from "./ui";
import { founderStory } from "@/content/site";

export function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-mist py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-line shadow-card">
              <Image
                src="/brand/brian.jpg"
                alt="Brian Barrett, founder of Lavigne Labs"
                width={800}
                height={1000}
                sizes="(max-width: 1024px) 80vw, 30vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <Eyebrow>About</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {founderStory.heading}
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate">
              {founderStory.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
