export type Faq = {
  q: string;
  a: string;
  featured?: boolean;
};

export const faqs: Faq[] = [
  {
    q: "Are you open to a full-time role, or just contract work?",
    a: "Both — but full-time is what I'm really after. The ideal fit is joining a team as the engineer who owns hardware end to end, on the ground in Shenzhen. I also take focused projects when that's a better fit for where you are.",
    featured: true,
  },
  {
    q: "Can you do both the design and the manufacturing?",
    a: "Yes — that's the whole point. Electronics, prototyping, and production are usually split across different people and vendors, with handoffs where things break. I cover the full path, from schematic to shipped units, so nothing gets lost in translation.",
    featured: true,
  },
  {
    q: "What kind of hardware do you work on?",
    a: "Compact, real-world devices — PCBs and electronics, wearables, cameras and optics, LED and sensor-driven gadgets, and the enclosures around them. The badge and toys in the Work and Play sections are good examples of the form factors and bring-up involved.",
    featured: true,
  },
  {
    q: "We're a small or early-stage team — is that a fit?",
    a: "Often the best fit. Early hardware is exactly where one engineer who can both design it and get it built saves the most time and money — instead of stitching together a designer, a sourcing agent, and a factory who don't talk to each other.",
    featured: true,
  },
  {
    q: "Do you work on-site or remotely?",
    a: "I'm based in Shenzhen and in the factories in person — that's the advantage. I work with teams anywhere in the world; the design can happen over a call, but the build, the vetting, and the quality control happen here, in person.",
    featured: true,
  },
  {
    q: "My prototype works — why can't they just make 10,000 of them?",
    a: "Because a prototype proves the idea, not the process. Getting a design ready to manufacture — DFM — is the buyer's job, not the factory's, and skipping it is the most common way first runs blow up. Closing that gap is a big part of what I do.",
    featured: true,
  },
  {
    q: "The MOQs I'm seeing are huge. Are we too small to build in China?",
    a: "Usually not — high minimums normally mean you're talking to the wrong tier of factory. Part of my job is matching you to suppliers who actually want an order your size, and structuring a first run that proves the product without committing to volume you can't use yet.",
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
    a: "Openly. Either open-BOM with a flat management fee, where you see every real cost, or a fixed price on a finished product I deliver. I don't take finder's fees from suppliers while I'm working for you — that would quietly put me on their side instead of yours.",
  },
  {
    q: "What will the product really cost, landed?",
    a: "More than the factory quote — often 30–50% more once you add tooling amortization, freight, duties and tariffs, and inspection. I model true landed cost up front so your margins are real, not a surprise at the port. There's a calculator in Tools to play with the numbers yourself.",
  },
  {
    q: "How long will a first production order really take?",
    a: "Plan in months, not weeks — especially around Chinese New Year, when factories close for weeks and quality can dip on either side of the break. I'll give you a realistic schedule up front and help you plan around it.",
  },
];

export const featuredFaqs = faqs.filter((f) => f.featured);
