# fastener-sheet.html — maintainer's guide

Everything another agent needs to modify, extend or improve `fastener-sheet.html`.
Read this before touching the file.

> **Where it lives now:** the fastener calculators are live on the site at
> `web/public/tools/fasteners/*.html` (listed in `web/content/tools.ts`, shown on
> `/tools`). Edit them there — that copy is what deploys. The five other pages
> (inch sheet, holding-force ×2, torque ×2) sit beside this one.

---

## 1. What this is

A single-page, offline-capable metric fastener reference. The user picks a **size** (M2–M20), a **pitch** (coarse/fine) and a **part** (five screw types, three nut types); the page redraws a three-view engineering drawing and repopulates three data tables.

- **File:** `fastener-sheet.html`, 702 lines, fully self-contained.
- **Dependencies:** one Google Fonts stylesheet (IBM Plex Sans / Sans Condensed / Mono). Nothing else. No build step, no npm, no framework, no database.
- **Deploy:** copy the file to a web root. That is the whole deployment.

### Audience and priority

Written for **hobbyists and makers who 3D model**, with professional engineers as a secondary audience. This ordering was set explicitly by the project owner and drives every decision:

1. **Physical dimensions** of the fastener — what you need to draw it
2. **Hole preparation** — clearance, tap, counterbore, countersink, head clearance
3. **Strength and torque** — present but deliberately secondary

If a change would trade dimensional completeness for strength content, don't make it.

### Non-negotiable content rules

- **Every number must be traceable.** If you cannot point at a source table, flag it as an estimate (§6). Silently guessing is the worst possible failure for this tool.
- **Head dimensions are maximum values.** Model to worst case. Label them as max where space allows.
- **Anything that depends on the user's own part is a formula, not a number.** Engagement, tapped depth, drill depth and bolt length are all shown as equations. This was a direct instruction — do not "helpfully" resolve them to examples.
- **Red (`--flag`) means estimate, warning, or active highlight.** Never decoration.

---

## 2. Page structure

Top to bottom:

| Element | Selector / id | Purpose |
|---|---|---|
| Masthead | `header` | Eyebrow, big size title (`#bigsize`), pitch caption (`#pitchline`) |
| Pitch tabs | `#pitchtabs` | Coarse / Fine |
| Size tabs | `#sizetabs` | M2 … M20, built from `SIZES` |
| Part tabs | `#parts` | 5 screws, divider, 3 nuts. Built from `PARTS` |
| Drawing | `.plate > svg#dwg` | Three-view drawing, `viewBox="0 0 1100 412"` |
| Formula strip | `#formulas` | Mono line of equations; content swaps screw ↔ nut |
| Estimate banner | `#estbanner` | Red; shown conditionally |
| Data band | `.band` | 3 columns: `#holerows`, `#printrows`, `#glancerows` |
| Title block | `.titleblock` | Standard, cross-refs, units/projection, sheet id |

The band is a CSS grid `1.65fr 1fr 1fr`, collapsing to one column under 940 px.

---

## 3. Design system

Do not introduce new colours or typefaces. The palette is deliberate: drafting film, graphite line work, dimension blue, revision red.

```css
--film   #E7E9E3   page background (drafting film)
--paper  #F6F7F3   drawing plate, cards, hovered rows
--ink    #14181A   line work and body text
--graphite #6D7472 secondary text, hatching, hidden detail
--rule   #C3C7BF   borders
--rule-soft #D9DCD4 table row separators
--dim    #2C6E9E   dimension lines, leaders, all dimension text
--flag   #B4451F   estimates, warnings, active highlight — nothing else
```

Type roles:

- `--cond` **IBM Plex Sans Condensed**, uppercase, letterspaced — headings, tabs, view labels. This is imitating single-stroke drafting lettering; the tracking is load-bearing, not decorative.
- `--sans` **IBM Plex Sans** — prose, table label column.
- `--mono` **IBM Plex Mono** with `tabular-nums` — every number, everywhere. Numbers must align in columns.

Structural conventions worth preserving:

- The **title block** at the bottom is a real drawing convention doing real work: it carries data provenance and the projection note. Don't turn it into a footer.
- **Third-angle projection** — view A (from above) sits above view B (side). Say so in the title block.
- Section hatching runs in **opposite directions** for the two parts (correct convention for adjacent components), and **fasteners are drawn unsectioned** (also correct).

---

## 4. The drawing

### 4.1 Coordinate system — read this before changing any geometry

The single most important trick in the file:

```js
SC = 30 / d;   // px per mm, set at the top of drawScrew() and drawNut()
```

All part geometry is expressed in **multiples of d**, so at every size the drawing occupies an identical pixel footprint and only the numbers change. The shank always renders 30 px wide. Without this an M20 runs off the canvas and an M2 becomes invisible.

**If you add geometry, express it in multiples of `d`, not in fixed pixels or fixed millimetres.**

Fixed layout constants (pixels in viewBox space):

```
XB = 230    view A + view B centreline (they share it — third angle)
XC = 600    view C (section) centreline
YA = 50     view A centre
YT = 130    material top surface — the shared datum between B and C
BLW = 120   section block half-width;  BL = 480, BR = 720
DB1 = 185, DB2 = 150    view B dimension columns (right to left)
DC1 = 440, DC2 = 400    view C dimension columns
LXA = 350, TXA = 374    view A leader elbow x / text x
LXC = 790, TXC = 814    view C leader elbow x / text x
YLAB = 380  baseline for the A/B/C view labels
```

Derived vertical layout — **constant in pixels at every size**:

| Mode | Quantity | Value | Pixels |
|---|---|---|---|
| screw | clamped part t₁ | 2·d | YM = 190 |
| screw | tapped part t₂ | 5·d | YB = 340 |
| screw | drawn screw length | 4·d | tip = 280 |
| screw | engagement E | 4d − 2d + c | — |
| nut | each plate | 1.5·d | YM = 175, YB = 220 |
| nut | grip | 3·d | — |

Drill depth is `E + 4P`, so it is the one value that shifts slightly with pitch. Verified in bounds for every size (see §8).

### 4.2 The three views

- **A — from above** (`a-head`, `a-drive`, `a-thin`): head or nut outline plus drive. Hexagon for hex bolts and all nuts; circle for socket heads. Nuts additionally show the thread as two concentric circles.
- **B — side** (`b-body`, `b-minor`, `b-hidden`, `b-extra`): the fastener alone. `b-hidden` uses dashed hidden-line style for the socket / internal thread. `b-extra` draws the nylon collar line on nyloc nuts.
- **C — section** (`plateTop`, `plateBot`, `tapThread`, `c-screw`, `c-washer`, `c-nut`): the fastener installed. In screw mode: clamped part + tapped part. In nut mode: two clearance-holed parts, washer and nut.

Plates are single paths using `fill-rule: evenodd` — outer rectangle subpath followed by the hole profile subpath. That is how the hole becomes a void with a correct outline in one element.

`proj1` / `proj2` are faint dashed lines linking B and C at the head and tip levels. They make the projection alignment legible; they are not structural.

### 4.3 Dimension groups and the highlight system

Every dimension lives in `<g class="dgroup" data-dim="NAME">`. `showGroups([...])` sets `display:none` on everything not listed, so screw mode and nut mode share one set of DOM nodes.

`data-dim` values: `dk drive k l t1 eng drill cb clr tap nutm lmin`

Two element patterns inside a group:

- **Stacked dimension** — built by `vdim(prefix, x, y1, y2, fromX, label)`. Requires four ids: `<prefix>-ext-t`, `-ext-b`, `-line`, `-txt`.
  **The prefix is not the same as `data-dim`.** Mapping: `k→k`, `l→l`, `t1→t`, `eng→e`, `drill→d`, `nutm→m`. If you add one, keep the mapping documented here.
- **Leader callout** — built by `leader(pathId, textId, sx, sy, elbowX, elbowY, textX, label)`. Ids are `ld-*` and `tx-*`.

Optionally a group contains `hl-*`: an invisible overlay path that traces the actual feature geometry. It becomes red and thick under `.lit` (hover) or `.pinned` (click). This is what makes clicking "counterbore" outline the real counterbore walls rather than just recolouring a number.

**Wiring:** rows in `#holerows` carry `data-dim`. `wireHoleRows()` binds hover → `.lit` and click → `.pinned`. Only one pin at a time; the pin deliberately survives size, pitch and part changes so you can watch a feature morph.

`wireHoleRows()` must be called after every `fill('holerows', …)` because the rows are recreated.

---

## 5. Data model

`DATA` is keyed by size. **`M2.5` is stored as `M2_5` with `label:'M2.5'`** — use `nameOf(key)` for anything user-facing.

Builder functions keep the blob readable:

```js
T(P, tap, As, est)                    // a thread: pitch, tap drill, stress area
SW(dk, k, s, t, cb, b, est)           // socket-type screw WITH counterbore
BT(dk, k, s, b, est)                  // button head — no counterbore, sits proud
CK(dk, k, s, b, est)                  // countersunk — sets cs = dk internally
HX(af, k, b, est)                     // hex bolt — dk and s both = across flats
NT(af, e, m, collar, est)             // nut: across flats, across corners, height
PR(pocket, corners, pilot, boss, plastic, clr)   // the printed-parts table rows
```

Size-level fields:

```js
M6:{
  d: 6,                       // nominal diameter — drives SC and all proportions
  label: 'M2.5',              // OPTIONAL, only where the key can't be the label
  threads:{ coarse:T(...), fine:T(...) },
  clr:{ close:, normal:, loose: },   // ISO 273
  chamfer: 6.80,              // edge chamfer ⌀ on a plain clearance hole
  estChamfer: 1,              // OPTIONAL flag
  printedClr: '7.00 – 7.20',  // string, may be '—'
  washer:{ id:, od:, t: },    // ISO 7089
  torque: '9.8 / 14 / 16',    // 8.8 / 10.9 / 12.9, N·m, calculated
  torx: 'T30',
  estTorx: 1,                 // OPTIONAL
  secondChoice: 1,            // OPTIONAL — triggers the ISO second-choice banner
  printed: PR(...),
  screws:{ shcs:, low:, button:, csk:, hex: },
  nuts:{ nut:, thin:, nyloc: }
}
```

### How the drawing decides what hole to cut

Inferred from the part object, not from the part id:

```js
prep = p.cb ? 'cbore' : (p.cs ? 'csink' : 'none');
```

So a screw with a `cb` field gets a counterbore, one with `cs` gets a countersink, and one with neither sits proud on the surface with `c = 0`. If you add a head style, set the right field and the geometry, tables and formula strip all follow automatically.

---

## 6. The estimate system

33 of 104 part entries are currently flagged. The flag surfaces in **four places** so it can't be missed:

| Where | Driven by |
|---|---|
| Dot on the part tab (`<i>●</i>`) | `screws[id].est` / `nuts[id].est` |
| Red note bottom-left of the drawing (`#estnote`) | `info.est` |
| `ESTIMATE` badge on affected table rows | `badge(flag)` returning the `EST` constant |
| Red banner under the drawing (`#estbanner`) | `info.est`, `TH.est`, `S.secondChoice` |

The `Printed & plastic parts` column header is **permanently** badged `ALL ESTIMATE` — every value there is calculated from nut and screw dimensions rather than measured, and always will be. Those are test-coupon starting points by nature.

Torque is labelled **"calculated"**, not estimated — it comes from `T = K·d·F` with `K = 0.2` and `F = 0.7 × proof load`, which is a defensible method, not a guess.

**To clear a flag:** replace the numbers and delete the trailing `1` argument from the builder call. Nothing else needs changing.

---

## 7. Data provenance

Know what you can trust before you edit it.

| Data | Source | Confidence |
|---|---|---|
| ISO 4762 socket cap — all sizes | fasteners.eu full dimension table (fetched) | **High** |
| DIN 7984 low head — all sizes incl. M18 | Westfield Fasteners spec PDF (fetched) | **High** |
| ISO 7380-1 button — M3 … M16 | Westfield / Aspen spec sheets | **High** |
| ISO 273 clearance holes — all sizes | Multistandard clearance table | **High** |
| Counterbore ⌀ and edge chamfer | Carbide Depot metric counterbore table (fetched) | **High** |
| ISO 898-1 property classes | Fastenal / ISO extracts | **High** |
| Tap drills (d − P) | Arithmetic + confirmed against several charts | **High** |
| Tensile stress areas | Standard published values | **High** |
| Hex nut / washer / hex-bolt across-flats | General standards knowledge, not fetched | **Medium** |
| ISO 10642 countersunk, M5 and up | Extrapolated from the 2.24·d / 0.62·d ratio | **Low — flagged** |
| M2, M2.5 low head + button | Below the standards' M3 floor | **Low — flagged** |
| M18 (except low head) | Absent from ISO 4762 entirely | **Low — flagged** |
| Thin nut / nyloc heights at M2, M2.5, M14, M18, M20 | Interpolated | **Low — flagged** |
| Everything in the printed-parts column | Calculated from nut and screw dims | **Derived — always flagged** |

**Finding worth preserving:** M18 is an ISO *second-choice* size and does not appear in ISO 4762 at all. DIN 7984 does cover it. The `secondChoice` flag surfaces this in the banner — don't remove it.

---

## 8. Testing

There is no browser in the authoring environment, so the file is validated with a DOM shim that throws on `NaN`, `undefined` or malformed attribute values. **Run this after any change to the data or the drawing code.**

Save as `/tmp/shim.js`:

```js
const els = {};
function mk(id){
  return els[id] || (els[id] = {
    id, attrs:{}, style:{}, dataset:{}, children:[], _text:'', innerHTML:'',
    classList:{ _s:new Set(), add(c){this._s.add(c)}, remove(c){this._s.delete(c)},
                contains(c){return this._s.has(c)}, toggle(){} },
    setAttribute(k,v){
      if(v===undefined||(typeof v==='number'&&isNaN(v))||String(v).includes('undefined')||String(v).includes('NaN'))
        throw new Error('bad attr '+id+' '+k+' = '+v);
      this.attrs[k]=v;
    },
    getAttribute(k){return this.attrs[k]},
    appendChild(c){this.children.push(c)},
    addEventListener(){}, querySelectorAll(){return []},
    set textContent(v){
      if(v===undefined||String(v).includes('undefined')||String(v).includes('NaN'))
        throw new Error('bad text '+id+': '+v);
      this._text=v;
    },
    get textContent(){return this._text}
  });
}
global.document = {
  getElementById: mk,
  createElement: (t)=>({tag:t,attrs:{},dataset:{},
    classList:{add(){},remove(){},contains(){return false},toggle(){}},
    children:[],appendChild(c){this.children.push(c)},addEventListener(){},
    setAttribute(k,v){this.attrs[k]=v}, getAttribute(k){return this.attrs[k]},
    set textContent(v){
      if(v===undefined||String(v).includes('undefined')||String(v).includes('NaN'))
        throw new Error('bad cell text: '+v);
      this._t=v;
    },
    get textContent(){return this._t},
    set innerHTML(v){ if(String(v).includes('undefined')) throw new Error('bad cell html: '+v); this._h=v; },
    get innerHTML(){return this._h}
  }),
  querySelectorAll:()=>[], querySelector:()=>null
};
```

Then extract the page script, swap the final `render();` for a loop over every combination, and run it:

```python
import re
s = open('fastener-sheet.html').read()
js = re.search(r'<script>(.*?)</script>', s, re.S).group(1)
loop = """
var _sz=Object.keys(DATA), _pt=PARTS.map(function(p){return p.id;}), _pi=['coarse','fine'], bad=0, n=0;
for(var a=0;a<_sz.length;a++)for(var b=0;b<_pt.length;b++)for(var c=0;c<_pi.length;c++){
  SIZEKEY=_sz[a]; PARTID=_pt[b]; PITCH=_pi[c]; n++;
  try{ render(); }catch(e){ bad++; console.log('FAIL '+_sz[a]+'/'+_pt[b]+'/'+_pi[c]+' -> '+e.message); }
}
console.log(bad===0 ? 'ALL '+n+' COMBINATIONS OK' : bad+' FAILURES');
})();
"""
open('/tmp/app.js','w').write("require('/tmp/shim.js');\n" + js.replace("\nrender();\n})();", loop))
```

```bash
node --check /tmp/app.js && node /tmp/app.js     # expect: ALL 208 COMBINATIONS OK
```

Also check geometry stays inside the 1100 × 412 canvas: for every size, `yDrill < YB` in screw mode and `nutBottom < tip < 395` in nut mode. Both currently pass for M2 through M20.

---

## 9. Recipes

### Add a size

1. Add a `DATA` entry with all fields from §5. Use `M8_5`-style keys with a `label` if the name contains a dot.
2. Add the key to `SIZES` in display order.
3. Flag anything you couldn't source with the trailing `est` argument.
4. Run the shim test.

That's it — tabs, tables, drawing and formulas are all generated.

### Add a screw head style

1. Add a builder call to every size's `screws` object (or accept that missing entries need a guard).
2. Add `{id, kind:'screw', name}` to `PARTS`.
3. Add `FORM[id]` — one of `flat`, `dome`, `taper`. Add a new form only if the silhouette genuinely differs, and extend `screwPath()`.
4. Add `STD.coarse[id]` and `STD.fine[id]`.
5. Give it `cb`, `cs` or neither, per §5.

### Add a nut style

Same shape: `nuts` entry via `NT()`, `PARTS` entry with `kind:'nut'`, `STD` entries. `drawNut()` handles the rest. The `collar` argument drives the nyloc collar line.

### Clear estimate flags from supplied data

Replace numbers, drop the trailing `1`. Then re-run the test — the flag count in `#estbanner` and the tab dots update automatically.

---

## 10. Known gaps and candidate improvements

**Data**
- 33 flagged entries awaiting real values. Biggest cluster: ISO 10642 countersunk for 11 sizes.
- No M1.6, M22, M24 or above.
- No inch series at all. UNC/UNF was scoped out as secondary.
- Fine-pitch second options (M10 × 1, M12 × 1.25) not represented — only one fine pitch per size.

**Features not built**
- No unit toggle (mm ⇄ inch).
- No search / callout parser (`M6x1`, `1/4-20`, `DIN912`).
- Print stylesheet is minimal — hides tabs only. A proper one-page A4 layout is unbuilt.
- No offline service worker.
- No `/data/fasteners.json` export. The `DATA` object is already the single source of truth, so exposing it as JSON for CAD macros or scripts is close to free and was identified as a differentiator.
- No standards cross-reference view (ISO ↔ DIN ↔ JIS ↔ ASME).

**Known weaknesses**
- **Mobile.** A 1100-unit viewBox scaled into a ~380 px viewport makes 11.5 px dimension text very small. The intended fix is stacking the three views vertically below ~700 px rather than shrinking the whole sheet.
- Leader lines cross the section hatching on their way out to the right. Normal drafting practice, but it may read as busy — an alternative is a callout list beside the drawing.
- Countersunk head diameters at M18/M20 are large relative to the drawn block; not visually verified.
- No visual regression testing of any kind. Everything above is arithmetic and DOM validation only.

---

## 11. Hard constraints

Do not break these without an explicit instruction:

- **Single file, no build step, no package manager, no framework.** The file must still work in ten years by double-clicking it.
- **ES5-style JavaScript** — `var`, `function`, no arrow functions, no template literals, no `const`/`let`. Keeps it parseable everywhere and consistent with what's there.
- **No `localStorage` / `sessionStorage`.** State lives in the three module-scope variables `SIZEKEY`, `PARTID`, `PITCH`.
- **No new colours or typefaces.**
- **Never publish an unflagged number you can't source.**
