import { services, site } from "./site";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    logo: `${site.url}/brand/logo.png`,
    image: `${site.url}/brand/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Shenzhen",
      addressCountry: "CN",
    },
    founder: {
      "@type": "Person",
      name: site.founder,
      jobTitle: "Hardware and manufacturing engineer",
    },
    areaServed: [
      { "@type": "City", name: "Shenzhen" },
      { "@type": "Country", name: "China" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.email,
        availableLanguage: "English",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${site.name} services`,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.summary,
        },
        name: s.title,
        description: s.summary,
      })),
    },
    knowsAbout: [
      "Hardware engineering",
      "PCB design",
      "Electronics design",
      "Rapid prototyping",
      "Design for manufacturability",
      "Manufacturing in Shenzhen",
      "Wearable & sensor devices",
    ],
  };
}
