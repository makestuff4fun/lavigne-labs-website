/** Brian started in China on 2012-11-30. Whole years, computed at build time ("13+" until 2026-11-30, then "14+"). */
const CHINA_SINCE = new Date("2012-11-30T00:00:00+08:00");
function wholeYearsSince(start: Date, now = new Date()): number {
  let y = now.getFullYear() - start.getFullYear();
  if (now.getMonth() < start.getMonth() || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) y--;
  return y;
}
export const yearsInChinaWhole = wholeYearsSince(CHINA_SINCE);
export const yearsInChina = `${yearsInChinaWhole}+`;

export const site = {
  name: "Lavigne Labs",
  tagline: "Hardware development and manufacturing in Shenzhen.",
  description:
    "Lavigne Labs gets hardware made, from prototype to production. From Shenzhen, we handle engineering partners, prototypes, factories, quality and shipping, led by Brian Barrett, who puts his reputation on the results. Camera and sensor devices are our specialty.",
  url: "https://lavignelabs.net",
  founder: "Brian Barrett",
  email: "hello@lavignelabs.net",
  wechat: "briantb",
  hours: "Based in Shenzhen, China · GMT+8",
} as const;

export const philosophy = {
  line: "We move fast. Speed costs money; we spend it where it saves weeks.",
  body: "Prototyping is where we start, because real hardware in your hands beats any plan. Once you are in production, getting the lowest unit cost at volume is a goal we are glad to work toward with you. In development, we would rather spend wisely to save weeks than shave pennies and lose months.",
};

export const bestFit = {
  title: "Who we work best with",
  lines: [
    "Funded startups with a device to get built and a clock that matters.",
    "Teams who have completed a Kickstarter and are ready to take the product to real production. We love working with you.",
    "Anyone who values speed in development and cost discipline once volume starts.",
  ],
};

export const founderStory = {
  heading: "Founded by Brian Barrett",
  paragraphs: [
    `Lavigne Labs was founded by Brian Barrett, a hardware engineer with ${yearsInChina} years in China. He ran an LED factory for Black & Decker for six years, and worked with two EV startups building tilting vehicles and electric motorcycles.`,
    "Most recently, Brian has worked with a fast-growing egocentric data-capture company on its head-worn camera rigs: the wearable hardware that records how people use their hands, so robots and physical AI can learn from it. It is the same work our camera and sensor specialty is built on.",
    "Here is how we work. Lavigne Labs is the face and the accountable lead. Each project is matched to a vetted Shenzhen engineering team, design-led or production-integrated depending on what you need, with 40+ engineers across our partner teams. Brian is your first contact and puts his reputation on the results.",
  ],
};

export const nav = [
  { label: "What you get", href: "/#services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/#about" },
  { label: "Articles", href: "/articles" },
  { label: "Tools", href: "/tools" },
  { label: "Play", href: "/play" },
  { label: "Search", href: "/search" },
] as const;

export const footerLinks = {
  Company: [
    { label: "What you get", href: "/#services" },
    { label: "Camera & sensor devices", href: "/#cameras" },
    { label: "How we work", href: "/#how-we-work" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/#about" },
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
  "For funded startups and teams with a completed Kickstarter, building real hardware (wearables, sensors, connected and camera-based devices) who want it engineered well and built reliably, right next to the factory.";

export const engagement = {
  intro:
    "Three ways to work with our team, depending on where your product is. Lavigne Labs leads every one of them, and Brian Barrett is your first contact.",
  models: [
    {
      name: "Prototype sprints",
      tag: "Where we start",
      body: "Real hardware in your hands, fast. Concept to working prototype, then quick rounds of testing and refinement. This is the hook: you learn more in a few weeks of building than in months of planning.",
    },
    {
      name: "Development to production",
      tag: "Design to units",
      body: "Take a proven prototype through design for manufacturing, tooling, pilot runs and scale-up, with a vetted Shenzhen engineering team matched to your product.",
    },
    {
      name: "Production support",
      tag: "Keep it shipping",
      body: "Already in production? We help with supplier follow-up, on-site quality control, changes and second-source decisions, so units keep shipping on spec.",
    },
  ],
  loyalty: {
    title: "On the ground, not over email",
    body: "Hardware doesn't get built over a video call. We are in the factories in person, reading schematics, walking the line, and catching problems before they ship by the thousand.",
  },
};

/** "What you get": the offer, sold plainly. Every line must stay true (see docs/CONTENT.md, "Honest scale"). */
export const offer = {
  heading: "We handle everything. You stay in the loop.",
  intro:
    "One accountable lead, the right specialists for your product, and a clear view of who is building it.",
  points: [
    {
      title: "One accountable lead",
      body: "Brian leads your project from first prototype to shipped units. One contract, and one person who answers for the result.",
    },
    {
      title: "The right specialists for your product",
      body: `Design houses, camera and electronics factories, and suppliers we have vetted over ${yearsInChinaWhole} years. We pick the partner that fits your product, not the one with spare capacity.`,
    },
    {
      title: "Direct access, no black box",
      body: "Talk to the engineers and the factories building your product. We bring you into the room instead of keeping you out of it.",
    },
    {
      title: "On the ground in Shenzhen",
      body: "We are in the factories in person, at the prototype, the pilot run and the production line, catching problems before they ship by the thousand.",
    },
  ],
  coverage: [
    "Electronics & PCB design",
    "Mechanical & enclosure design",
    "Firmware & bring-up",
    "Prototypes & small batches",
    "DFM, tooling & pilot runs",
    "Factory matching, QC & logistics",
  ],
  setup: {
    title: "How we're set up",
    body: `Lavigne Labs is a small, founder-led team. Brian leads every project himself. For engineering and production we bring in partners we have vetted over ${yearsInChinaWhole} years: design houses, camera and electronics factories, and suppliers. You get one contract, one accountable lead, and the right specialists for your product.`,
  },
};

/** Specialty: camera and sensor devices. Brian 2026-11-05: the existence of egocentric projects may be stated, never specifics. */
export const specialty = {
  heading: "Camera and sensor devices",
  body: [
    "Cameras are where hardware gets hard: lenses and image sensors, IMUs, synchronisation and calibration, heat in a small enclosure, and factories that can build all of it the same way every time. It is where we do our best work.",
    "We have worked on several egocentric data-capture projects: head-worn camera rigs that record how people use their hands, to train robots and AI.",
  ],
  points: [
    "Mono, stereo and multi-camera rigs",
    "Camera module and lens selection",
    "Camera and IMU calibration",
    "Time sync across devices",
    "Wearable mounts built for a full shift",
  ],
};

export const credibility = [
  { value: `${yearsInChina} yrs`, label: "Founder's engineering & manufacturing in China" },
  { value: "6 yrs", label: "Founder ran an LED factory for Black & Decker" },
  { value: "40+", label: "Engineers across our vetted Shenzhen partner teams" },
] as const;

export const services = [
  {
    id: "electronics",
    title: "Electronics & PCB Design",
    summary:
      "Schematic to a manufacturable board: compact, sensor-driven, and built to survive the production line. DFM-ready and ready to make at volume.",
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
      "Turn a concept into a working device, fast. Get real hardware in hand to test and iterate: wearables, enclosures, and small-batch builds.",
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
      "Your hardware, built reliably at the source. We match your product to a vetted engineering team, run on-site quality control, and get hundreds or thousands of units into the field.",
    points: [
      "Vetted factory and engineering-team matching",
      "On-site quality control & inspections",
      "Tooling, pilot runs & scale-up",
      "Logistics & timeline management",
    ],
  },
] as const;

export const problems = [
  {
    risk: "A prototype that won't scale",
    fix: "We redesign for manufacturability so it can actually be built at volume, not just work once on a bench.",
  },
  {
    risk: "The wrong factory",
    fix: "We vet suppliers in person (capability, capacity, and track record) before a cent moves.",
  },
  {
    risk: "No real quality control",
    fix: "On-site inspections and pilot runs catch defects before they ship by the thousand.",
  },
  {
    risk: "Hidden costs & slipping timelines",
    fix: "Clear quoting, tooling oversight, and a build plan that holds, managed on the ground while you sleep.",
  },
];

export const process = [
  {
    step: "01",
    title: "Review",
    body: "We start with your design, prototype, or idea. We assess what's needed to manufacture it well and flag risks early.",
  },
  {
    step: "02",
    title: "Match & vet",
    body: "We match your project to the right vetted Shenzhen engineering team for your product, schedule, and budget.",
  },
  {
    step: "03",
    title: "Pilot & QA",
    body: "A pilot run plus hands-on quality control proves the process before you commit to full volume.",
  },
  {
    step: "04",
    title: "Scale",
    body: "Production ramps with ongoing oversight on quality, cost, and timeline. Your hardware, in the field.",
  },
];

/**
 * Absolute URL in its final form (the host redirects page routes to a trailing
 * slash): page routes get "/", paths with a file extension are left alone, and
 * the bare root stays `site.url`.
 */
export function pageUrl(path = ""): string {
  const p = path.replace(/\/+$/, "");
  if (p === "") return site.url;
  const last = p.split("/").pop() ?? "";
  return `${site.url}${p}${last.includes(".") ? "" : "/"}`;
}

/** Single source for the contact mailto: subject and body prompt. */
export const contactMail = {
  subject: "Project inquiry from lavignelabs.net",
  body: [
    "Hi Brian and team,",
    "",
    "Here's a bit about my project:",
    "- What I'm building:",
    "- Stage (idea / prototype / ready to produce):",
    "- Quantity:",
    "- Timeline:",
    "",
    "Thanks!",
  ].join("\n"),
};

export const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(contactMail.subject)}&body=${encodeURIComponent(contactMail.body)}`;

/** Base URL of the inquiry endpoint; every form URL is built from this. */
export const formsEndpoint = "https://forms.lavignelabs.net";
