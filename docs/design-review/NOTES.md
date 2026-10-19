# Design pass notes (1440px / 390px, screenshots in `after/`)

Shot with `web/scripts/shoot-all.sh` (headless Chromium over CDP, no repo dependency). Shot set now also covers /faq/, /contact/, /tools/ and /articles/.

## What was wrong and what changed

**Shared tokens (app/globals.css)**
- Work and article index cards were built differently: 4:3 vs 16:9 image crops, p-6 vs p-7 padding, different hover behaviour, no keyboard focus state. Added `.card`, `.card-media` (3:2 crop, same radius and shadow) and `.card-body`, with a hover and focus-within state (border, deeper shadow, 2px lift unless reduced motion).
- No consistent focus ring. Added a global `:focus-visible` 2px accent outline.
- Added a `.tap` helper: 44px minimum height on mobile, 36px on desktop.

**/work/ and home featured work**: `ProjectCard` uses the shared card, so images are equal 3:2 crops, the title turns accent on hover, and tags went from 11px to 12px.

**/articles/**: article cards use the same card tokens and image crop. The series banner gets a hover shadow.

**Header**: mobile menu button is 44px (was 40px). Mobile menu items have more padding. Desktop nav links got a taller hit area.

**Buttons (`ui.tsx`)**: `min-h-11`, so every CTA meets the 44px target.

**Footer**: low-contrast text raised (headings white/50 to white/65, copyright white/45 to white/60). Footer links are now proper tap targets on mobile.

**Work detail, /tools/, /play, HowWeWork**: 11px mono labels and tags raised to 12px.

**FAQ, Contact, Tools, Charts, article pages**: reviewed. The hierarchy, line lengths and spacing rhythm were already consistent, so I changed nothing page-specific. They pick up the global focus ring, button size and footer changes. The article figures and the work viewer were left untouched.

## Seen but left alone
- Text-only article cards (no hero image) stretch to the height of their row neighbour, which leaves white space. Fixing it means adding images, which is a content change.
- Several article hero images are repeats (e.g. the hex puck photo), and some are heavily palette-quantised in the screenshots only (the screenshot script shrinks them). Replacing images is content work.
- The home page is long on mobile. Trimming it would change copy and structure.
- /tools/ cards have no hover lift like `.card`. They could adopt it later.
- The static calculators in public/tools are out of scope.
- Brand colours are unchanged; nothing was clearly broken.
