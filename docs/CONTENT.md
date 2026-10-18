# Editing content

> **All paths here are relative to `web/`** — the Next.js site lives there.
> `content/site.ts` means `web/content/site.ts`, and `npm run dev` runs in `web/`.

Almost everything you'd want to change — text, projects, articles, tools, FAQ —
lives in plain data files under `content/` (and `content/articles/` for the blog).
No React knowledge needed. After saving, the dev server (`npm run dev`) reloads
the page instantly.

> **Rule of thumb:** wrap text in straight quotes `"like this"`. If your text
> contains a `"`, either use a `'…'`-quoted string or escape it. Keep the commas
> and brackets exactly as shown.

---

## Home page & global copy — `content/site.ts`

Several named exports drive the home page, header, and footer:

| Export | Controls |
|---|---|
| `site` | Brand name, tagline, description, **email**, **WeChat**, hours, URL |
| `nav` | Top navigation links |
| `footerLinks` | Footer link groups |
| `audience` | The "who this is for" line |
| `engagement` | The "How I work" section (fee models + the loyalty statement) |
| `credibility` | The stat strip in the hero (e.g. "13+ yrs") |
| `services` | The three service cards |
| `problems` | The "costly mistakes → how I fix it" rows |
| `process` | The numbered "how it works" steps |

Example — change your contact details:

```ts
export const site = {
  name: "Lavigne Labs",
  email: "hello@lavignelabs.com",   // ← edit
  wechat: "briantb",                // ← edit
  hours: "Mon–Fri, 9am–6pm CST",    // ← edit
  // …
};
```

Example — add a service card (`services` is an array; copy a block):

```ts
{
  id: "testing",
  title: "Compliance & Testing",
  summary: "FCC/CE pre-scan and DVT support before you commit to tooling.",
  points: ["Pre-compliance scans", "Test-plan support", "Lab coordination"],
},
```

## Portfolio projects — `content/projects.ts`

Each project is one object in the `projects` array:

```ts
{
  slug: "microscope-slider",          // URL-safe id (must be unique)
  title: "Microscope X/Y Slider",
  blurb: "A precision motorized X/Y stage for digital microscopy…",
  image: "/work/microscope-slider.jpg", // file in public/work/
  tags: ["Mechanical", "Motion control", "PCB"],
  featured: true,                     // optional: show on the home page
}
```

- **Add a project:** copy a block, change the fields, and drop the image into
  `public/work/`.
- **Featured projects** (the home page "Selected work" grid) are the ones with
  `featured: true`.

> Note: the *new* Next.js site uses this file. The **currently-deployed** site is
> a static freeze of WordPress whose "Our Projects" grid is hand-built HTML —
> editing `projects.ts` updates the Next app, not the frozen page. See
> docs/DEPLOYMENT.md.

## Articles (blog) — `content/articles/*.md`

One Markdown file per article. The filename (minus `.md`) becomes the URL slug,
e.g. `vetting-a-factory.md` → `/articles/vetting-a-factory`.

Each file starts with **frontmatter**:

```markdown
---
title: "How to vet a factory before you wire a deposit"
date: "2026-05-28"        # YYYY-MM-DD — also controls sort order (newest first)
tag: "Sourcing"           # shown as a chip
excerpt: "A supplier's quote tells you almost nothing…"   # the card summary
---

Your article body here, in **Markdown**. Headings (`##`), lists, **bold**,
> blockquotes, and tables all render.
```

- **Optional `author: "Name"`** in the frontmatter sets a per-article byline (JSON-LD, `/feed.json`, `rss.xml`); omit it and the article is credited to the site founder.
- **Add an article:** create a new `.md` file with the frontmatter above. It
  appears automatically on `/articles` (sorted by `date`). Reading time is
  computed from the word count.

## Editorial strategy: the recipe, not the ingredients

Brian's editorial strategy for every article (2026-10-18), verbatim:

> The shops and suppliers don't need to be named. We are giving a recipe not the ingredients. The point is to give away the recipe but in a way that's hard to execute. Most readers aren't in china, don't speak chinese and can't do these things. It seems like giving away the secrets but it's really clever "honest advertising". I know what to do, I'll tell you what I do, but if you're not me, I can still do it better. I have years of existing relationships with trusted suppliers.

That quote is the internal intention. It is never stated in the copy. Brian's correction, same day, verbatim:

> Again know why I'm an expert and here is the recipe. Easy to show, hard to execute. That is our silent message and article intention. We don't say that part out loud.

Working rules (the strategy is silent):

- **Give the method generously and specifically.** Real steps, real Chinese search terms, real timelines. It must read as honest help, never a teaser.
- **Never state the strategy in the copy.** Articles just give the real recipe and let the reader conclude for themselves, from how specific it is, who must be behind it.
- **Name no shops or suppliers.** The one exception is JLC, and only where Brian named it himself.
- **Natural first-person experience may stay** (Brian's own spending, shop history, a step that says relationships take years) when it is part of the telling. Cut it if it reads as a pitch.
- **The close is one plain, understated line** such as "Working on something like this? [Get in touch](/contact/)." It links /contact/ and has no pitch built on the article's content.

Banned phrases (and anything of the same kind) in article copy:

- "easy to show, hard to execute"
- "you can do this yourself, or we can do it faster and better" (and variants: "do it yourself, or", "do it with us", "we can do it faster")
- "why you need an expert / us"; "better than you"
- "we are on the ground / speak the language / have years of relationships, which is why we're better"
- "those relationships are the part you can't copy" (and "can't copy from an article")
- headings such as "Do it yourself, or let us do it with you"

## Editorial mandate: correct, enhance, add

Brian's standing editorial mandate (2026-10-18), verbatim:

> of course, correct spelling, correct me, enhance, add knowledge you know that I missed.

Working rules:

- **Correct spelling and grammar silently.** No need to flag these in the review note.
- **Correct Brian when he is wrong** (facts, physics, terms), and say so in the review note's Corrected part.
- **Enhance:** structure, a stronger hook, clearer examples.
- **Add solid, well-established knowledge he missed**, always recipe not ingredients (no shop names). List it in the review note's Added part.
- **Every draft ships with a short review note at the top of the file**, so Brian approves in one read. It is an HTML comment block starting `<!-- REVIEW NOTE`, with Corrected / Added / Unsure parts (Unsure = anything not certain, for Brian to confirm). Strip it before publishing.

### Standing rule: Brian's field experience beats textbook DFM advice

- When an addition contradicts what Brian actually does, **his practice wins**. Textbook DFM tips (add draft everywhere, over-engineer for the tool) are what a generic writer adds; Brian does the opposite, and is right for his products.
- Additions must be the kind of thing he would agree with. When in doubt, leave it out or put it under Unsure.
- **Every addition is listed in the review note's Added part**, so he can strike it.
- Scope: standard housings, toys, consumer electronics. Automotive is probably the exception.
- Published phrasing of the example below: "Unless you're an expert, you're likely doing it wrong."

Worked example, verbatim:

> Oh yeah, don't waste your time adding draft to your models. Unless you are an expert, you are doing it wrong. The first mold I did in china I added all the draft, made the part for mold with no slide and very proud of my work. I even hired a mold consultant in Canada to do the basic mold layout. Know what happened then? The mold shop rotated the part 90 degrees, added a slide and changed all the draft angles. Explanation? It produced a nicer part. Irony is that the features that became nicer were ones I added to reduce mold complexity, not for aesthetic purposes. Adding draft makes your model hard to change and does not reduce mold cost or time. Exception probably in automotive, I'm talking about standard housings, toys, consumer electronics etc.

## Engineering tools — `content/tools.ts`

Lists the tool/calculator pages (the interactive UI is in
`components/tools/`). Each entry:

```ts
{ slug: "resistor-calculator", title: "Resistor Color Code",
  blurb: "Decode a 4-band resistor…", kind: "calculator" }  // or "reference"
```

Adding a *new* calculator needs a component too — see `components/tools/` and
`app/tools/[slug]/page.tsx` (a code change). Editing titles/blurbs is data-only.

Machine-readable specs for every tool (inputs, outputs, formula, worked examples; served at `/api/v1/tools.json` and `/api/v1/tools/<id>.json`) live in `content/toolSpecs.ts`, which is generated from the calculator pages by `node scripts/gen-tool-specs.cjs` — re-run it after changing a page or adding a tool.

## FAQ — `content/faq.ts`

```ts
{ q: "Can't the factory just steal my design?",
  a: "A US-style NDA means little in China…",
  featured: true }   // featured ones also appear in the home-page FAQ section
```

The full list shows on `/faq`; `featured: true` items also show on the home page.

## Lab notes — `content/labNotes.ts`

Short behind-the-scenes posts (the `/lab` page):

```ts
{ date: "2026-06-10", title: "Making a PCB that's also art",
  body: "Spent the weekend pushing soldermask…",
  image: "/work/pcb-artwork.png" }   // optional
```

## Game levels — `public/games/freezing-fortress/levels.txt`

Standard Sokoban `.xsb` text, one level per block, delimited by `;Level N`:

```
;Level 101
########
#.  $@ #
########
```

Legend: `#` wall · ` ` floor · `.` pit/goal · `$` ice cube · `@` dragon ·
`*` cube-on-pit · `+` dragon-on-pit. The engine validates one player and
boxes == goals. Append as many as you like — the first 100 ship by default.

## Images

Put images in `public/` and reference them by path from there:

- Portfolio → `public/work/…` → `image: "/work/your.jpg"`
- Brand / hero → `public/brand/…`
- Anything in `public/` is served at the matching URL (e.g.
  `public/work/x.jpg` → `/work/x.jpg`).
