---
title: "Designing Moldable Parts: A Checklist Before You Send the File"
date: "2026-10-18"
tag: "Sourcing"
excerpt: "Most injection molding problems are designed in, long before the mold is cut. A skimmable checklist for walls, ribs, bosses, corners, holes, text and finish, so the file you send is one a shop can actually mold."
related: ["hex-puck-lights"]
series: "field-notes"
seriesOrder: 8
---

Most injection molding problems are designed in, long before anyone cuts steel. The good news is that the same dozen mistakes cause most of them. This is the checklist we run through before a file goes to a mold shop.

Every number below is a **rule of thumb**, typical for consumer housings in ABS or PC. They are starting points, not absolutes. Your resin, part size and shop will move them, and a good shop will tell you where.

## 1. Keep walls uniform

Plastic cools and shrinks as it freezes. Thick areas freeze last and shrink most, which pulls the surface in (a sink) or leaves voids inside. Thin areas freeze first and can starve the thick ones.

- Aim for one wall thickness across the whole part.
- Where it must change, transition gradually, about 3:1 over the length of the change, never a sudden step.
- Core out thick sections instead of leaving them solid. A pocket from the back keeps the outside wall at normal thickness.

## 2. Watch where surfaces meet

Look at every place where walls, ribs and bosses join. These intersections are thick spots, and thick spots are where sinks show up. Rule of thumb: find the places where multiple surfaces meet, because that is where the sinks are.

The fix is to keep the material at the junction from stacking up:

- Make ribs thinner than the wall they attach to, not equal to it.
- Core out the junction from behind, or move the rib so it does not land opposite a cosmetic face.
- Do not let two ribs cross at a point. Stagger them.

Sinks are a cosmetic problem first. If the face is hidden, you can often live with one. If it is a visible, glossy face, fix the thick spot in the model.

## 3. Keep features perpendicular to the pull

The mold opens in one direction. Anything that points straight along that direction is cheap. Anything at an angle to it, or sideways, cannot release on its own and needs a **slide** or **lifter**, which is extra steel, extra moving parts and extra cost.

So when you have a choice, line features up with the pull. A side hole, a hook facing sideways or an angled clip all add cost. Sometimes you need them anyway; just know the price. For how a shop decides on slides, see [our article on fast injection molds](/articles/fast-injection-molds/).

## 4. Pick walls and ribs together

Typical wall thickness for consumer housings is about 1.5 to 2.5 mm. Rib thickness is normally set relative to the wall, not as a fixed number. A common rule of thumb is about 50 to 60 percent of the wall for materials prone to sinking. That is why a rib no thinner than about 0.8 mm fits roughly 1.5 mm walls, and a 2.5 mm wall wants a thicker rib.

- Rib height up to about 3x the wall thickness. Taller ribs are hard to fill and eject.
- A small radius at the rib base to avoid a stress point, but not a big one, which makes the junction thick again.
- Several short ribs usually beat one tall one.

## 5. Design bosses to be cored, not solid

Bosses carry screws. A solid lump is a sink and a void waiting to happen.

- Outside diameter about 2x the screw (the diameter it receives).
- Core the boss: the screw goes into a hole in a tube, not a solid cylinder.
- Tie the boss to the nearest wall with ribs, rather than leaving it floating or fused solid to the wall.
- Keep the boss wall thin, in line with the rest of the part.

For self-tapping screws, ask the shop what hole size they want for your resin. It depends on material and screw type, and they will have tried it.

## 6. Round the corners

Sharp inside corners concentrate stress and make plastic flow badly. Add a radius to every inside corner, at least about 0.5x the wall thickness.

The outside corner should follow the inside one: outside radius = inside radius + wall thickness. That keeps the wall an even thickness around the bend, which brings us back to rule 1.

## 7. Undercuts and snap-fits

Undercuts trap the part in the mold. Design them to work in the pull direction where you can. A snap-fit hook can often be molded through a window in the wall so that both sides open straight, with no slide. If an undercut has to be sideways, accept a slide and its cost.

## 8. Give holes room

- Leave material between a hole and the edge of the part, and between neighbouring holes. Thin bridges of plastic are weak and hard to fill.
- Through-holes beat blind holes. A through-hole is formed by a pin supported at both ends; a long blind pin is fragile and can bend.
- Holes in the pull direction are cheap. Side holes need slides (rule 3).

## 9. Raise your text and logos

Put text and logos raised on the part, which means they are cut into the steel. Recessed text on the part is raised metal in the mold, and it is harder to change later. Cutting more steel away is easy; adding steel back is not. If your logo or wording may change, raised is the cheaper choice.

## 10. Know where the marks will be

Every molded part carries marks from how it was made:

- **Gate**: where plastic enters. It leaves a small scar.
- **Ejector pins**: push the part out and leave round marks on the surface they touch.
- **Parting line**: a faint seam where the two halves of the mold meet.

You cannot avoid all three, but you can choose where they land. Tell the shop which faces are cosmetic and which are hidden, and they will place gates and pins on the hidden ones.

## 11. Respect shrink and tolerances

Plastic shrinks as it cools, by an amount that depends on the resin. The shop compensates for it, but it is never perfect.

- Do not over-tolerance. Tight tolerances on every dimension cost money and often cannot be held.
- Specify the critical dimensions only: the places where parts mate, seal or snap.
- Leave everything else at the shop's general tolerance.

Realistic expectations make a better part than ambitious ones that nobody can hit.

## 12. Living hinges: use PP

If you want a one-piece hinge that flexes thousands of times, use polypropylene. PP is the standard material for living hinges. ABS and PC will crack. Keep the hinge thin, uniform and flowing straight across, and talk to the shop about the gate position.

## 13. Specify finish early

Surface finish changes the mold's cost, lead time and look. Name it up front, using a standard: SPI for polish grades, VDI 3400 or MT for texture. Textured faces take more time and cost.

## Draft and the parting line: leave them to the shop

Draft angles and the parting line are the mold shop's job. Unless you're an expert, you're likely doing it wrong.

Our rule, for standard housings, toys and consumer electronics: Adding draft makes your model hard to change and does not reduce mold cost or time. Automotive is likely the exception.

The only thing we ask of you is to flag textured and cosmetic faces early, because the shop drafts those surfaces differently. The longer story is in [our molds article](/articles/fast-injection-molds/).

## Common mistakes

- Solid, thick bosses and ribs as thick as the wall.
- Sharp inside corners.
- Angled and side features that could have lined up with the pull.
- Tolerances on every dimension.
- Not telling the shop which faces are cosmetic.
- Choosing a finish after the mold is cut.

For the earlier steps, see [our prototyping article](/articles/fast-prototyping-china/).

Working on something like this? [Get in touch](/contact/).
