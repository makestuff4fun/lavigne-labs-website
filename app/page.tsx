import { Hero } from "@/components/Hero";
import { ProblemSolution } from "@/components/ProblemSolution";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { HowIWork } from "@/components/HowIWork";
import { FeaturedWork } from "@/components/FeaturedWork";
import { About } from "@/components/About";
import { FaqSection } from "@/components/Faq";
import { CTA } from "@/components/CTA";
import { featuredFaqs } from "@/content/faq";
import { site } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  url: site.url,
  email: site.email,
  founder: { "@type": "Person", name: site.founder },
  areaServed: ["United States", "Canada"],
  knowsAbout: [
    "Manufacturing in China",
    "Production management",
    "PCB design",
    "Rapid prototyping",
    "Design for manufacturability",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ProblemSolution />
      <Services />
      <Process />
      <HowIWork />
      <FeaturedWork />
      <About />
      <FaqSection items={featuredFaqs} />
      <CTA />
    </>
  );
}
