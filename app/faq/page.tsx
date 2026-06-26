import type { Metadata } from "next";
import { Container, Eyebrow, Button, ArrowIcon } from "@/components/ui";
import { FaqList } from "@/components/Faq";
import { faqs } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Honest answers about working with Brian — full-time vs. project work, design plus manufacturing, building hardware in Shenzhen, MOQs, quality, and cost.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-line bg-mist py-16 sm:py-20">
        <Container>
          <Eyebrow>FAQ</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            The questions you&apos;re right to ask.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
            How I like to work, what I bring, and straight answers about building
            hardware in Shenzhen — no spin.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <FaqList items={faqs} />

          <div className="mt-12 rounded-2xl border border-line bg-white p-8 text-center shadow-card">
            <p className="text-lg font-semibold">Still have a question?</p>
            <p className="mt-2 text-slate">
              Ask me directly — I&apos;ll give you a straight answer, whether or
              not we end up working together.
            </p>
            <Button href="/contact" className="mt-5">
              Ask a question <ArrowIcon />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
