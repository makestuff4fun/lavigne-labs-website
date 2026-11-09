import { Hero } from "@/components/Hero";
import { ProblemSolution } from "@/components/ProblemSolution";
import { Offer } from "@/components/Offer";
import { Specialty } from "@/components/Specialty";
import { Process } from "@/components/Process";
import { HowWeWork } from "@/components/HowWeWork";
import { FeaturedWork } from "@/components/FeaturedWork";
import { About } from "@/components/About";
import { FaqSection } from "@/components/Faq";
import { CTA } from "@/components/CTA";
import { featuredFaqs } from "@/content/faq";
import { buildOrganizationJsonLd } from "@/content/organization";
import type { Metadata } from "next";
import { alternates } from "@/lib/seo";

export const metadata: Metadata = { alternates: alternates("/") };

const jsonLd = buildOrganizationJsonLd();

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <ProblemSolution />
      <Offer />
      <Specialty />
      <Process />
      <HowWeWork />
      <FeaturedWork />
      <About />
      <FaqSection items={featuredFaqs} />
      <CTA />
    </>
  );
}
