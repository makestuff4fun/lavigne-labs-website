# Blurb vs. archived page discrepancies

The 8 inferred blurbs in `web/content/projects.ts` were left untouched. Where the archived Wayback page says something different, it is listed here for Brian.

- **microscope-slider** — Blurb: "motorized X/Y stage … motion control, custom driver board". Archive: a manual sliding stand (X/Y table under the workbench, aluminum plate, linear rails, cable chains); "with a simple push, the microscope glides". No motor or driver board mentioned.
- **micropython-system** — Blurb: generic stackable platform. Archive: it is "PyBikeBrain", a modular microPython board for E-bikes, with layers (Control, Serial, Input, Power, Kelly, …).
- **camera-arm** — Blurb: "repeatable positioning on the bench". Archive: carbon fiber tubes, polished steel spheres, red aluminum pressure plates, inspired by Robin Renzetti's design; a bespoke production prototype. Bench positioning is not mentioned.
- **mechanical-keyboard** — Blurb: "custom keyboard from PCB to case — switch matrix, firmware, machined enclosure". Archive: reproduction of Input Club's open-source K-type keyboard as a manufacturing/BOM-cost study. Own PCB, firmware and switch-matrix design are not claimed.
- **whiteboard-plotter** — Blurb says "control board and toolpath software". Archive: uses a 3D printer control board and open-source software, plus a text-to-G-code feature. Broadly consistent, but not a custom control board.
- **hex-puck-lights** — Blurb: "modular hexagonal RGB light tiles — addressable LEDs". Archive: Black+Decker Hex Puck under-cabinet lights: master puck (proximity sensor, or IR remote in the color variant) plus satellite pucks. Addressable LEDs are not mentioned. The emphasis is a low-profile, screwless, clip-based housing.
- **custom-dog-leashes** — Blurb: "small-batch product run — material sourcing, hardware, production". Archive: custom-printed leashes with pet names, made with a custom heat press and a CNC sewing machine. Roughly consistent but more specific.
- **handheld-sokoban** — Blurb: "pocketable handheld console — custom PCB, display, controls, firmware". Archive: "Freezing Fortress", a Sokoban-style game with a D-pad, two buttons, a 7" retro LED screen (10x140 grid), ABS case, 3000mAh battery. "7 inch" contradicts "pocketable". Unreleased.
- **pcb-artwork** — Blurb: "pushing what a PCB can look like". Archive is a tutorial on PCB artwork in Altium, with a KiCad section marked "coming soon". Consistent.
- **digital-badge** — Archive: ESP32-S3 + 2.4" 8080 LCD badge for Maker Faire Shenzhen (2024-11-16), with a Flappy Bird style game. The blurb says "conference badge … real production path". Maker Faire is not a conference, and a production path is not mentioned.
- **badge-pcb-layout** — Consistent (layout walkthrough). The blurb's "DFM" emphasis is not verified.
- **8080-lcd** — Consistent (ST7789P3 2.4" TFT, Arduino GFX). The blurb says "from scratch — bus timing, drivers"; the archive uses the Arduino GFX library.

## WordPress database vs. Wayback (2026-10-18)

The original WordPress text outranks the Wayback text and is now used in `projectDetails.ts`. For 5 of the 12 projects the two are identical; the rest differ only in punctuation, image captions that Wayback dropped, and links. Material differences:

- **custom-dog-leashes** — WP adds a 2024 note: "*Edit* 2024 Current best solution is direct printing to material." (the heat-press method is no longer the best solution). Missing from the Wayback copy.
- **digital-badge**, **badge-pcb-layout**, **8080-lcd** — WP has the figure captions (schematic/layout labels); the Wayback text omitted them. The 8080-lcd Arduino GFX layers are an ordered list in WP.
- **micropython-system**, **camera-arm** — closing paragraph differs slightly in wording.

Blurbs: the 8 originally inferred blurbs, plus the digital-badge, badge-pcb-layout, 8080-lcd and pcb-artwork blurbs that this file marked as unverified or contradicted, were rewritten from the WP text in `web/content/projects.ts`. The earlier contradictions (motorized stage and driver board for the microscope, "pocketable" sokoban, "conference badge", etc.) are resolved in favour of WP.
