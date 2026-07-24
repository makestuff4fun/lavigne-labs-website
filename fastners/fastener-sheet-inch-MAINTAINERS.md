# fastener-sheet-inch.html — maintainer's guide

Companion to `fastener-sheet.html` (metric). Same architecture, same design system, different data and a handful of inch-specific conventions.

**If you have both docs, read `fastener-sheet-MAINTAINERS.md` first** — sections 2, 3, 4 and 8 (page structure, design system, drawing geometry, testing) apply here unchanged. This doc covers what is different and the inch data provenance.

- **File:** `fastener-sheet-inch.html`, self-contained, no build step.
- **Sizes:** #2 through 3/4″ — thirteen sizes.
- **Series:** UNC / UNF toggle.
- **Parts:** socket cap, low head, button, flat 82°, hex bolt, hex nut, jam nut, nylon lock.
- **Verified:** 208 size × part × series combinations render; all geometry stays inside the 1100 × 412 canvas.

---

## 1. What differs from the metric sheet

| | Metric | Inch |
|---|---|---|
| Series selector | Coarse / Fine | **UNC / UNF** |
| Thread spec | pitch P in mm | **TPI**, with `P = 1/tpi` derived |
| Countersunk head | 90° | **82°** |
| Clearance-hole edge chamfer | 90° | **60°** |
| Number format | 2 decimals | **3 decimals** (`f3`) |
| Tool sizes | decimal mm | **fractions** via `frac()`, with decimal alongside |
| Grades | ISO 898-1 — 8.8 / 10.9 / 12.9 | **SAE J429 — Grade 2 / 5 / 8** |
| Torque units | N·m throughout | **lb-in** for numbered sizes, **lb-ft** for fractional (`tUnit`) |
| Standards vary by series? | Yes — ISO 4017 vs ISO 8676 etc. | **No.** ASME part standards cover both UNC and UNF, so `STD` is a flat map |
| Odd-size flag | `secondChoice` (M18) | `unusual` (#12 and 7/16) |

Two of those are worth surfacing in the UI, and both are — the flat-head row says "82°, not the 90° metric angle" and the chamfer row says "60° in inch practice, not 82°". **Those two angles being different from each other, and both different from metric, is the single most common inch fastener mistake.**

### `frac()` — decimal to fraction

```js
frac(0.1875) → '3/16'    frac(0.0781) → '5/64'
frac(0.4375) → '7/16'    frac(1.125)  → '1-1/8'
```

Rounds to 64ths and reduces. Use it **only for values that are genuinely exact fractions** — hex key sizes, wrench sizes, across-flats, stock lengths. Head diameters like 0.507 are not fractions; show those as decimals via `f3()`.

### Derived fields

`t` (socket depth) and `b` (minimum thread length) are **not stored**. An init pass after the `DATA` literal fills them:

```js
q.t = (p==='shcs'||p==='low') ? 0.5*S.d : 0;   // socket depth ≈ half the nominal
q.b = 2*S.d + 0.5;                              // thread length ≈ 2d + 1/2"
```

Both are conventions rather than table lookups. `t` is cosmetic (it only draws the socket depth line). `b` is shown in the glance table with its formula visible in the third column, so the reader knows it's a rule of thumb.

`NT()` computes across-corners from across-flats (`af / cos30`) rather than storing it. That's exact hexagon geometry, so it can't drift.

---

## 2. Data model differences

Size keys avoid characters that are awkward in identifiers:

```
N2 N4 N6 N8 N10 N12          → labels '#2' … '#12'
F1_4 F5_16 F3_8 F7_16 F1_2 F5_8 F3_4   → labels '1/4' … '3/4'
```

**Every size has a `label`.** Always use `nameOf(key)` for display.

Builders:

```js
T(tpi, tap, tapTxt, As, est)   // tapTxt is the drill designation: '#7', 'F', '27/64'
SW(dk, k, s, cb, est)          // socket cap / low head
BT(dk, k, s, est)              // button
CK(dk, k, s, est)              // flat 82° — sets cs = dk
HX(af, k, est)                 // hex bolt — dk and s both = across flats
NT(af, m, collar, est)         // nut — across-corners computed
PR(...)                        // printed-parts rows
```

Size-level fields new or changed versus metric:

```js
threads:{ unc:T(...), unf:T(...) }   // not coarse/fine
tUnit: 'lb-in' | 'lb-ft'
estLoose: 1      // the loose-fit clearance column is estimated
estWasher: 1     // the SAE washer row is estimated
unusual: 1       // non-preferred size → banner
```

`CSK_ANGLE = 82` and `CSK_TAN = tan(41°)` are module constants. The countersink depth in view C is `(cs − clearance)/2 / CSK_TAN`, not `(cs − clearance)/2` as in the metric file where tan(45°) = 1. **If you change the head angle, change `CSK_TAN` with it.**

---

## 3. Data provenance

| Data | Source | Confidence |
|---|---|---|
| Socket head cap screw — head ⌀, height, hex size, all 13 sizes | Carbide Depot inch counterbore table (fetched) + ASME B18.3 chart extracts | **High** |
| Counterbore ⌀ and depth | Carbide Depot inch table (fetched) | **High** |
| Edge chamfer ⌀ (60°) | Same table — column is explicitly labelled 60° | **High** |
| Clearance, close and normal fit | Same table | **High** |
| Clearance, **loose fit** | Common published free-fit values, not from the fetched source | **Medium — flagged on numbered sizes** |
| UNC / UNF TPI and tap drills | Multiple cross-checked charts | **High** |
| Tensile stress areas | Standard published values | **High** |
| Hex nut across-flats and thickness, fractional | ASME B18.2.2, general knowledge | **Medium** |
| Hex bolt across-flats and head height, fractional | ASME B18.2.1 via cited article | **Medium** |
| Jam nut thickness, fractional | General knowledge | **Medium** |
| **Button head** — all sizes | Ratio-derived: A ≈ 1.75·d, H ≈ 0.53·d | **Low — flagged** |
| **Flat 82°** — all sizes | Ratio-derived: A ≈ 2·d, H from 82° cone geometry | **Low — flagged** |
| **Low head** — all sizes | No ASME standard exists | **Low — flagged** |
| Numbered-size hex bolts and jam nuts | Interpolated | **Low — flagged** |
| Nylon lock nut heights | Interpolated | **Low — flagged** |
| Printed-parts column | Calculated from nut and screw dims | **Derived — always flagged** |
| Torque | `T = K·d·F`, K = 0.2, F = 0.7 × proof × As, SAE J429 proof stresses (55 / 85 / 120 ksi) | **Calculated** |

**Two findings worth preserving:**

- **There is no ASME standard for inch low-head socket screws.** They're a commercial product and dimensions vary by manufacturer. Selecting Low head triggers a dedicated banner saying so. Do not remove it — a hobbyist modelling to a number from here would be modelling to a fiction.
- **Socket head cap screws are ASTM A574 (180 ksi), not an SAE J429 grade.** The torque row shows Grade 2/5/8 because that's what applies to hex bolts and nuts; A574 socket screws will take considerably more. Worth adding a per-part torque row eventually.

---

## 4. Estimate coverage

**65 of 104 part entries are flagged** — much higher than the metric sheet's 33, because the inch button, flat and low-head tables weren't obtainable from a citable source.

By part type:

| Part | Flagged | Why |
|---|---|---|
| Socket cap | 0 of 13 | Fully verified |
| Hex nut | 0 of 13 | Verified |
| Hex bolt | 7 of 13 | Numbered sizes + 7/16 |
| Jam nut | 6 of 13 | Numbered sizes |
| **Low head** | 13 of 13 | No standard exists |
| **Button** | 13 of 13 | Ratio-derived |
| **Flat 82°** | 13 of 13 | Ratio-derived |
| **Nylon lock** | 13 of 13 | Interpolated |

### What to source, in priority order

1. **ASME B18.3.5 flat countersunk socket head** — head ⌀ (A), head height (H), hex socket (J) for all thirteen sizes. Biggest single gap. Note the 1/4″ hex socket of 5/32″ is confirmed.
2. **ASME B18.3.4 button head socket** — same three fields. Standard covers #0 through 5/8″ only, so 3/4″ will stay flagged.
3. **Nylon insert lock nut heights** — ASME B18.16.3 / IFI-100.
4. **Numbered-size hex machine screw heads and jam nuts** — across flats and height for #2 to #12.
5. **Loose-fit clearance holes** — ASME B18.2.8, numbered sizes.

Low head cannot be resolved from a standard. The right fix is either to source one manufacturer's table and label it as such, or to drop the part type from the inch sheet.

---

## 5. Testing

Identical to the metric sheet — the same DOM shim, with the loop keyed on `SERIES` instead of `PITCH`:

```js
var _sz=Object.keys(DATA), _pt=PARTS.map(function(p){return p.id;}), _se=['unc','unf'];
for(...){ SIZEKEY=_sz[a]; PARTID=_pt[b]; SERIES=_se[c]; render(); }
```

Expect `ALL 208 COMBINATIONS OK`.

Sanity-check `frac()` after any change to it:

```
frac(0.1875)='3/16'  frac(0.4375)='7/16'  frac(1.125)='1-1/8'
frac(0.25)='1/4'     frac(0.0781)='5/64'  frac(0.3125)='5/16'
```

Bounds check as per the metric doc: `yDrill < YB` in screw mode, `nutBottom < tip < 395` in nut mode. Currently passes for all thirteen sizes; the tightest is #6 at `yDrill = 307` against `YB = 340`.

---

## 6. Known gaps

Everything in the metric doc's §10 applies. Additionally:

- **No sizes above 3/4″.** 7/8″ and 1″ are in the source counterbore table if wanted.
- **No #0, #1, #3, #5** — the odd numbered sizes exist but are rarely used.
- **No UNEF series** and no second UNF options.
- **No inch-metric cross-reference.** A "nearest metric equivalent" row would be genuinely useful given how often both appear in one assembly, and all the data to compute it already exists across the two files.
- **Socket cap screw torque is understated** — it uses SAE grades rather than ASTM A574. See §3.
- The two sheets are **separate files with duplicated code**. If both are to be maintained long-term, the drawing engine and table renderer should be factored into a shared script and each sheet reduced to its data blob. That refactor is roughly a day and would halve the maintenance surface.

---

## 7. Hard constraints

As per the metric doc: single file, no build step, ES5-style JavaScript, no browser storage, no new colours or typefaces, and never publish an unflagged number you cannot source.
