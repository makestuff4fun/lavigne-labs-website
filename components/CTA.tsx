import { Button, Container, ArrowIcon } from "./ui";
import { site } from "@/content/site";

export function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-7 py-16 text-center text-white sm:px-12">
          <div className="absolute inset-0 grid-texture opacity-60" aria-hidden="true" />
          <div
            className="absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Got a prototype or a funded idea?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Tell me what you&apos;re building. I&apos;ll tell you what it takes
              to make it well in China — honestly, and before you spend on
              tooling.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href="/contact">
                Start a project <ArrowIcon />
              </Button>
              <Button href={`mailto:${site.email}`} variant="ghost">
                {site.email}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
