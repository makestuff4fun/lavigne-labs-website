---
title: "Cantilever Snap Fits: Ratios, Not Equations"
date: "2026-10-18"
tag: "Sourcing"
excerpt: "Snap fits are some of our favourite features to design. The maths is nice, but a handful of thickness ratios gets you most of the way, and which way the hook faces decides whether the mold is simple or painful."
related: ["hex-puck-lights"]
series: "field-notes"
seriesOrder: 9
---

<!-- REVIEW NOTE
Corrected: Nothing of yours to correct; this is a fresh piece from your brief. I kept it ratio-first, with one optional "for the curious" line, written in words so the article has no equations at all. I did not tell readers to add draft anywhere; draft and parting line stay the mold shop's job, as in the molds article.
Added: FROM THE MANUALS (restated in my own words, no tables or text copied): beam length roughly 5-10x root thickness is our rule, the manuals do not state it that way, see Unsure; taper to half thickness at the tip (both manuals say this gives good results; the BASF one also mentions narrowing the width to about a quarter, which I left out); root radius, where both stress the root is the weak point and BASF notes returns diminish past about 0.6x thickness while a big radius makes a thick spot that sinks, so "about half" is a compromise; width scales force but not strain; friction raises assembly force; a short beam cannot reach the allowable strain, so U- or L-shaped snaps (longer effective beam through slots) are the escape; glass-filled grades have much lower allowable strain; rounded edges act like a gentler lead-in angle. OUR PRACTICE / MINE (not from the manuals): lead-in 25-35 degrees and retention 90 vs 30-45 degrees as stated here; the whole hook-direction and moldability section (hooks along the pull direction, the pass-through window trick, ganging snaps, what forces a lifter); the service-slot advice for permanent snaps; the Common mistakes box; the closing. Strike anything you disagree with.
Further reading, verified from tunnel-bear with curl -sIL on 2026-10-18: https://solutions.covestro.com/-/media/covestro/solution-center/brands/downloads/imported/1557214249.pdf returned HTTP 200, application/pdf, about 4.3 MB; I downloaded it and confirmed it is Covestro's 172-page "Part and Mold Design" design guide, which carries the snap-fit chapter. It is NOT the standalone Bayer booklet "Snap-Fit Joints for Plastics - A Design Guide", which I found only on third-party mirrors (not linked). https://ultrasimweb.basf.com/ returned HTTP 200; it is BASF's own Ultrasim site with a snap-fit calculator, per search results (I did not open the tool itself). I found NO official online copy of BASF's "Snap-Fit Design Manual" (only Scribd/pdfcoffee-style uploads, not linked), so it is cited by title only. If you know an official BASF URL, swap it in.
Unsure: Every number in the body is a rounded rule of thumb. Least sure, please check: (1) length 5-10x thickness, which is our practice and not a manual figure; (2) the allowable-strain ranges per material, all from memory of typical datasheet and manual values, not copied: ABS about 2%, PC about 2-4% (manuals quote different values depending on grade and one-time use), PC/ABS about 2-2.5%, PA dry about 3-4% and conditioned about 5-6%, POM about 4-5%, PP about 4-5% (some sources go higher), glass-filled about 1-2%; (3) lead-in 25-35 degrees and retention angles; (4) root radius "about half the thickness" (BASF discusses roughly 0.5-0.6 and gives a small absolute minimum I left out); (5) that the Covestro guide's snap-fit chapter descends from the Bayer booklet, which I inferred from similar content and the shared publisher history. Hook depth as a fraction of length is deliberately given only as a qualitative rule.
-->

<!-- DRAFT: Brian must read before this moves to web/content/articles/ -->

Cantilever snap fits are one of our favourite features to design. A bit of plastic bends out of the way, clicks home, and two parts are held together with no screw, no glue and no extra line item on the bill of materials. Done well, it feels wonderful in the hand. Done badly, it snaps off on the second assembly.

The maths behind them is real and nicely worked out. But in day-to-day design, ratios of thickness are often enough. This article is the ratio version, plus the part the textbooks tend to skip: which way the hook faces, because that decides how the mold is built. Everything here is a rounded rule of thumb, not a guarantee.

## Anatomy of a snap

Five names are worth learning.

- **Beam**: the flexible arm that bends during assembly.
- **Root**: where the beam meets the wall. This is where it bends most and where it breaks.
- **Hook**: the small catch at the tip of the beam.
- **Insertion face**: the ramp on the hook that meets the mating part first. It makes assembly easy.
- **Retention face**: the back of the hook that catches and holds. Its angle sets how hard the joint is to undo.

The depth of the hook, how far it hangs over the mating part, is called the undercut. The beam must bend at least that far to get past.

## Beam length versus thickness

Think of length as a multiple of the thickness at the root. Our rule of thumb is a length of about 5 to 10 times the root thickness.

- Much shorter, and the beam is stiff. To bend the hook's depth it has to stretch the plastic too far, and it over-strains and cracks.
- Much longer, and it is floppy. It bends easily but holds weakly, and it can buckle or vibrate loose.

If you cannot fit a long enough beam, do not shrink the hook and hope. Both manuals describe L-shaped and U-shaped snaps, where slots in the wall make the effective beam longer in the same space.

## Taper the beam

Make the beam thinner towards the tip, to about half the root thickness. Both manuals suggest roughly this, and it is an approximation, not a magic number.

A straight beam concentrates all the strain at the root while the tip barely works. Tapering shares the strain along the length, so you can bend further for the same stress. It also saves a little material and cycle time.

## Hook depth, and what the material allows

How deep the hook can be follows from how far the beam can safely bend, and that depends on the material. The longer the beam relative to its thickness, the deeper the hook it can clear. Each plastic has an allowable strain, which is the stretch it tolerates at the root without damage. Rough, rounded ranges for one-time or occasional assembly:

- **ABS**: about 2%
- **PC**: about 2 to 4%
- **PC/ABS**: about 2%
- **PA (nylon)**: about 3 to 4% dry, rising to 5 to 6% once it has absorbed moisture
- **POM (acetal)**: about 4 to 5%
- **PP**: about 4 to 5%, and it forgives repeated flexing

Glass-filled grades tolerate far less, often only 1 to 2%, because the fibres make the material stiff and brittle. A beam that was perfectly happy in an unfilled grade can crack the first time in a glass-filled one. Always check your resin's datasheet, since grades within a family differ.

For the curious, the tip deflection a beam can survive grows with the allowable strain times the length squared, divided by the thickness.

## The root radius

The root is the most common failure point. A sharp inside corner there concentrates stress and the beam snaps off at the wall.

Give the root a radius of about half the beam thickness. Bigger helps a little more, but a large fillet makes a thick lump where the beam meets the wall, and thick lumps cause sink marks and voids. Half is the compromise we reach for.

## Angles, width and force

The two faces of the hook do different jobs.

- **Insertion angle (lead-in)**: about 25 to 35 degrees from the direction of travel for easy assembly. Steeper, and you push harder; shallower, and the hook grows long.
- **Retention angle**: about 90 degrees for a permanent snap that will not come apart, and about 30 to 45 degrees for one that releases when pulled or pushed.

Width scales the force, not the strain. Doubling the width of the beam roughly doubles the force to bend it, but the strain at the root is the same. That is useful: if the joint feels loose, widen the beam. Do not thicken it.

Assembly force is also affected by friction. Slippery materials like POM and nylon assemble more easily than PC or ABS at the same geometry. Rounded edges on a hook act like a gentler lead-in angle.

A permanent snap should still be serviceable, because products come back. Give it a way in: a small release slot, or a gap where a thin tool can reach the hook. Otherwise the repair is a hammer.

## Hook direction and moldability

This is the part we care about most, and it is where experience pays. A hook is an undercut, and an undercut is something the mold cannot normally release from. The standard answer is a slide or a lifter: a moving piece of steel inside the mold. They work, but they cost money, add parts that wear, and can lengthen the tooling schedule.

Often you can design them out. The parting line and the pull direction are the mold shop's decisions, so we simply design with them in mind.

- **Face the hook along the pull direction.** A hook that points the way the mold opens, or toward the parting line, can often be formed by the two halves of the mold alone.
- **Form the hook through a window.** The classic trick: cut a window (a pass-through) in the wall or base beneath the hook. A steel core comes up through that window and shapes the underside of the hook, then pulls straight out. No slide. The window is also the visible clue on a lot of well-made plastic products.
- **Gang the snaps in one direction.** If every snap on the part points the same way, one mold action serves them all. Hooks pointing in opposing directions each need their own mechanism.
- **Know what forces a lifter.** A hook facing inward on a closed wall, with nothing beneath it to open up, has nowhere for steel to come from. That is the case that costs you a lifter.

Does the window cost anything? A little, in appearance and in stiffness, and sometimes a dust path. If it matters, a small cover or the mating part can hide it. Work this out with the shop early, since they decide the split.

Our advice matches the one from the molds article: give the shop a clean model and your requirements, and let their engineers choose the parting line and how each hook is formed. We have seen a single reorientation of a hook remove a slide entirely, and a single reorientation add one.

If you want the wider picture on moldable features, we cover it in [Designing Moldable Parts](/articles/designing-moldable-parts/), and on getting tooling fast in [Fast Injection Molds in China](/articles/fast-injection-molds/).

> **Common mistakes**
>
> - Sharp root corner. Add a radius of about half the thickness.
> - Beam too short for the hook depth, so it is stiff and over-strained.
> - Glass-filled resin in a snap designed for an unfilled grade.
> - Hook too deep for the material's allowable strain.
> - A hook that faces inward on a closed wall and forces a lifter.

## Rules of thumb

| Feature | Rule of thumb |
|---|---|
| Beam length | about 5 to 10 times root thickness |
| Tip thickness | about half the root thickness |
| Root radius | about half the thickness |
| Insertion angle | about 25 to 35 degrees |
| Retention angle, permanent | about 90 degrees |
| Retention angle, releasable | about 30 to 45 degrees |
| Width | scales force, not strain |
| Glass-filled resin | allowable strain roughly half of unfilled or less |
| Hook direction | along the pull direction, through a window if needed |

## Further reading

Please read the real thing, since the theory behind all this is free and public, and it is excellent. Two classics are worth your time:

- [Covestro's Part and Mold Design guide](https://solutions.covestro.com/-/media/covestro/solution-center/brands/downloads/imported/1557214249.pdf) is a long, generous design reference. Its snap-fit chapter descends from Bayer's "Snap-Fit Joints for Plastics - A Design Guide", with worked examples for cantilever, U-shaped, torsion and annular snaps.
- BASF's "Snap-Fit Design Manual" is a lovely, compact walk through beam theory, tapering, root stress and allowable strain. We could not find an official online copy to link, so we cite it by title only; ask BASF or your resin supplier. BASF also runs a [snap-fit calculator](https://ultrasimweb.basf.com/) if you want a first estimate of forces and deflections.

## Easy to show, hard to execute

Here is the honest bit. We have just handed you the recipe, and the books above hand you the ingredients. That is deliberate. It is easy to show and hard to execute. Knowing which ratios matter, how to orient every hook for the tool, and what a shop will quietly charge you for takes many projects to learn, and a few expensive mistakes.

You can absolutely do this yourself, and now you know how. Or we can do it faster and better: we are on the ground, we speak the language, we visit the shops in person, and we have years of relationships with trusted shops that get your parts made right the first time. If you would rather skip the learning curve, [get in touch](/contact/).
