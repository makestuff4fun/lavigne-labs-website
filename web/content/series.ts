export type Series = { slug: string; title: string; intro: string };

export const allSeries: Series[] = [
  {
    slug: "field-notes",
    title: "Field Notes from China",
    intro:
      "We have spent years making hardware in China, and these are the notes we wish we had on day one. They are hard-won and practical: how to find the right supplier, get a straight answer, prototype quickly and keep costs honest. Read them in order, or jump to whatever you are stuck on.",
  },
];

export const getSeries = (slug: string): Series | undefined => allSeries.find((s) => s.slug === slug);
