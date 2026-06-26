export const site = {
  name: "Lavigne Labs",
  tagline: "Hardware, from prototype to production — on the ground in Shenzhen.",
  description:
    "Brian Barrett is a hardware and manufacturing engineer based in Shenzhen — electronics and PCB design, fast prototyping, and reliable production. 13+ years where hardware actually gets built. Open to a full-time role, or focused project work.",
  url: "https://lavignelabs.com",
  founder: "Brian Barrett",
  email: "hello@lavignelabs.com",
  wechat: "briantb",
  hours: "Based in Shenzhen, China · GMT+8",
} as const;

export const nav = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/work" },
  { label: "Articles", href: "/articles" },
  { label: "Tools", href: "/tools" },
  { label: "Play", href: "/play" },
] as const;

export const footerLinks = {
  Company: [
    { label: "Services", href: "/#services" },
    { label: "How I work", href: "/#how-i-work" },
    { label: "Work", href: "/work" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Articles", href: "/articles" },
    { label: "Engineering Tools", href: "/tools" },
    { label: "Lab Notes", href: "/lab" },
    { label: "Play", href: "/play" },
  ],
} as const;

export const audience =
  "For teams building real hardware — wearables, sensors, connected and camera-based devices — who need it engineered well and built reliably, right next to the factory.";

export const engagement = {
  intro:
    "I'm looking for the right team to build hardware with — ideally embedded full-time as the engineer who owns it end to end. I also take focused projects. Either way, you get someone who sees a product from schematic to shipped units.",
  models: [
    {
      name: "Join your team",
      tag: "What I'm after",
      body: "Embed full-time as your hardware / manufacturing engineer — own electronics, prototyping, DFM, and production end to end, on the ground in Shenzhen where the build actually happens.",
    },
    {
      name: "Project or fractional",
      tag: "Also open",
      body: "Have a specific device to get from prototype to reliable production? I'll take it on as a focused engagement — design, supplier vetting, pilot runs, and quality, with open books.",
    },
  ],
  loyalty: {
    title: "On the ground, not over email",
    body: "Hardware doesn't get built over a video call. I'm in the factories in person — reading schematics, walking the line, and catching problems before they ship by the thousand.",
  },
};

export const credibility = [
  { value: "13+ yrs", label: "Engineering & manufacturing in China" },
  { value: "6 yrs", label: "Ran an LED factory for Black & Decker" },
  { value: "2", label: "EV startups (tilting vehicles & e-motorcycles)" },
  { value: "Shenzhen", label: "Based where hardware gets built" },
] as const;

export const services = [
  {
    id: "electronics",
    title: "Electronics & PCB Design",
    summary:
      "Schematic to a manufacturable board — compact, sensor-driven, and built to survive the production line. DFM-ready and ready to make at volume.",
    points: [
      "Schematic capture & PCB layout",
      "Sensors, power & wireless integration",
      "Firmware & bring-up support",
      "Design for manufacturability (DFM)",
    ],
  },
  {
    id: "prototyping",
    title: "Rapid Prototyping",
    summary:
      "Turn a concept into a working device, fast. Get real hardware in hand to test and iterate — wearables, enclosures, and small-batch builds.",
    points: [
      "Concept to functional prototype",
      "Mechanical & enclosure design",
      "Iterative testing & refinement",
      "Pre-production validation",
    ],
  },
  {
    id: "production",
    title: "Production in Shenzhen",
    summary:
      "Your hardware, built reliably at the source. I source and vet factories, run on-site quality control, and get hundreds or thousands of units into the field.",
    points: [
      "Factory sourcing & vetting",
      "On-site quality control & inspections",
      "Tooling, pilot runs & scale-up",
      "Logistics & timeline management",
    ],
  },
] as const;

export const problems = [
  {
    risk: "A prototype that won't scale",
    fix: "I redesign for manufacturability so it can actually be built at volume — not just work once on a bench.",
  },
  {
    risk: "The wrong factory",
    fix: "I vet suppliers in person — capability, capacity, and track record — before a cent moves.",
  },
  {
    risk: "No real quality control",
    fix: "On-site inspections and pilot runs catch defects before they ship by the thousand.",
  },
  {
    risk: "Hidden costs & slipping timelines",
    fix: "Clear quoting, tooling oversight, and a build plan that holds — managed on the ground, in your blind-spot timezone.",
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
    body: "Production ramps with ongoing oversight on quality, cost, and timeline — your hardware, in the field.",
  },
];
