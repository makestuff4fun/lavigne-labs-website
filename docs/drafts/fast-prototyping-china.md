---
title: "Fast Prototyping in China: Stop Asking Factories"
date: "2026-10-18"
tag: "Sourcing"
excerpt: "Many teams prototype with the wrong supplier, then wonder why the replies dry up by revision three. Here's how fast prototyping in China actually works, and who to ask."
series: "field-notes"
seriesOrder: 3
---

<!-- DRAFT: Brian must read before this moves to web/content/articles/ -->

Almost every hardware team that comes to us has the same story about their prototype. The first version came back quickly and looked decent. The second took a little longer. By the third or fourth, messages sat unanswered for days, and then they stopped getting answered at all. The product wasn't finished, and the supplier had quietly gone cold.

Nothing mysterious happened. They asked the wrong kind of supplier to do the wrong kind of job.

## The trap

Here's how it usually goes. You find a supplier on Alibaba. Their business is mass manufacturing: thousands of units, steady orders, a production schedule to keep. You show up wanting a prototype, or worse, iterative development, where the design changes every week.

The first version is often relatively painless. The supplier is friendly and quick, and the quote is fair. That's because they're hoping for a big order, and a prototype is the price of admission.

Then the revisions keep coming. Responsiveness drops. Replies get shorter and slower, and eventually they may stop answering altogether.

Wrong partner.

## The factory's view

It helps to stand where they're standing. A mass-production factory has a limited number of engineers and a limited number of CNC programmers. Every one of them is already committed to paying production work.

A one-off prototype doesn't fit into that. Someone has to stop what they're doing, program the machine, set up the fixture, run a single part, and check it. That interrupts production, and production is where the factory earns its living.

> Factories lose money on custom prototypes, even if you paid for them.

That isn't a character flaw. It's arithmetic. The prototype fee you paid doesn't cover the disruption it caused, so every revision costs them more than it earns.

## The prototype fee isn't leverage

Many founders believe that because they paid for the prototype, they've earned some leverage. They haven't. The fee is small next to the cost of pulling people off production, and the factory knows it.

Your only real hook is the lure of a big order down the road. That's a genuine incentive, but it's a fragile one, and it wears thin with every revision. Don't overplay it. Dangling a bigger order than you can deliver, or leaning on it again and again, is the fastest way to use it up.

## The solution: use shops built for prototypes

The fix is to stop asking factories to do something they aren't set up for. Instead:

- **Find shops that specialise in prototypes.** They exist across China, and prototype work is the whole business. Quick turnaround isn't a favour to them; it's the product. Search in Chinese, not English: 手板 (hand-built prototype), 快速打样 (rapid sampling), CNC加工 (CNC machining), 阳极氧化 (anodizing) and 线束加工 (wire harness) will show you a very different set of shops than the English terms do.
- **Source each part from a different shop.** Don't have one place coordinate everything for you. Every extra layer of coordination adds delay, and the coordinator has no reason to hurry.
- **Do the hand fitting and assembly yourself.** Once the parts are in front of you, you can see what fits, what rubs and what needs another pass, and you can decide on the spot.

### What goes in the request

A prototype shop quotes from what you send, so a vague request gets a slow, padded answer or none at all. For each part, send:

1. A 3D file in a standard exchange format, plus a 2D drawing.
2. Material and finish, stated plainly.
3. Quantity, which for a prototype is usually one to a handful.
4. The dimensions that actually matter, with tolerances only where they do. Everything else can stay loose.
5. Where it ships and when you need it.

Mark the critical fits on the drawing. A shop that can see what matters will protect it; a shop that can't will guess.

### How to split and sequence the parts

Start with the part that everything else depends on, usually the machined body, and order the long-lead and independent items in parallel with it. A typical sequence looks like this:

- One shop does the CNC machining, often in 24 to 48 hours.
- The parts go straight to the anodizing shop, which can turn them around in about 4 hours. Decide this hand-off before you order, so the parts move shop to shop without sitting around.
- While that's happening, you order bearings and hardware.
- You get the PCB from JLC, and either do your own pick-and-place or use JLC's assembly service.
- You get the wiring from a harness shop.
- Then comes hand fitting and final assembly, done by you or your team.

Add it up and you can be holding a working prototype in days, not weeks. This is fast prototyping, and it is how the best design firms get unbelievable prototypes and iterate on them so quickly.

### What you handle yourself

The recipe is simple to write down and harder to carry out. Someone has to do these things:

- **Talk to the shops in Chinese.** Most prototype shops work in WeChat chats, not email, and a message that is clear and polite in their language gets a faster, better answer than a translated one.
- **Pay the way they get paid.** Many small shops expect payment through domestic platforms and accounts, and setting those up from abroad is a project in itself.
- **Fit and assemble by hand.** When a part rubs or a hole is off, you decide what changes, and you send the revision the same day.
- **Judge the shops.** Photos and quotes look alike. Which shop holds its dimensions, answers at night and tells you when your drawing is wrong is something you learn over many orders, and often only by walking in the door.

## Why it works

These suppliers make money on each order. A prototype shop gets paid for every part it makes, so a revision is simply another order. They don't care if you do 50 revisions. Show me the money, and the next part is on the machine.

The incentives line up. You aren't asking for a favour or borrowing goodwill against a future contract, and you aren't hoping a busy engineer remembers you. You're a customer placing a normal order with someone whose business is exactly that order. Responsiveness stays high because every message you send is a reason for them to get paid.

That also changes how you can work. You can afford to be wrong. You can change a dimension, try a different material, or test two versions side by side, without worrying that you're spending someone's patience.

## The cost of getting it wrong

Now look at the other path. You took the Alibaba supplier through three revisions. Along the way they decided you were a dead end, and they lost money on you. Both sides walked away worse off.

Your product still isn't finished. And you've burned a possible mass-manufacturing partner: the one supplier you might actually have wanted when the design was ready. They remember that you consumed engineering time and never delivered the big order. If you come back later, you aren't a fresh prospect; you're the customer who wasted their time.

That's the real price. It's not only the weeks you lost on a stalled prototype. It's a relationship you'll want later and can't get back.

## When to go back to the factory

None of this means factories are the enemy. They're exactly the right partner for what they do best, which is production.

So go back to the factory at design freeze. Once the design has stopped changing and you know what you're building, a factory can do what it's good at: repeatable, efficient, high-volume manufacturing. Now the big order is real, and your leverage is real. You arrive with a proven design and a clear picture of what it takes to make it, and that's a much stronger position than a half-finished drawing and a promise.

Until then, you have two honest options. You can do this yourself. Everything above is the method: search the right terms, send a clean request, split the parts, sequence them, and fit them by hand. It works, and plenty of teams do it without us.

Or we can do it faster and better, because we're on the ground in China, we speak the language, we visit these shops in person, and we have years of relationships with trusted suppliers. Those relationships are the part you can't copy from an article. They're why a part gets slotted in tonight instead of next week.

<!-- Cross-links could go here once published: small-shops article, Brian's Law article. -->

This is the stuff no one explains to you. We've learned all the lessons the hard way, so you won't have to.

Get in touch at [/contact/](/contact/) and we'll help you find the right shop for each part of your prototype.
