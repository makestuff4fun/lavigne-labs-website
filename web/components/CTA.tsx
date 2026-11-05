import { Button, Container, ArrowIcon } from "./ui";
import { site, mailtoHref } from "@/content/site";

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
              Ready to build?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Tell us what you&apos;re making and where it stands, from a full
              product to a single machined part. Brian Barrett replies
              personally, within one business day.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href="/contact/">
                Start a project <ArrowIcon />
              </Button>
              <Button href={mailtoHref} variant="ghost">
                {site.email}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
