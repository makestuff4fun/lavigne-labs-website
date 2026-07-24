# fastners/ — staging area, **not part of the site**

Standalone drafts parked here for discussion. Nothing in this folder is built,
imported, linked, or deployed by the site in [`../web/`](../web) — it is
deliberately outside the Next.js app so it can't leak into a build by accident.

## What's here

Six self-contained, offline-capable fastener tools in three pairs (metric +
inch). Aimed at hobbyists/makers who 3D model, engineers second. Each is a
single HTML page with no build step and no dependencies beyond a Google Fonts
stylesheet — open one in a browser to view it.

**Reference sheets** — pick a size, thread series and part; get a three-view
engineering drawing plus dimension, hole-prep and torque tables.

| File | Covers |
|---|---|
| `fastener-sheet.html` | **Metric** — M2–M20, coarse/fine, 5 screw + 3 nut types |
| `fastener-sheet-inch.html` | **Inch** — #2–3/4″, UNC/UNF, 8 part types |

**"What will it hold?"** — screw selection by safe working load ("Pick a screw",
load tables in kg).

| File | Covers |
|---|---|
| `holding-force-metric.html` | Metric sizes |
| `holding-force-inch.html` | Inch sizes |

**"How tight?"** — tightening torque, including what the *hole* can take (not
just the screw), dry values.

| File | Covers |
|---|---|
| `torque-metric.html` | Metric, N·m |
| `torque-inch.html` | Inch sizes |

**Maintainer guides** — read before editing any of the above:

| File | Covers |
|---|---|
| `fastener-sheet-MAINTAINERS.md` | The metric sheet — page structure, design system, drawing geometry, testing, data rules |
| `fastener-sheet-inch-MAINTAINERS.md` | What differs in the inch sheet + data provenance |

> The four holding-force/torque pages have **no maintainer guide yet** — the
> sheet guides' §2–4 (structure, design system) and the non-negotiable data
> rules still apply in spirit. Worth writing one if these stay.

## Status / open question

These are candidates for the site's **Engineering tools** section
(`web/content/tools.ts` + `web/app/tools/`), which already ships a
`bolt-sizes` calculator — overlap with these sheets needs resolving. The shape
isn't decided:

- Link them as-is (drop the HTML into `web/public/`, link from `/tools`)?
- Port them to React components like the existing calculators?
- Six separate pages, or one tool with metric/inch and sheet/load/torque toggles?
- Keep them off the site entirely?

**Undecided — to discuss.** Until that's settled, edit them here; don't wire
them into the app.
