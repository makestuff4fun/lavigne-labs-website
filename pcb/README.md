# pcb/ — PCB calculators (editing source)

The editing source for the "Copper & Patina" calculators, **live on the site
since 2026-07-31**. Nothing imports this folder directly — the served copy
lives at `web/public/tools/pcb/`, so an edit here only reaches the live site
after re-copying (see Status below).

## What's here

`pcb-calculator.html` — **"Copper & Patina — PCB Calculators for Hobbyists"**.
One self-contained page, ten calculators:

| | |
|---|---|
| Trace width and current capacity | Via current capacity and resistance |
| Trace resistance, voltage drop and loss | Resistor divider |
| Ohm's law and the power wheel | LED series resistor |
| Microstrip and stripline impedance | Filters and time constants |
| Current sense shunt | Reference tables |

No build step. The only external dependency is a Google Fonts stylesheet
(Space Grotesk / Source Serif 4 / IBM Plex Mono) — fetched from
`fonts.googleapis.com` at page load, so visitors in China see a slow or failed
font load. Self-hosting them is still open (same issue as the fastener pages).

## Status

**Live since 2026-07-31** — it followed the fastener calculators down the
"link as-is" route: listed in `web/content/tools.ts`, served from
`web/public/tools/pcb/pcb-calculator.html`. The `public/` copy differs from
this folder by an injected "← Lavigne Labs · Tools" back-bar after `<body>`
(same bar as the fastener pages).

**This folder stays the editing source.** After editing here, copy into
`web/public/tools/pcb/` and re-inject the back-bar, then export + deploy.

Still open: self-host the fonts to avoid the Google Fonts dependency (slow or
failed load for visitors in China).
