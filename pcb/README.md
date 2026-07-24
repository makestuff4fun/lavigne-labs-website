# pcb/ — PCB calculators, staged for the site

A calculator built **for the website**, parked here until it's wired into
`/tools`. Nothing in [`../web`](../web) imports it, so editing it can't affect
the live site until someone integrates it.

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
(Space Grotesk / Source Serif 4 / IBM Plex Mono) — **note this needs handling
before it goes live**, since the fonts are fetched from `fonts.googleapis.com`
at page load and visitors in China will see a slow or failed load.

## Integrating it

Open questions, same as for [`../fasteners`](../fasteners):

- Link as-is (drop the HTML into `web/public/`, link from `/tools`), or port to
  React components like the existing calculators?
- The site already ships `resistor-calculator`, `voltage-divider` and
  `wire-gauge` under `/tools` — this page **overlaps all three** (resistor
  divider, LED series resistor, trace width/current). Decide whether it replaces
  them, absorbs them, or stands alone.
- Self-host the fonts to avoid the Google Fonts dependency.

Until that's settled, edit it here; don't wire it into the app.
