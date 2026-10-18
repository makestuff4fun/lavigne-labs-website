import { Hero } from "@/components/Hero";
import { ProblemSolution } from "@/components/ProblemSolution";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { HowWeWork } from "@/components/HowWeWork";
import { FeaturedWork } from "@/components/FeaturedWork";
import { About } from "@/components/About";
import { FaqSection } from "@/components/Faq";
import { CTA } from "@/components/CTA";
import { featuredFaqs } from "@/content/faq";
import { buildOrganizationJsonLd } from "@/content/organization";

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
      <Services />
      <Process />
      <HowWeWork />
      <FeaturedWork />
      <About />
      <FaqSection items={featuredFaqs} />
      <CTA />
    </>
  );
}
