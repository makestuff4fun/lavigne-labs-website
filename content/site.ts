export const site = {
  name: "Lavigne Labs",
  tagline: "Manufacture in China without the costly mistakes.",
  description:
    "Lavigne Labs helps US and Canadian hardware teams take prototypes and funded ideas to production in China — vetting factories, catching problems early, and managing quality on the ground.",
  url: "https://lavignelabs.com",
  founder: "Brian Barrett",
  email: "hello@lavignelabs.com",
  wechat: "briantb",
  hours: "Mon–Fri, 9am–6pm CST",
} as const;

// NOTE: only the games (/play) are deployed from this Next.js app — bolted onto
// the static WordPress freeze. So the nav/footer point at the *freeze's* live
// pages (/, /portfolio/, /contact/), not this app's /work, /articles, /tools,
// which aren't deployed. If the full Next.js site is launched later, restore the
// richer nav (see git history) — those pages exist again then.
export const nav = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio/" },
  { label: "Play", href: "/play/" },
  { label: "Contact", href: "/contact/" },
] as const;

export const footerLinks = {
  Site: [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio/" },
    { label: "Play", href: "/play/" },
    { label: "Contact", href: "/contact/" },
  ],
} as const;

export const audience =
  "Built for funded startups and small teams with a working prototype — the moment it has to become a real, shippable product.";

export const engagement = {
  intro:
    "Everyone in a supply chain makes money — that's not the problem. Hidden markups and split loyalties are. So I keep it open.",
  models: [
    {
      name: "Open-BOM + management fee",
      tag: "My default",
      body: "You see the real bill of materials and what every part actually costs. I run sourcing, tooling, quality, and logistics for a flat 10% management fee — no marked-up parts, no mystery line items.",
    },
    {
      name: "Finished product",
      tag: "Hands-off",
      body: "Prefer to just buy a finished, tested product at a fixed price? I handle everything end to end and earn an honest margin on what I deliver.",
    },
  ],
  loyalty: {
    title: "One side of the table — yours",
    body: "When you hire me to design for you or represent you, I work for you, full stop. Factories offer finder's fees to send their way; I turn them down, because taking them would mean working for the factory instead of you.",
  },
};

export const credibility = [
  { value: "13+ yrs", label: "Manufacturing in China" },
  { value: "6 yrs", label: "Ran an LED factory for Black & Decker" },
  { value: "2", label: "EV startups (tilting vehicles & e-motorcycles)" },
  { value: "On-site", label: "Based in China, in the factories" },
] as const;

export const services = [
  {
    id: "production",
    title: "Production Management in China",
    summary:
      "Your eyes, ears, and engineer on the ground. I source and vet factories, run quality control, and keep production on schedule — so you don't have to gamble on a supplier you've never met.",
    points: [
      "Factory sourcing & vetting",
      "On-site quality control & inspections",
      "Tooling, pilot runs & scale-up",
      "Logistics & timeline management",
    ],
  },
  {
    id: "electronics",
    title: "Electronics & PCB Design",
    summary:
      "From schematic to a manufacturable board. I design PCBs that work in the lab and survive the production line — DFM-ready and built to be made at volume.",
    points: [
      "Schematic capture & PCB layout",
      "Design for manufacturability (DFM)",
      "Firmware & bring-up support",
      "BOM optimization & sourcing",
    ],
  },
  {
    id: "prototyping",
    title: "Rapid Prototyping",
    summary:
      "Turn a concept into a working prototype, fast. Get something real in your hands to test, demo, and de-risk before committing tooling dollars.",
    points: [
      "Concept to functional prototype",
      "Mechanical & enclosure design",
      "Iterative testing & refinement",
      "Pre-production validation",
    ],
  },
] as const;

export const problems = [
  {
    risk: "The wrong factory",
    fix: "I vet suppliers in person — capability, capacity, and track record — before a cent moves.",
  },
  {
    risk: "No real quality control",
    fix: "On-site inspections and pilot runs catch defects before they ship by the thousand.",
  },
  {
    risk: "Communication breakdowns",
    fix: "I speak the language and the engineering — no telephone game between you and the line.",
  },
  {
    risk: "Hidden costs & delays",
    fix: "Clear quoting, tooling oversight, and timeline management so there are no surprises.",
  },
];

export const process = [
  {
    step: "01",
    title: "Review",
    body: "We start with your design, prototype, or idea. I assess what's needed to manufacture it well and flag risks early.",
  },
  {
    step: "02",
    title: "Source & vet",
    body: "I find and personally vet the right factory partners for your product, capacity, and budget.",
  },
  {
    step: "03",
    title: "Pilot & QA",
    body: "A pilot run plus hands-on quality control proves the process before you commit to full volume.",
  },
  {
    step: "04",
    title: "Scale",
    body: "Production ramps with ongoing oversight on quality, cost, and timeline — your interests, on the ground.",
  },
];
