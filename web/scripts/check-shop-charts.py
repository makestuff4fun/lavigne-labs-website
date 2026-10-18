#!/usr/bin/env python3
"""Verify content/shopCharts.json (printable shop drill charts data).

Runs known-value asserts, recomputation checks and a cross-check against the
fastener sheet (toolSpecs.ts + fastener-sheet.html). Exit 1 on any failure.
"""
import json, re, sys
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
errors = []


def check(cond, msg):
    if not cond:
        errors.append(msg)


d = json.load(open(ROOT / "content/shopCharts.json"))
check(set(d) == {"metricTap", "inchTap", "decimals"}, f"top-level keys wrong: {sorted(d)}")
M, I, D = d["metricTap"], d["inchTap"], d["decimals"]

# ---- metric
keys = set()
for r in M:
    k = (r["size"], r["pitch"])
    check(k not in keys, f"duplicate metric row {k}")
    keys.add(k)
    t = f"{r['size']}x{r['pitch']}"
    check(abs(r["tap"] - (r["d"] - 0.9743 * r["pitch"])) <= 0.12, f"{t}: tap {r['tap']} not within 0.12 of D-0.9743P")
    check(r["tapHard"] >= r["tap"], f"{t}: tapHard < tap")
    check(abs(r["tapHard"] - (r["d"] - 0.8446 * r["pitch"])) <= 0.12, f"{t}: tapHard {r['tapHard']} not near D-0.8446P")
    check(r["clearClose"] <= r["clearNormal"] <= r["clearLoose"], f"{t}: clearance not ordered")
    check(r["clearClose"] > r["d"], f"{t}: clearance below nominal")
    check(r["series"] in ("coarse", "fine"), f"{t}: bad series")
    if r["shcsCbore"] is not None:
        check(r["shcsCbore"] > r["clearLoose"] * 0.5 and r["shcsCboreDepth"], f"{t}: bad cbore")
check(len(M) >= 40, f"only {len(M)} metric rows")
mm_ = {k: r for k, r in ((k, r) for k, r in zip(keys, M))}
mt = {(r["size"], r["pitch"]): r for r in M}
for k, v in {("M3", 0.5): 2.5, ("M4", 0.7): 3.3, ("M5", 0.8): 4.2, ("M6", 1): 5.0, ("M8", 1.25): 6.8,
             ("M10", 1.5): 8.5, ("M12", 1.75): 10.2, ("M16", 2): 14.0, ("M20", 2.5): 17.5}.items():
    check(abs(mt[k]["tap"] - v) < 1e-9, f"{k} tap {mt[k]['tap']} != {v}")
for s, c in {"M6": (6.4, 6.6, 7.0), "M8": (8.4, 9.0, 10.0), "M10": (10.5, 11.0, 12.0), "M12": (13.0, 13.5, 14.5)}.items():
    r = [x for x in M if x["size"] == s][0]
    check((r["clearClose"], r["clearNormal"], r["clearLoose"]) == c, f"{s} ISO 273 clearance wrong")
for s in "M1 M1.2 M1.4 M1.6 M1.8 M2 M2.2 M2.5 M3 M3.5 M4 M5 M6 M7 M8 M10 M12 M14 M16 M18 M20 M22 M24".split():
    check(any(x["size"] == s and x["series"] == "coarse" for x in M), f"missing coarse {s}")
for s, p in [("M6", .75), ("M8", 1), ("M10", 1), ("M10", 1.25), ("M12", 1.25), ("M12", 1.5), ("M14", 1.5), ("M16", 1.5),
             ("M18", 1.5), ("M20", 1.5), ("M20", 2), ("M22", 1.5), ("M24", 1.5), ("M24", 2)]:
    check((s, p) in mt, f"missing fine {s}x{p}")

# ---- inch
ids = {r["size"]: r for r in I}
check(len(ids) == len(I), "duplicate inch size")
for r in I:
    check(abs(r["tapDec"] - (r["major"] - 0.9743 / r["tpi"])) <= 0.006, f"{r['size']}: tapDec {r['tapDec']} off formula")
    check(r["tapHardDec"] >= r["tapDec"], f"{r['size']}: tapHard < tap")
    check(r["clearCloseDec"] <= r["clearFreeDec"], f"{r['size']}: clearance order")
    check(r["clearCloseDec"] > r["major"], f"{r['size']}: clearance below major")
    check(r["series"] in ("UNC", "UNF"), f"{r['size']}: series")
    check(r["size"].split("-")[1] == str(r["tpi"]), f"{r['size']}: tpi mismatch")
check(ids["1/4-20"]["tap"] == "#7" and ids["1/4-20"]["tapDec"] == 0.201, "1/4-20 tap")
check(ids["10-32"]["tap"] == "#21" and ids["10-32"]["tapDec"] == 0.159, "10-32 tap")
check(len(I) >= 25, "too few inch rows")

# ---- decimals
num, let, fra = D["number"], D["letter"], D["fractions"]
check(len(num) == 80 and [x["n"] for x in num] == list(range(80, 0, -1)), "number drills must be #80..#1")
check(all(a["in"] < b["in"] for a, b in zip(num, num[1:])), "number drills not strictly increasing in size 80->1")
check(len(let) == 26 and [x["l"] for x in let] == list("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), "letters A..Z")
check(all(a["in"] < b["in"] for a, b in zip(let, let[1:])), "letters not strictly increasing")
check(len(fra) == 64, "need 64 fractions")
for n, x in enumerate(fra, 1):
    f = Fraction(n, 64)
    want = "1" if n == 64 else f"{f.numerator}/{f.denominator}"
    check(x["frac"] == want and x["in"] == n / 64, f"fraction {n}/64 wrong: {x}")
check({x["n"]: x["in"] for x in num}[7] == 0.201 and {x["n"]: x["in"] for x in num}[21] == 0.159, "#7/#21")
check({x["n"]: x["in"] for x in num}[1] == 0.228 and {x["n"]: x["in"] for x in num}[80] == 0.0135, "#1/#80")
check({x["l"]: x["in"] for x in let}["F"] == 0.257 and {x["l"]: x["in"] for x in let}["Z"] == 0.413, "F/Z")
check(let[0]["in"] == 0.234, "A")
for k in ("fractions", "number", "letter"):
    for x in D[k]:
        check(abs(x["mm"] - x["in"] * 25.4) <= 0.001, f"{k} mm mismatch {x}")
# inch tap drill names resolve to the gauge tables
tbl = {f"#{x['n']}": x["in"] for x in num}
tbl.update({x["l"]: x["in"] for x in let})
tbl.update({x["frac"]: x["in"] for x in fra})
for r in I:
    for nk, dk in (("tap", "tapDec"), ("tapHard", "tapHardDec"), ("clearClose", "clearCloseDec"), ("clearFree", "clearFreeDec")):
        check(r[nk] in tbl and abs(tbl[r[nk]] - r[dk]) < 1e-4, f"{r['size']}: {nk} {r[nk]} != {r[dk]}")

# ---- cross-check with fastener sheet (M2-M20)
notes = []
html = (ROOT / "public/tools/fasteners/fastener-sheet.html").read_text()
sheet = {}
for m in re.finditer(r"^(M[\d_]+):\{d:([\d.]+),(?:label:'[^']*',)?threads:\{coarse:T\(([\d.]+),([\d.]+),[\d.]+(?:,\d)?\),fine:T\(([\d.]+),([\d.]+),[\d.]+(?:,\d)?\)\},\s*clr:\{close:([\d.]+),normal:([\d.]+),loose:([\d.]+)\}",
                     html, re.M):
    n = m.group(1).replace("_", ".")
    sheet[n] = dict(cp=float(m[3]), ct=float(m[4]), fp=float(m[5]), ft=float(m[6]), clr=tuple(float(m[i]) for i in (7, 8, 9)))
check(len(sheet) >= 10, f"parsed only {len(sheet)} sizes from fastener-sheet.html")
# KNOWN: sheet value -> chart value, each checked against D-0.9743P / stocked drills (docs/shop-charts.md)
KNOWN = {("M6", .75): 5.25}
for s, v in sheet.items():
    for p, t in ((v["cp"], v["ct"]), (v["fp"], v["ft"])):
        r = mt.get((s, p))
        if r is None:
            notes.append(f"sheet {s}x{p} not in chart")
            continue
        if abs(r["tap"] - t) > 1e-9:
            check((s, p) in KNOWN and KNOWN[(s, p)] == t and abs(r["tap"] - t) <= 0.06, f"{s}x{p}: chart tap {r['tap']} vs sheet {t} (undocumented)")
            notes.append(f"{s}x{p}: chart {r['tap']} sheet {t}")
    c = [x for x in M if x["size"] == s and x["series"] == "coarse"][0]
    check((c["clearClose"], c["clearNormal"], c["clearLoose"]) == v["clr"], f"{s}: clearance differs from sheet {v['clr']}")

ts = (ROOT / "content/toolSpecs.ts").read_text()
i = ts.index('"fastener-sheet-metric"')
j = ts.index("{", i)
depth, k = 0, j
while True:
    depth += (ts[k] == "{") - (ts[k] == "}")
    k += 1
    if depth == 0:
        break
spec = json.loads(ts[j:k])
for z in spec["data"]["sizes"]:
    s = z["key"].replace("_", ".")
    h = sheet.get(s)
    check(h is not None and h["ct"] == z["threads"]["coarse"]["tap"] and h["ft"] == z["threads"]["fine"]["tap"]
          and h["clr"] == (z["clr"]["close"], z["clr"]["normal"], z["clr"]["loose"]), f"{s}: toolSpecs.ts differs from fastener-sheet.html")

if errors:
    print(f"check-shop-charts: {len(errors)} FAILURE(S)")
    for e in errors:
        print("  -", e)
    sys.exit(1)
print(f"check-shop-charts: OK ({len(M)} metric, {len(I)} inch, {len(num)} number, {len(let)} letter, {len(fra)} fractions; sheet diffs: {notes or 'none'})")
