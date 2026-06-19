export type Faq = {
  q: string;
  a: string;
  featured?: boolean;
};

export const faqs: Faq[] = [
  {
    q: "Can't the factory just steal my design and sell it themselves?",
    a: "A US-style NDA means little in China. The tool that actually works is a Chinese-language NNN agreement (non-use, non-disclosure, non-circumvention) enforceable in Chinese courts — paired with choosing the right factory and not handing any single supplier the whole picture. I help you get that in place before anything sensitive is shared.",
    featured: true,
  },
  {
    q: "The MOQs I'm seeing are huge. Am I too small to manufacture in China?",
    a: "Usually not — high minimums normally mean you're talking to the wrong tier of factory. Part of my job is matching you to suppliers who actually want an order your size, and structuring a first run that proves the product without committing to volume you can't sell yet.",
    featured: true,
  },
  {
    q: "How do I know the production units will match the sample I approved?",
    a: "We lock a signed golden sample as the reference and inspect against it — before, during, and before shipment. Your final balance payment is tied to passing that inspection, so the leverage to fix problems stays on your side of the table.",
    featured: true,
  },
  {
    q: "How do you get paid — and do you take commissions from factories?",
    a: "Openly. Either open-BOM with a flat 10% management fee, where you see every real cost, or a fixed price on a finished product I deliver. Everyone in a supply chain earns something — that's fine. What I won't do is take finder's fees from suppliers while I'm working for you, because that would quietly put me on their side instead of yours.",
    featured: true,
  },
  {
    q: "Who owns the tooling I pay for?",
    a: "You do — in writing, before a mold is ever cut. That keeps your tooling from being held hostage and keeps your next price conversation an actual negotiation.",
    featured: true,
  },
  {
    q: "My prototype works. Why can't they just make 10,000 of them?",
    a: "Because a prototype proves the idea, not the process. Getting a design ready to manufacture — DFM — is the buyer's job, not the factory's, and skipping it is the most common way first runs blow up. Closing that gap is a big part of what I do.",
    featured: true,
  },
  {
    q: "What will my product really cost, landed?",
    a: "More than the factory quote — often 30–50% more once you add tooling amortization, freight, duties and tariffs, and inspection. I model true landed cost up front so your margins are real, not a surprise at the port. There's a calculator in my Tools to play with the numbers yourself.",
  },
  {
    q: "Do I have to fly to China?",
    a: "No — that's the point of having me here. I do the factory visits, audits, and on-site quality control on your behalf. A trip can be worth it at the right moment, but you don't need to live on a plane to make this work.",
  },
  {
    q: "How do we handle the language and time-zone gap?",
    a: "That gap is where most defects are born — usually from miscommunication, not bad intent. I speak both the language and the engineering, on the ground and in your suppliers' timezone, so issues get caught and corrected before they ship.",
  },
  {
    q: "Can't I just do this myself on Alibaba?",
    a: "You can, and some people get lucky. But the cost of a first-timer mistake — a bad run, hostage tooling, a cloned product — is usually far more than what it costs to have someone who's been doing this for 13+ years keep you out of those holes.",
  },
  {
    q: "What if the units show up defective?",
    a: "We catch it before they ship, because inspection happens before your balance payment clears. Chasing a refund from overseas after the fact rarely works; holding the money as leverage does.",
  },
  {
    q: "How long will my first order really take?",
    a: "Plan in months, not weeks — especially around Chinese New Year, when factories close for weeks and quality can dip on either side of the break. I'll give you a realistic schedule up front and help you plan around it.",
  },
];

export const featuredFaqs = faqs.filter((f) => f.featured);
