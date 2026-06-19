import Image from "next/image";
import { Container, Eyebrow } from "./ui";

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
                fill
                sizes="(max-width: 1024px) 80vw, 30vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <Eyebrow>About</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              An engineer who lives where your product gets built.
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate">
              <p>
                I&apos;m Brian Barrett — an engineer based in China with over 13
                years in product design, prototyping, and manufacturing. I spent
                six years running an LED lighting factory for Black &amp; Decker,
                and worked with two EV startups building tilting vehicles and
                electric motorcycles.
              </p>
              <p>
                That mix matters: I understand your design <em>and</em> the
                factory floor it has to survive. When you work with me, you get
                someone who can read a schematic, walk a production line, and
                tell the difference between a supplier&apos;s promise and their
                actual capability — in person, in your timezone&apos;s blind spot.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
