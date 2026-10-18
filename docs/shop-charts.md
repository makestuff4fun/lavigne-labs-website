# Shop charts — data layer

Printable drill charts for the Tools section (metric tap/clearance, inch tap/clearance, drill-size decimals).
Data: `web/content/shopCharts.json`. Verifier: `python3 web/scripts/check-shop-charts.py` (stdlib only, exit 1 on failure).
No pages, PDF or export yet — this is the data only.

## Prior work search (OneDrive, read-only)

Searched `.xlsx` shared strings and `.pdf` text under `Lavigne Labs` and `Documents` (onedrive2) for "tap"/"drill".
**No partly done tap-drill chart exists.** Only incidental hits: `example products.xlsx` and two expense/accounting
sheets (the word "drill" in product/expense lines), and `go kart/Nasa Fastner Torque Tables.pdf` (torque only, no drill sizes).
Nothing was written to OneDrive.

## Schema

- `metricTap[]`: `size, d, pitch, series (coarse|fine), tap, tapHard, clearClose, clearNormal, clearLoose, shcsCbore, shcsCboreDepth, fhcsCsink` (mm; cbore/csink fields may be `null`).
  - `tap` ≈ 75 % thread: D − 0.9743 P, rounded to a stocked drill (0.05 mm steps below 3 mm, 0.1 above).
  - `tapHard` ≈ 65 % thread: D − 0.8446 P rounded the same way, always ≥ `tap`.
- `inchTap[]`: `size ("1/4-20", "10-32"), series (UNC|UNF), major, tpi, tap, tapDec, tapHard, tapHardDec, clearClose, clearCloseDec, clearFree, clearFreeDec`. Drill names are `#n`, a letter, or a fraction; the `*Dec` fields are inches.
  `tapHard` is the nearest gauge drill at or above `tap` to major − 0.8446/tpi.
- `decimals`: `fractions[{frac,in,mm}]` (1/64…1), `number[{n,in,mm}]` (#80→#1), `letter[{l,in,mm}]` (A→Z). `mm = in × 25.4`, 3 decimals.

## Sources

- Metric thread geometry: ISO 261 (pitch selection), ISO 262 (preferred sizes); tap formula D − 0.9743 P (75 % thread).
- Metric clearance holes: ISO 273 fine / medium / coarse series (`close / normal / loose`). Fine pitches share the coarse row's clearances.
- Inch threads: ASME B1.1 (UNC/UNF), tap drills per standard tap-drill tables (Machinery's Handbook); clearance close/free fit per Machinery's Handbook.
- Drill gauges: standard wire-gauge number (#1–#80), letter (A–Z) and fractional drill tables.
- SHCS counterbore: ISO 4762 / DIN 974 typical, taken from the existing fastener sheet (`SW(...cb)` values, which are head dk + clearance for a tool); depth = head height k = d. `null` outside M2–M20 where the sheet has no value.
- FHCS countersink dia: ISO 10642 dk. Sheet uses 2.24 d for every size; ISO 10642 gives M14 30.8, M16 33.6, M20 40.32 (M3–M12 equal 2.24 d). Chart uses the ISO values; M18 and sizes below M3 are `null` (not in ISO 10642).

## Cross-check vs fastener sheet (`fastener-sheet.html`, `toolSpecs.ts` "fastener-sheet-metric")

The check script parses both and asserts they agree with each other and with the chart.

- All coarse taps M2–M20 and clearances agree exactly.
- Fine taps agree wherever the chart has the same pitch (M8×1, M10×1.25, M12×1.5, M14–M20×1.5, …).
- **Discrepancy: M6×0.75** — sheet 5.25 mm (= D − P, not a stocked drill); chart 5.2 (stocked drill; the 75 % figure D − 0.9743 P = 5.27). Chart value kept; sheet left untouched per task guardrails.
- Sheet fine pitches for M2–M5 (0.25, 0.35, 0.35, 0.5, 0.5) are not in the chart (the requested fine list starts at M6).
- Sheet flags FHCS csink dk as ESTIMATE for M5+; see ISO 10642 note above (M14/M16/M20 differ).
- Note: the sheet's thread/fine tap column is "D − P" style for some entries; the chart consistently uses the 75 % formula.

## Open items for the pages task

- M7 and M22/M24 have clearances and taps but no counterbore data (null) — render as "—".
- Hard-material inch drills are computed (nearest gauge drill ≥ the 75 % drill to the 65 % size); worth a quick eyeball before printing.
