export type Faq = {
  q: string;
  a: string;
  featured?: boolean;
};

export const faqs: Faq[] = [
  {
    q: "How do projects work?",
    a: "Lavigne Labs is the face and the accountable lead on every project, and Brian Barrett is your first contact. We match your project to a vetted Shenzhen engineering team, design-led or production-integrated depending on what you need. Most projects start with a prototype sprint, move into development to production, and continue with production support. You can join at any stage.",
    featured: true,
  },
  {
    q: "What does speed cost?",
    a: "We move fast. Speed costs money; we spend it where it saves weeks. Prototyping is where that pays off most: fast iterations, quick-turn parts, and decisions made in days. Getting the lowest unit cost at volume is a goal we're glad to chase in production. In development, we'd rather spend on learning quickly than shave the budget and lose weeks.",
    featured: true,
  },
  {
    q: "Do you do production, or only prototypes?",
    a: "Both. Prototyping is the hook, but our job is to take the product the whole way: development to production, then production support. Production is where we work to get your unit cost down at volume, with a signed golden sample and inspection before shipment.",
  },
  {
    q: "Who do you work with, and how do you take on projects?",
    a: "We work best with funded startups and teams with a completed Kickstarter, and we love working with them. Lavigne Labs leads every project, matched to a vetted Shenzhen engineering team. We start with prototype sprints, then development to production, then production support, and we can join at any stage.",
    featured: true,
  },
  {
    q: "Can you do both the design and the manufacturing?",
    a: "Yes — that's the whole point. Electronics, prototyping, and production are usually split across different people and vendors, with handoffs where things break. Our team covers the full path, from schematic to shipped units, so nothing gets lost in translation.",
    featured: true,
  },
  {
    q: "What kind of hardware do you work on?",
    a: "Compact, real-world devices — PCBs and electronics, wearables, cameras and optics, LED and sensor-driven gadgets, and the enclosures around them. The badge and toys in the Work and Play sections are good examples of the form factors and bring-up involved.",
    featured: true,
  },
  {
    q: "We're a small or early-stage team — is that a fit?",
    a: "Often the best fit. Early hardware is exactly where one accountable team that can both design it and get it built saves the most time and money, instead of stitching together a designer, a sourcing agent, and a factory who don't talk to each other. Funded startups and teams with a completed Kickstarter are who we work best with.",
    featured: true,
  },
  {
    q: "Do you work on-site or remotely?",
    a: "We're based in Shenzhen and in the factories in person; that's the advantage. We work with teams anywhere in the world. The design can happen over a call, but the build, the vetting, and the quality control happen here, in person.",
    featured: true,
  },
  {
    q: "My prototype works — why can't they just make 10,000 of them?",
    a: "Because a prototype proves the idea, not the process. Getting a design ready to manufacture — DFM — is the buyer's job, not the factory's, and skipping it is the most common way first runs blow up. Closing that gap is a big part of what we do.",
    featured: true,
  },
  {
    q: "The MOQs I'm seeing are huge. Are we too small to build in China?",
    a: "Usually not — high minimums normally mean you're talking to the wrong tier of factory. Part of our job is matching you to suppliers who actually want an order your size, and structuring a first run that proves the product without committing to volume you can't use yet.",
  },
  {
    q: "How do I know the production units will match the sample we approved?",
    a: "We lock a signed golden sample as the reference and inspect against it — before, during, and before shipment. The final balance payment is tied to passing that inspection, so the leverage to fix problems stays on your side of the table.",
  },
  {
    q: "Who owns the tooling we pay for?",
    a: "You do — in writing, before a mold is ever cut. That keeps your tooling from being held hostage and keeps your next price conversation an actual negotiation.",
  },
  {
    q: "How do project engagements get priced?",
    a: "Openly. Either open-BOM with a flat management fee, where you see every real cost, or a fixed price on a finished product we deliver. We don't take finder's fees from suppliers while we're working for you; that would quietly put us on their side instead of yours.",
  },
  {
    q: "What will the product really cost, landed?",
    a: "More than the factory quote — often 30–50% more once you add tooling amortization, freight, duties and tariffs, and inspection. We model true landed cost up front so your margins are real, not a surprise at the port. There's a calculator in Tools to play with the numbers yourself.",
  },
  {
    q: "How long will a first production order really take?",
    a: "Plan in months, not weeks — especially around Chinese New Year, when factories close for weeks and quality can dip on either side of the break. We'll give you a realistic schedule up front and help you plan around it.",
  },
];

export const featuredFaqs = faqs.filter((f) => f.featured);
