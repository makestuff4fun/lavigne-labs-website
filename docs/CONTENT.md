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

Working rules:

- **Give the method generously and specifically.** Real steps, real Chinese search terms, real timelines. It must read as honest help, never a teaser.
- **Name no shops or suppliers.** The one exception is JLC, and only where Brian named it himself.
- **Let the hard parts show, without bragging.** Being on the ground in China, speaking Chinese, visiting in person, payment and accounts, and above all years of trusted relationships (which can't be bought) should come through naturally in the telling.
- **Let the close turn that into the CTA:** "you can do this yourself, and here's how, or we can do it faster and better because we already have the relationships." Warm and confident, not salesy.
- **The point is honest advertising.** Everything we say is true and useful on its own; the reader decides whether to do it themselves or hand it to us.

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
