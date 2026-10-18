#!/usr/bin/env node
/**
 * Generates content/toolSpecs.ts from the static calculator pages in public/tools.
 * Constants, tables and option lists are read out of each page's own JavaScript, and
 * worked examples are computed by running that page's formulas. Re-run after changing
 * a calculator:   node scripts/gen-tool-specs.cjs
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, "public/tools", p), "utf8");
const sig = (x, n = 6) => (typeof x === "number" ? Number(x.toPrecision(n)) : x);
const r6 = (o) => JSON.parse(JSON.stringify(o, (k, v) => (typeof v === "number" ? sig(v) : v)));

/* ───────────── fasteners: calculators ───────────── */
function loadFastenerCalc(file, names) {
  const html = read(`fasteners/${file}`);
  const s = html.indexOf("<script>") + 8;
  const body = html.slice(s, html.indexOf("function render()", s)).replace(/^\s*\(function\(\)\{/, "");
  return new Function("document", body + `\nreturn {${names.join(",")}, G: typeof G==='undefined'?null:G};`)({});
}
const HF_NAMES = ["SIZES", "CLASSES", "MATS", "INSERT", "DIRS", "DUTY", "MU", "PRELOAD", "safeLoad", "governer", "stripForce", "proof", "breakLoad"];
const TQ_NAMES = ["SIZES", "CLASSES", "MATS", "INSERT", "K_DRY", "K_LUB", "PRELOAD", "torque", "stripTorque", "stripForce"];

function holdingSpec(unit, file, load0) {
  const m = loadFastenerCalc(file, HF_NAMES);
  const metric = unit === "kg";
  const run = (inp) => {
    const C = m.CLASSES.find((c) => c.k === inp.grade), M = m.MATS.find((x) => x.k === inp.material);
    const sf = inp.duty, dir = inp.direction;
    let pick = -1;
    for (let i = 0; i < m.SIZES.length; i++) if (m.safeLoad(m.SIZES[i], C, M, dir, sf) >= inp.load) { pick = i; break; }
    const S = pick >= 0 ? m.SIZES[pick] : m.SIZES[m.SIZES.length - 1];
    const g = m.governer(S, C, M);
    return {
      smallestSize: pick >= 0 ? S.k : null,
      safeLoadAtSize: m.safeLoad(S, C, M, dir, sf),
      governing: g.t,
      safeLoadBySize: Object.fromEntries(m.SIZES.map((s) => [s.k, m.safeLoad(s, C, M, dir, sf)])),
    };
  };
  const ex = (inp) => ({ inputs: inp, outputs: r6(run(inp)) });
  const first = m.CLASSES[0].k, second = m.CLASSES[1].k;
  return {
    inputs: [
      { name: "load", label: "Load to hold", unit, type: "number", min: 0, default: load0, notes: "Page input has step 1 and no maximum; negative or blank is treated as 0." },
      { name: "direction", label: "Direction of pull", unit: "", type: "enum", options: m.DIRS.map((d) => ({ value: d.k, label: d.name })), default: "pull" },
      { name: "duty", label: "Safety factor (how careful)", unit: "×", type: "enum", options: m.DUTY.map((d) => ({ value: d.k, label: `${d.name} ×${d.k} — ${d.sub}` })), default: 4 },
      { name: "material", label: "Screwing into", unit: "", type: "enum", options: m.MATS.map((x) => ({ value: x.k, label: x.name })), default: "steel" },
      { name: "grade", label: "Screw grade", unit: "", type: "enum", options: m.CLASSES.map((c) => ({ value: c.k, label: c.name })), default: first },
    ],
    outputs: [
      { name: "smallestSize", label: "Smallest listed size whose safe load meets the requested load (null if none does)", unit: "" },
      { name: "safeLoadAtSize", label: "Safe working load of that size (of the largest listed size if none qualifies)", unit },
      { name: "governing", label: "What gives out first: 'the hole', 'the screw' or 'no data'", unit: "" },
      { name: "safeLoadBySize", label: "Safe working load of every listed size, keyed by size (0 = no data)", unit },
    ],
    formula: [
      `proof = Sp * As            (proof load of the screw; Sp ${metric ? "MPa" : "psi"}, As ${metric ? "mm^2, result in N" : "in^2, result in lbf"})`,
      "strip = pi * d * (le*d) * tau * 0.5      (thread strip in the tapped material; le*d = engagement length)",
      "  nut on the back: strip = 1.05 * proof;  heat-set insert: strip = table value in `data.insertPullout` (0 = no data)",
      "pullLimit = min(proof, strip)             (0 if strip is 0)",
      "slipLimit = PRELOAD * Sp * As * MU        (sideways: friction of the clamped joint), PRELOAD = 0.70, MU = 0.15",
      "straight pull: safe = pullLimit / duty;  sideways: safe = min(slipLimit, pullLimit) / duty",
      metric ? "kg = N / 9.80665" : "(inch page: forces are already in pounds-force, reported as lb)",
      "smallestSize = first size, in ascending order, with safe >= load. governing = 'the hole' if strip < proof, 'the screw' if not, 'no data' if strip = 0.",
    ].join("\n"),
    assumptions: [
      "Rough sizing only; the page says not to use it for anything that could hurt someone if it let go (vehicle parts, climbing gear, ceiling mounts over people, pressure equipment).",
      `Preload is ${m.PRELOAD * 100}% of proof; sideways load is carried by friction at mu = ${m.MU} on one face only.`,
      "Thread strip is a simplified shear-area estimate; heat-set insert pull-out is vendor dependent, order of magnitude only.",
      "Safety factor is applied once, to the load; with more than two screws the load may not share evenly.",
    ],
    data: r6({
      sizes: m.SIZES.map((s) => ({ size: s.k, majorDiameter: s.d, stressArea: s.As })),
      grades: m.CLASSES.map((c) => ({ id: c.k, name: c.name, proofStress: c.Sp, ultimateStress: c.Rm })),
      materials: m.MATS.map((x) => ({ id: x.k, name: x.name, shearStrength: x.tau ?? null, engagementOverD: x.le, kind: x.insert ? "insert" : x.nut ? "nut" : "tapped" })),
      insertPullout: m.INSERT,
      units: metric
        ? { majorDiameter: "mm", stressArea: "mm^2", stress: "MPa", shearStrength: "MPa", insertPullout: "N", load: "kg" }
        : { majorDiameter: "in", stressArea: "in^2", stress: "psi", shearStrength: "psi", insertPullout: "lbf", load: "lb" },
    }),
    examples: [
      ex({ load: load0, direction: "pull", duty: 4, material: "steel", grade: first }),
      ex({ load: metric ? 10 : 20, direction: "shear", duty: 8, material: "alu", grade: second }),
    ],
  };
}

function torqueSpec(metric, file) {
  const m = loadFastenerCalc(file, TQ_NAMES);
  const G = m.G, tu = metric ? "N·m" : "lb-in";
  const run = (inp) => {
    const S = m.SIZES.find((s) => s.k === inp.size), C = m.CLASSES.find((c) => c.k === inp.grade), M = m.MATS.find((x) => x.k === inp.material);
    const tDry = m.torque(S, C, m.K_DRY), tLub = m.torque(S, C, m.K_LUB);
    const tStrip = m.stripTorque(S, M), tSafe = tStrip * 0.6;
    const governed = tStrip > 0 && tSafe < tDry, use = governed ? tSafe : tDry;
    const hand = metric ? use / (S.arm / 1000) / G : use / S.arm;
    return {
      screwOnlyDryTorque: tDry, screwOnlyLubricatedTorque: tLub,
      threadStripTorque: tStrip > 0 ? tStrip : null, threadSafeMax: tStrip > 0 ? tSafe : null,
      holeGoverns: governed, tightenToDry: use, tightenToLubricated: governed ? tSafe * 0.75 : tLub,
      handForceOnKey: hand,
    };
  };
  const ex = (inp) => ({ inputs: inp, outputs: r6(run(inp)) });
  const d0 = metric ? { size: "M3", grade: "8.8", material: "steel" } : { size: "1/4", grade: "Gr 5", material: "steel" };
  const d1 = metric ? { size: "M6", grade: "10.9", material: "print" } : { size: "3/8", grade: "Gr 8", material: "alu" };
  return {
    inputs: [
      { name: "size", label: "Size", unit: "", type: "enum", options: m.SIZES.map((s) => ({ value: s.k, label: s.k })), default: d0.size },
      { name: "grade", label: metric ? "Property class" : "Grade", unit: "", type: "enum", options: m.CLASSES.map((c) => ({ value: c.k, label: c.name })), default: d0.grade },
      { name: "material", label: "Tapped into", unit: "", type: "enum", options: m.MATS.map((x) => ({ value: x.k, label: x.name })), default: "steel" },
    ],
    outputs: [
      { name: "tightenToDry", label: "Recommended tightening torque, dry threads (screw limit, reduced to the hole's safe max when the hole governs)", unit: tu },
      { name: "tightenToLubricated", label: "Recommended torque, oiled or anti-seized", unit: tu },
      { name: "screwOnlyDryTorque", label: "Torque the screw alone supports, dry", unit: tu },
      { name: "screwOnlyLubricatedTorque", label: "Torque the screw alone supports, lubricated", unit: tu },
      { name: "threadStripTorque", label: "Torque at which the tapped thread strips (null = no data for that size)", unit: tu },
      { name: "threadSafeMax", label: "Safe max for the hole = 0.6 x strip torque (null = no data)", unit: tu },
      { name: "holeGoverns", label: "True when the hole, not the screw, limits the torque", unit: "" },
      { name: "handForceOnKey", label: "Pull on the long arm of the matching hex key to reach tightenToDry", unit: metric ? "kg" : "lb" },
    ],
    formula: [
      "T = K * d * F",
      `F (clamp) = PRELOAD * Sp * As           PRELOAD = ${m.PRELOAD}; Sp proof stress ${metric ? "MPa" : "psi"}, As stress area ${metric ? "mm^2" : "in^2"}`,
      `K = ${m.K_DRY} dry, ${m.K_LUB} lubricated`,
      metric ? "T in N·m = K * d(mm) * F(N) / 1000" : "T in lb-in = K * d(in) * F(lbf)   (the page shows lb-ft once the value reaches 100 lb-in)",
      "stripForce = pi * d * (le*d) * tau * 0.5     (heat-set insert: table value from `data.insertPullout`)",
      `stripTorque = ${m.K_DRY} * d * stripForce${metric ? " / 1000" : ""};  safe max = 0.6 * stripTorque`,
      "if 0 < safe max < dry torque the hole governs: tightenToDry = safe max, tightenToLubricated = 0.75 * safe max; otherwise dry = screw dry torque, lubricated = screw lubricated torque",
      metric ? "handForce(kg) = tightenToDry / (arm_mm/1000) / 9.80665; arm and hex size per size in `data.sizes`" : "handForce(lb) = tightenToDry(lb-in) / arm_in; arm and hex size per size in `data.sizes`",
    ].join("\n"),
    assumptions: [
      "Starting points for general assembly, not a specification; any manufacturer figure beats this page.",
      "Torque is a proxy: only about 10-15% becomes clamp force, so expect roughly ±30% scatter in clamp.",
      "Thread strip is a simplified shear-area estimate; heat-set insert pull-out is vendor dependent.",
      `The page says a hex-key figure above about ${metric ? "25 kg" : "55 lb"} means use a socket wrench instead.`,
      "Nyloc nuts need extra running torque on top; lubricate stainless on stainless.",
    ],
    data: r6({
      sizes: m.SIZES.map((s) => ({ size: s.k, majorDiameter: s.d, stressArea: s.As, hexKeySize: s.hex, hexKeyLongArm: s.arm })),
      grades: m.CLASSES.map((c) => ({ id: c.k, name: c.name, proofStress: c.Sp, ultimateStress: c.Rm })),
      materials: m.MATS.map((x) => ({ id: x.k, name: x.name, shearStrength: x.tau ?? null, engagementOverD: x.le, kind: x.insert ? "insert" : "tapped" })),
      insertPullout: m.INSERT,
      units: metric
        ? { majorDiameter: "mm", stressArea: "mm^2", stress: "MPa", hexKeySize: "mm", hexKeyLongArm: "mm", insertPullout: "N", torque: "N·m" }
        : { majorDiameter: "in", stressArea: "in^2", stress: "psi", hexKeySize: "in (fraction as text)", hexKeyLongArm: "in", insertPullout: "lbf", torque: "lb-in" },
    }),
    examples: [ex(d0), ex(d1)],
  };
}

/* ───────────── fasteners: reference sheets ───────────── */
function sheetSpec(file, metric) {
  const html = read(`fasteners/${file}`);
  const s = html.indexOf("<script>") + 8;
  const a = html.indexOf("/* ============ builders", s), b = html.indexOf("var EST=", s);
  const m = new Function(html.slice(a, b) + "\nreturn {DATA,SIZES,PARTS,LENGTHS,STD,FORM};")();
  const sizes = m.SIZES.map((k) => ({ key: k, ...m.DATA[k] }));
  const rules = metric
    ? {
        tapDrill: "tap drill = d - P (value per size in threads.<series>.tap)",
        tappedDepth: "tapped depth >= E + 2P; drill depth >= E + 4P (blind holes), E = engagement",
        minEngagement: "E = 1.0*d steel, 2.0*d aluminium, 2.5*d plastic",
        boltLengthThroughNut: "l >= t1 + t2 + w + m + 2P, rounded up to the next value in `lengths`; the drawing uses t1 = t2 = 1.5*d, so grip = 3*d (w = washer thickness, m = nut height, P = pitch)",
        torque: "torque string per size = class 8.8 / 10.9 / 12.9, N·m dry, calculated",
        clearance: "ISO 273 close / normal / loose",
      }
    : {
        tapDrill: "tap drill = d - 1.299*P*(% thread), 75% thread; value per size in threads.<series>.tap, drill name in tapTxt",
        tappedDepth: "tapped depth >= E + 2P; drill depth >= E + 4P (blind holes), E = engagement",
        minEngagement: "E = 1.0*d steel, 2.0*d aluminium, 2.5*d plastic",
        boltLengthThroughNut: "L >= t1 + t2 + w + m + 2P, rounded up to the next value in `lengths`; the drawing uses t1 = t2 = 1.5*d, so grip = 3*d",
        torque: "torque string per size = Gr 2 / 5 / 8 in the unit given by the size's `tUnit` (lb-in or lb-ft), dry, calculated",
        minThreadLength: "b ≈ 2d + 1/2 in",
      };
  return {
    data: {
      units: metric ? { length: "mm", torque: "N·m", stressArea: "mm^2" } : { length: "in", torque: "per-size tUnit (lb-in or lb-ft)", stressArea: "in^2" },
      fields: {
        d: "major diameter",
        threads: metric ? "coarse/fine: P pitch, tap drill, As stress area" : "unc/unf: tpi, P = 1/tpi, tap drill, tapTxt drill name, As stress area",
        clr: "clearance hole diameters close/normal/loose", chamfer: "edge chamfer diameter", printedClr: "printed clearance hole (text range)",
        washer: "plain washer id/od/t",
        screws: "per screw type: dk head diameter (hex bolt: across flats), k head height, s drive size (hex socket A/F; hex bolt: spanner A/F), t socket depth, cb counterbore diameter, cs countersink diameter, b min thread length",
        nuts: "af across flats, e across corners, m height, collar nylon-collar height",
        printed: "[label, value] rows for 3D-printed parts",
        est: "1 means the page marks that value ESTIMATE (not taken from a standard table)",
      },
      sizes, parts: m.PARTS, lengths: m.LENGTHS, standards: m.STD, rules,
    },
    notes: "Reference sheet, not a calculator: table data copied from the page's own DATA object. Fields marked est:1 are labelled ESTIMATE on the page.",
  };
}

/* ───────────── PCB ───────────── */
function loadPcb() {
  const lines = read("pcb/pcb-calculator.html").split("\n");
  const start = lines.findIndex((l) => l.startsWith("<script>")) + 1;
  const end = lines.findIndex((l, i) => i > start && l.startsWith("const STATE"));
  const code = lines.slice(start, end).join("\n") +
    "\nreturn {CALCS,fmt,eng,ipc2221Area,ipc2221Current,ipc2152Area,ipc2152Current,rhoAt,eNearest,zMicrostrip,zStripline,erEffMs,OZ_UM,RHO_CU,ALPHA_CU,MM2_MIL2,mm2mil,mil2mm,um2mil,E12,E24,E96};";
  return new Function("document", "window", code)({}, {});
}

function pcbSpecs() {
  const P = loadPcb();
  const { rhoAt, eNearest } = P;
  const baseInputs = (c) =>
    c.fields.map((f) => {
      const i = { name: f.k, label: f.label, unit: f.unit || "" };
      if (f.type === "num") { i.type = "number"; if (f.min !== undefined) i.min = f.min; if (f.step !== undefined) i.step = f.step; i.default = f.def; }
      else if (f.type === "seg" || f.type === "sel") { i.type = "enum"; i.options = f.opts.map((o) => ({ value: o.v, label: o.l.replace(/&amp;/g, "&") })); i.default = f.def; }
      else if (f.type === "checks") {
        if (f.k === "diff") { i.type = "boolean"; i.default = !!f.def.on; i.label = f.opts[0].l; }
        else { i.type = "set"; i.options = f.opts.map((o) => ({ value: o.v, label: o.l })); i.default = Object.keys(f.def).filter((k) => f.def[k]); }
      }
      if (f.show) i.activeWhen = String(f.show).replace(/^v=>/, "");
      if (f.hint) i.hint = f.hint;
      return i;
    });
  const defaults = (c) => Object.fromEntries(c.fields.map((f) => [f.k, f.def]));
  const toPage = (c, v) => { // example inputs -> the state object the page's compute() expects
    const s = { ...defaults(c), ...v };
    if (Array.isArray(s.std)) s.std = { s2221: s.std.includes("s2221"), s2152: s.std.includes("s2152") };
    if (typeof s.diff === "boolean") s.diff = { on: s.diff };
    return s;
  };
  const byId = Object.fromEntries(P.CALCS.map((c) => [c.id, c]));
  const NOTE_NOMAX = "Number inputs list only the minimum the page enforces (HTML min attribute); the page sets no maximum, so none is given.";
  const out = {};

  /* — trace — */
  const trace = (c, v) => {
    const t_um = v.oz * P.OZ_UM, t_mil = P.um2mil(t_um), dTv = v.dT / Math.max(v.cf, 0.01);
    const r = {}; let govW = null, govA = null;
    const s = v.std;
    if (v.mode === "width") {
      if (s.s2221) { const A = P.ipc2221Area(v.I, v.dT, v.layer), w = A / t_mil; r.areaIpc2221_mil2 = A; r.widthIpc2221_mm = P.mil2mm(w); govW = P.mil2mm(w); govA = A; }
      if (s.s2152) { const A = P.ipc2152Area(v.I, dTv), w = A / t_mil; r.areaIpc2152_mil2 = A; r.widthIpc2152_mm = P.mil2mm(w); if (govW === null || P.mil2mm(w) > govW) { govW = P.mil2mm(w); govA = A; } }
    } else {
      const A = P.mm2mil(v.w) * t_mil; r.crossSection_mil2 = A;
      if (s.s2221) r.currentIpc2221_A = P.ipc2221Current(A, v.dT, v.layer);
      if (s.s2152) r.currentIpc2152_A = P.ipc2152Current(A, dTv);
      govW = v.w; govA = A;
    }
    const Am = govW / 1000 * t_um / 1e6, Top = v.Tamb + v.dT, R = rhoAt(Top) * (v.len / 1000) / Am;
    const I = v.mode === "width" ? v.I : (s.s2221 ? P.ipc2221Current(govA, v.dT, v.layer) : P.ipc2152Current(govA, dTv));
    r.resistance_ohm = R; r.sheetResistance_mohm_sq = rhoAt(Top) / (t_um / 1e6) * 1000; r.voltageDrop_V = I * R; r.power_W = I * I * R;
    return r;
  };
  out.trace = {
    summary: "Trace width for a given current (or current for a given width) per IPC-2221B and IPC-2152, with resistance, drop and power of the resulting trace.",
    outputs: [
      ["widthIpc2221_mm", "Required width, IPC-2221B (mode=width)", "mm"], ["areaIpc2221_mil2", "Required cross-section, IPC-2221B (mode=width)", "mil^2"],
      ["widthIpc2152_mm", "Required width, IPC-2152 with thermal correction (mode=width)", "mm"], ["areaIpc2152_mil2", "Required cross-section, IPC-2152 (mode=width)", "mil^2"],
      ["crossSection_mil2", "Cross-section of the given trace (mode=current)", "mil^2"],
      ["currentIpc2221_A", "Current capacity, IPC-2221B (mode=current)", "A"], ["currentIpc2152_A", "Current capacity, IPC-2152 (mode=current)", "A"],
      ["resistance_ohm", "DC resistance over len at Tamb+dT (uses the wider of the two widths in width mode)", "Ω"], ["sheetResistance_mohm_sq", "Sheet resistance at Tamb+dT", "mΩ/□"],
      ["voltageDrop_V", "Voltage drop at the design current", "V"], ["power_W", "Power dissipated at the design current", "W"],
    ],
    formula: [
      "t[um] = oz * 34.8;  t[mil] = t[um] / 1000 / 0.0254;  A[mil^2] = w[mil] * t[mil]",
      "IPC-2221B:  I = k * dT^0.44 * A^0.725   (A in mil^2; k = 0.048 external, 0.024 internal)",
      "            A = (I / (k * dT^0.44))^(1/0.725);   w = A / t",
      "IPC-2152 baseline (Rozenblat/Olson fit of Fig. 5-2, still air, no plane), dTv = dT / max(cf, 0.01):",
      "            k1 = 117.555 * dTv^-0.913 + 1.15;  k2 = 0.84 * dTv^-0.108 + 1.159",
      "            A = k1 * I^k2;   I = (A / k1)^(1/k2);   w = A / t",
      "Electrical, with Top = Tamb + dT: rho(T) = 1.72e-8 * (1 + 0.00393 * (T - 20)) ohm·m",
      "            R = rho(Top) * len / (w * t);  sheet = rho(Top)/t;  drop = I*R;  P = I^2*R",
    ].join("\n"),
    assumptions: [
      "IPC-2221 chart range: up to 35 A, 10-100 °C rise, up to 3 oz copper, widths up to 400 mil; the page warns outside these.",
      "IPC-2152 fit: tests to 30 A, 2-100 °C rise; the baseline is conservative (still air, no plane). cf < 1 models a plane under the trace (page suggests about 0.5-0.7).",
      "IPC-2152 gives one set of results for any layer; IPC-2221 internal uses half the external constant.",
      "One isolated trace; neighbours closer than 25 mm and hot parts are not modelled. No safety margin is included: add 20-50%.",
      "Continuous RMS current; dT is a rise above local board temperature.",
    ],
    run: trace,
    examples: [{ mode: "width", I: 3, dT: 20, oz: 1, layer: "external", std: ["s2221", "s2152"], cf: 1, len: 100, Tamb: 25 }, { mode: "current", w: 1, dT: 20, oz: 1, layer: "internal", std: ["s2221", "s2152"], cf: 1, len: 100, Tamb: 25 }],
  };

  /* — via — */
  const via = (c, v) => {
    const di = v.d, dout = v.d + 2 * v.pl / 1000, A_mm2 = Math.PI / 4 * (dout * dout - di * di), A_mil = A_mm2 * P.MM2_MIL2;
    const R1 = rhoAt(25 + v.dT) * (v.th / 1000) / (A_mm2 * 1e-6), dr = 1 - v.derate / 100, r = {};
    r.outerDiameter_mm = dout; r.copperArea_mm2 = A_mm2; r.copperArea_mil2 = A_mil;
    let cap = null;
    if (v.std.s2221) { const i1 = P.ipc2221Current(A_mil, v.dT, "external"); r.perViaIpc2221_A = i1; r.deratedIpc2221_A = i1 * v.n * dr; cap = i1 * v.n * dr; }
    if (v.std.s2152) { const i2 = P.ipc2152Current(A_mil, v.dT); r.perViaIpc2152_A = i2; r.deratedIpc2152_A = i2 * v.n * dr; cap = cap === null ? i2 * v.n * dr : Math.min(cap, i2 * v.n * dr); }
    r.viaResistance_ohm = R1; r.parallelResistance_ohm = R1 / v.n; r.drop_V = v.I * R1 / v.n; r.power_W = v.I * v.I * R1 / v.n; r.perViaCurrent_A = v.I / v.n;
    if (cap !== null) r.withinDeratedCapacity = v.I <= cap;
    return r;
  };
  out.via = {
    summary: "Current capacity, resistance and loss of a plated through-hole via (barrel annulus) using the IPC curves, with parallel vias and derating.",
    outputs: [["outerDiameter_mm", "Outer barrel diameter", "mm"], ["copperArea_mm2", "Copper annulus cross-section", "mm^2"], ["copperArea_mil2", "Copper annulus cross-section", "mil^2"],
      ["perViaIpc2221_A", "Current per via, IPC-2221B external constant, underated", "A"], ["deratedIpc2221_A", "n vias, derated, IPC-2221B", "A"],
      ["perViaIpc2152_A", "Current per via, IPC-2152 baseline, underated", "A"], ["deratedIpc2152_A", "n vias, derated, IPC-2152", "A"],
      ["viaResistance_ohm", "Resistance of one via at 25 °C + dT", "Ω"], ["parallelResistance_ohm", "Resistance of n vias in parallel", "Ω"],
      ["drop_V", "Voltage drop at I", "V"], ["power_W", "Power in the vias at I", "W"], ["perViaCurrent_A", "I / n", "A"],
      ["withinDeratedCapacity", "I is within the smaller derated capacity of the standards shown", ""]],
    formula: [
      "dout = d + 2 * plating[um]/1000                       (mm)",
      "A = pi/4 * (dout^2 - d^2)  [mm^2];   A_mil2 = A * 1550.0031",
      "per via: IPC-2221B  I = 0.048 * dT^0.44 * A_mil2^0.725   (external constant)",
      "         IPC-2152   I = (A_mil2 / k1)^(1/k2), k1 = 117.555*dT^-0.913 + 1.15, k2 = 0.84*dT^-0.108 + 1.159",
      "derated capacity = per_via * n * (1 - derate/100)",
      "R1 = rho(25 + dT) * (board_thickness/1000) / (A * 1e-6),  rho(T) = 1.72e-8*(1 + 0.00393*(T-20));  R = R1/n;  drop = I*R;  P = I^2*R",
    ].join("\n"),
    assumptions: ["Plating thickness dominates: IPC-6012 minimum average is 20 µm (Class 2), 25 µm (Class 3); ask the fab.", "Tightly packed vias heat each other, so n vias carry less than n times one via (hence the derating input).", "Vias fail by barrel cracking under thermal cycling rather than melting."],
    run: via,
    examples: [{ d: 0.3, pl: 25, th: 1.6, dT: 20, n: 1, I: 2, derate: 50, std: ["s2221", "s2152"] }, { d: 0.4, pl: 20, th: 1.6, dT: 10, n: 4, I: 3, derate: 30, std: ["s2221", "s2152"] }],
  };

  /* — tracer — */
  out.tracer = {
    summary: "DC resistance, voltage drop and power of a copper trace of given width, copper weight and length at a given temperature.",
    outputs: [["crossSection_mm2", "Cross-section", "mm^2"], ["squares", "Squares of copper = length / width", ""], ["resistance_ohm", "Resistance at T", "Ω"], ["resistance20C_ohm", "Resistance at 20 °C", "Ω"],
      ["sheetResistance_mohm_sq", "Sheet resistance at T", "mΩ/□"], ["resistancePer100mm_ohm", "Resistance per 100 mm at this width", "Ω"], ["voltageDrop_V", "Voltage drop at I", "V"], ["power_W", "Power dissipated", "W"], ["roundTripDrop_V", "Drop out and back (2x)", "V"], ["withinBudget", "Drop is within the budget (null if budget is 0)", ""]],
    formula: ["t = oz * 34.8 um;  A = (w/1000) * (t/1e6)  [m^2]", "rho(T) = 1.72e-8 * (1 + 0.00393*(T - 20))  ohm·m", "R(T) = rho(T) * (len/1000) / A;  R20 = 1.72e-8 * (len/1000)/A", "sheet = rho(T)/(t/1e6) [ohm/sq] (page shows mΩ/□);  squares = len / w", "drop = I*R(T);  P = I^2*R(T);  round trip = 2*drop", "budget check: drop*1000 <= budget[mV]; when over, the page suggests a width of w * drop_mV / budget"].join("\n"),
    assumptions: ["DC resistance only. Above ~10 MHz skin effect raises effective resistance (skin depth ≈ 6.5 µm in copper at 100 MHz).", "Copper resistivity 1.72e-8 ohm·m at 20 °C, temperature coefficient 0.00393 /°C."],
    run: (c, v) => {
      const t_um = v.oz * P.OZ_UM, A = (v.w / 1000) * (t_um / 1e6), RT = rhoAt(v.T) * (v.len / 1000) / A, R20 = P.RHO_CU * (v.len / 1000) / A, drop = v.I * RT;
      return { crossSection_mm2: A * 1e6, squares: v.len / v.w, resistance_ohm: RT, resistance20C_ohm: R20, sheetResistance_mohm_sq: rhoAt(v.T) / (t_um / 1e6) * 1000, resistancePer100mm_ohm: RT * 100 / v.len, voltageDrop_V: drop, power_W: v.I * v.I * RT, roundTripDrop_V: drop * 2, withinBudget: v.budget > 0 ? drop * 1000 <= v.budget : null };
    },
    examples: [{ w: 0.5, oz: 1, len: 100, I: 1, T: 25, budget: 100 }, { w: 0.25, oz: 0.5, len: 250, I: 2, T: 60, budget: 100 }],
  };

  /* — divider — */
  out.divider = {
    summary: "Resistor divider: output voltage from R1/R2, or the resistor needed for a target output, with loading, nearest standard values and worst-case tolerance.",
    outputs: [["vout_V", "Unloaded output voltage", "V"], ["r1_ohm", "R1 (given, or required when mode=r1)", "Ω"], ["r2_ohm", "R2 (given, or required when mode=r2)", "Ω"], ["ratio", "R2/(R1+R2)", ""], ["quiescentCurrent_A", "Vin/(R1+R2)", "A"], ["totalPower_W", "Vin * I", "W"], ["outputImpedance_ohm", "R1 ∥ R2", "Ω"],
      ["loadedVout_V", "Output with RL across R2 (only if RL>0)", "V"], ["loadingError_pct", "(loaded - unloaded)/unloaded (only if RL>0)", "%"], ["seriesR1_ohm", "R1 snapped to nearest series value (ser != none)", "Ω"], ["seriesR2_ohm", "R2 snapped to nearest series value", "Ω"], ["seriesVout_V", "Output with the snapped pair", "V"], ["seriesError_pct", "Error of snapped output vs ideal", "%"],
      ["worstHigh_V", "Highest output with ±tol parts (tol>0)", "V"], ["worstLow_V", "Lowest output with ±tol parts", "V"], ["worstSpread_pct", "±spread = (hi-lo)/2/Vout", "%"]],
    formula: ["mode vout: Vout = Vin * R2/(R1+R2)", "mode r2:   R2 = R1 * Vt/(Vin - Vt);  Vout = Vt", "mode r1:   R1 = R2 * (Vin - Vt)/Vt;  Vout = Vt", "I = Vin/(R1+R2);  Zout = R1*R2/(R1+R2);  P = Vin*I", "loaded: R2e = R2*RL/(R2+RL);  VoL = Vin*R2e/(R1+R2e);  error = 100*(VoL - Vout)/Vout", "series: nearest value on E12/E24/E96 by relative error (best of three adjacent decades); Vs = Vin*s2/(s1+s2)", "worst case, k = tol/100: hi = Vin*R2(1+k)/(R1(1-k)+R2(1+k)); lo = Vin*R2(1-k)/(R1(1+k)+R2(1-k))"].join("\n"),
    assumptions: ["Target output must be below the input (a divider only steps down).", "Page warns when output impedance > 100 kΩ, quiescent current > 10 mA, or loading error > 1 %. RL=0 means no load.", "Tolerance spread does not include tolerance of Vin."],
    run: (c, v) => {
      let R1 = v.R1, R2 = v.R2, Vo; if (v.mode === "vout") Vo = v.Vin * R2 / (R1 + R2); else if (v.mode === "r2") { R2 = R1 * v.Vt / (v.Vin - v.Vt); Vo = v.Vt; } else { R1 = R2 * (v.Vin - v.Vt) / v.Vt; Vo = v.Vt; }
      const I = v.Vin / (R1 + R2), r = { vout_V: Vo, r1_ohm: R1, r2_ohm: R2, ratio: R2 / (R1 + R2), quiescentCurrent_A: I, totalPower_W: v.Vin * I, outputImpedance_ohm: R1 * R2 / (R1 + R2) };
      if (v.RL > 0) { const R2e = R2 * v.RL / (R2 + v.RL), VoL = v.Vin * R2e / (R1 + R2e); r.loadedVout_V = VoL; r.loadingError_pct = 100 * (VoL - Vo) / Vo; }
      if (v.ser !== "none") { const s1 = eNearest(v.ser, R1), s2 = eNearest(v.ser, R2), Vs = v.Vin * s2 / (s1 + s2); r.seriesR1_ohm = s1; r.seriesR2_ohm = s2; r.seriesVout_V = Vs; r.seriesError_pct = 100 * (Vs - Vo) / Vo; }
      if (v.tol > 0) { const k = v.tol / 100, hi = v.Vin * (R2 * (1 + k)) / (R1 * (1 - k) + R2 * (1 + k)), lo = v.Vin * (R2 * (1 - k)) / (R1 * (1 + k) + R2 * (1 - k)); r.worstHigh_V = hi; r.worstLow_V = lo; r.worstSpread_pct = 100 * (hi - lo) / 2 / Vo; }
      return r;
    },
    examples: [{ mode: "vout", Vin: 12, R1: 10000, R2: 3300, RL: 0, ser: "E24", tol: 1 }, { mode: "r2", Vin: 12, R1: 10000, Vt: 3.3, RL: 100000, ser: "E96", tol: 1 }],
  };

  /* — ohm — */
  out.ohm = {
    summary: "Ohm's law and power: give any two of V, I, R, P and get all four, plus load against a component power rating.",
    outputs: [["voltage_V", "Voltage", "V"], ["current_A", "Current", "A"], ["resistance_ohm", "Resistance", "Ω"], ["power_W", "Power", "W"], ["usedPct", "100 * P / rating", "%"], ["headroom", "rating / P", "×"]],
    formula: ["known VI: R = V/I, P = V*I", "known VR: I = V/R, P = V*I", "known IR: V = I*R, P = V*I", "known PV: I = P/V, R = V/I", "known PI: V = P/I, R = V/I", "known PR: I = sqrt(P/R), V = I*R", "usedPct = 100*P/rating; headroom = rating/P"].join("\n"),
    assumptions: ["Page flags P > rating as over-rated and P > 50 % of rating as needing derating; ratings assume a specified footprint in still air at 70 °C.", "Only the two inputs named by `known` are used (see activeWhen); the others are ignored."],
    run: (c, v) => { let V, I, R, P_; switch (v.known) { case "VI": V = v.V; I = v.I; R = V / I; P_ = V * I; break; case "VR": V = v.V; R = v.R; I = V / R; P_ = V * I; break; case "IR": I = v.I; R = v.R; V = I * R; P_ = V * I; break; case "PV": P_ = v.P; V = v.V; I = P_ / V; R = V / I; break; case "PI": P_ = v.P; I = v.I; V = P_ / I; R = V / I; break; case "PR": P_ = v.P; R = v.R; I = Math.sqrt(P_ / R); V = I * R; break; } return { voltage_V: V, current_A: I, resistance_ohm: R, power_W: P_, usedPct: 100 * P_ / v.rating, headroom: v.rating / P_ }; },
    examples: [{ known: "VR", V: 5, R: 220, rating: 0.25 }, { known: "PR", P: 0.5, R: 100, rating: 1 }],
  };

  /* — led — */
  out.led = {
    summary: "Series resistor for one or more LEDs from supply voltage, forward voltage and current, with nearest standard value and efficiency.",
    outputs: [["ledDrop_V", "Total LED forward drop = Vf * n", "V"], ["resistorVoltage_V", "Voltage left across the resistor", "V"], ["resistor_ohm", "Exact resistor value (only when resistorVoltage > 0)", "Ω"], ["resistorPower_W", "Power in the exact resistor", "W"],
      ["standardResistor_ohm", "Nearest standard value (ser != none)", "Ω"], ["actualCurrent_mA", "Current with the standard value", "mA"], ["deviation_pct", "Current deviation from target", "%"], ["standardResistorPower_W", "Power in the standard resistor", "W"], ["ledPower_W", "Power into the LEDs", "W"], ["wastedPower_W", "Wasted in the resistor", "W"], ["usefulFraction_pct", "100 * Vled / Vs", "%"]],
    formula: ["Vf = colour value (or the entered Vf when colour = 0);  Vled = Vf * n;  Vr = Vs - Vled", "R = Vr / If[A];  P = Vr * If", "standard: Rf = nearest E-series value to R; Iact = Vr / Rf; deviation = 100*(Iact - If)/If; P = Vr*Iact", "LED power = Vled * Iact (Iact = If when no series snapping); wasted = Vr * Iact; useful = 100 * Vled / Vs"].join("\n"),
    assumptions: ["If Vr <= 0 the supply cannot drive that many LEDs; the page reports an error and stops (only ledDrop_V and resistorVoltage_V are returned).", "Page warns if the resistor carries < 15 % or > 70 % of the supply, and for If > 20 mA.", "The colour select maps to the typical Vf values in its options (value 0 = enter your own Vf)."],
    run: (c, v) => { const Vf = v.col === 0 ? v.Vf : v.col, If = v.If / 1000, Vled = Vf * v.n, Vr = v.Vs - Vled; if (Vr <= 0) return { ledDrop_V: Vled, resistorVoltage_V: Vr }; const R = Vr / If; let Rf = R, Iact = If; const r = { ledDrop_V: Vled, resistorVoltage_V: Vr, resistor_ohm: R, resistorPower_W: Vr * If }; if (v.ser !== "none") { Rf = eNearest(v.ser, R); Iact = Vr / Rf; r.standardResistor_ohm = Rf; r.actualCurrent_mA = Iact * 1000; r.deviation_pct = 100 * (Iact - If) / If; r.standardResistorPower_W = Vr * Iact; } r.ledPower_W = Vled * Iact; r.wastedPower_W = Vr * Iact; r.usefulFraction_pct = 100 * Vled / v.Vs; return r; },
    examples: [{ Vs: 5, col: 1.9, If: 10, n: 1, ser: "E24" }, { Vs: 12, col: 3.25, If: 20, n: 3, ser: "E12" }],
  };

  /* — imp — */
  out.imp = {
    summary: "Characteristic impedance of microstrip or symmetric stripline (or the width for a target impedance), with propagation delay and differential impedance.",
    outputs: [["width_mm", "Trace width (given, or solved when mode=w)", "mm"], ["z0_ohm", "Single-ended characteristic impedance", "Ω"], ["effectiveEr", "Effective dielectric constant", ""], ["delay_ps_per_mm", "Propagation delay", "ps/mm"], ["flightTime_ns", "Delay over len", "ns"], ["signalSpeed_mm_per_ns", "299.79 / sqrt(eeff)", "mm/ns"], ["transmissionLineAbove_MHz", "Rule-of-thumb frequency above which the trace behaves as a transmission line", "MHz"],
      ["couplingFactor", "Differential coupling factor k (diff on)", ""], ["zDiff_ohm", "Differential impedance (diff on)", "Ω"], ["zOdd_ohm", "Odd-mode impedance = Zdiff/2 (diff on)", "Ω"]],
    formula: ["t = oz * 34.8 / 1000 mm;  h = dielectric height (microstrip) or b = plane-to-plane separation (stripline)", "Microstrip:  Z0 = 87/sqrt(er + 1.41) * ln(5.98*h / (0.8*w + t));   eeff = (er+1)/2 + (er-1)/2 * (1 + 12h/w)^-0.5", "Stripline:   Z0 = 60/sqrt(er) * ln(4*b / (0.67*pi*(0.8*w + t)));   eeff = er", "mode w: bisection on w in [0.01, 30] mm (200 iterations) until Z0(w) = Zt", "delay = 3.3356 * sqrt(eeff) ps/mm;  flight = delay*len/1000 ns;  speed = 299.79/sqrt(eeff) mm/ns;  matters above = 1000/(2*flight_ns) /1000 MHz", "Differential: k = 0.48*exp(-0.96*s/h) microstrip, 0.347*exp(-2.9*s/b) stripline;  Zdiff = 2*Z0*(1-k)"].join("\n"),
    assumptions: ["Closed-form approximations, roughly ±5 % vs a field solver, before laminate/etch tolerance; send the stackup to the fab for real impedance control.", "Microstrip fit valid for w/h in 0.1-3.0; stripline for w/b <= 0.35 and t/b <= 0.25; er between 1 and 15.", "Copper weight options for this calculator: 0.5, 1, 2 oz."],
    run: (c, v) => {
      const t = v.oz * P.OZ_UM / 1000, ms = v.type === "ms", h = ms ? v.h : v.b; let w = v.w, Z0;
      const fn = ms ? (x) => P.zMicrostrip(x, h, t, v.er) : (x) => P.zStripline(x, h, t, v.er);
      if (v.mode === "w") { let lo = 0.01, hi = 30; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (fn(m) > v.Zt) lo = m; else hi = m; } w = (lo + hi) / 2; Z0 = fn(w); } else Z0 = fn(w);
      const eeff = ms ? P.erEffMs(w, h, v.er) : v.er, tpd = 3.3356 * Math.sqrt(eeff), r = { width_mm: w, z0_ohm: Z0, effectiveEr: eeff, delay_ps_per_mm: tpd, flightTime_ns: tpd * v.len / 1000, signalSpeed_mm_per_ns: 299.79 / Math.sqrt(eeff), transmissionLineAbove_MHz: 1000 / (2 * tpd * v.len / 1000) / 1000 };
      if (v.diff.on) { const k = ms ? 0.48 * Math.exp(-0.96 * v.s / h) : 0.347 * Math.exp(-2.9 * v.s / h), Zd = 2 * Z0 * (1 - k); r.couplingFactor = k; r.zDiff_ohm = Zd; r.zOdd_ohm = Zd / 2; }
      return r;
    },
    examples: [{ type: "ms", mode: "z", w: 0.3, h: 0.2, oz: 1, er: 4.3, diff: false, s: 0.2, len: 100 }, { type: "ms", mode: "w", Zt: 50, h: 0.2, oz: 1, er: 4.3, diff: true, s: 0.2, len: 100 }, { type: "sl", mode: "z", w: 0.15, b: 0.5, oz: 0.5, er: 4.3, diff: false, s: 0.2, len: 100 }],
  };

  /* — filter — */
  out.filter = {
    summary: "RC low-pass cutoff, RL cutoff or LC resonance from component values, or the capacitor/inductor value needed for a target frequency.",
    outputs: [["cutoff_Hz", "−3 dB frequency (rc, rl; mode=f)", "Hz"], ["tau_s", "Time constant (rc: R*C, rl: L/R)", "s"], ["riseTime10to90_s", "10-90 % rise time = 2.2 τ (rc)", "s"], ["settle1pct_s", "Settled to 1 % = 4.6 τ (rc)", "s"], ["settle0p1pct_s", "Settled to 0.1 % = 6.9 τ (rc)", "s"], ["response_dB", "Attenuation at 0.1, 1, 10, 100 × fc, keyed by multiplier (rc)", "dB"],
      ["reactanceAtCutoff_ohm", "2π fc L, equal to R (rl)", "Ω"], ["resonance_Hz", "Resonant frequency (lc; mode=f)", "Hz"], ["characteristicImpedance_ohm", "sqrt(L/C) (lc)", "Ω"], ["reactanceAtResonance_ohm", "2π f0 L (lc)", "Ω"], ["q", "Q = sqrt(L/C)/R (lc, R>0)", ""], ["bandwidth_Hz", "f0/Q (lc, R>0)", "Hz"],
      ["capacitorNeeded_F", "Exact C for target frequency (rc, mode=c)", "F"], ["capacitorNearest_F", "Nearest series value of C (rc, mode=c, ser != none)", "F"], ["cutoffWithNearest_Hz", "Cutoff using the nearest C", "Hz"], ["inductorNeeded_H", "Exact L for target frequency (lc, mode=c)", "H"]],
    formula: ["Units on the page: C in nF (×1e-9 F), L in µH (×1e-6 H).", "rc, mode f:  fc = 1/(2*pi*R*C);  tau = R*C;  rise 10-90 = 2.2*tau;  1 % settle = 4.6*tau; 0.1 % = 6.9*tau;  gain(m) = 20*log10(1/sqrt(1 + m^2)) at m*fc, m in {0.1, 1, 10, 100}", "rc, mode c:  C = 1/(2*pi*R*ft);  nearest series C found in pF (E-series value nearest in relative error)", "rl:  fc = R/(2*pi*L);  tau = L/R;  X_L(fc) = 2*pi*fc*L", "lc, mode f:  f0 = 1/(2*pi*sqrt(L*C));  Z = sqrt(L/C);  Q = Z/R and BW = f0/Q when the series R input > 0", "lc, mode c:  L = 1/((2*pi*ft)^2 * C)"].join("\n"),
    assumptions: ["rc is first order (20 dB/decade); ceramic capacitors lose capacitance under DC bias; real inductors have series resistance and self-resonance.", "An underdamped LC rings; check f0 relative to switching frequency.", "In lc mode the page hides the R field but still reads it for Q and bandwidth (it keeps its last/default value, 10000 Ω); set R explicitly for a meaningful Q."],
    run: (c, v) => {
      const C = v.C * 1e-9, L = v.L * 1e-6, r = {};
      if (v.net === "rc") { if (v.mode === "f") { const f = 1 / (2 * Math.PI * v.R * C), tau = v.R * C; r.cutoff_Hz = f; r.tau_s = tau; r.riseTime10to90_s = 2.2 * tau; r.settle1pct_s = 4.6 * tau; r.settle0p1pct_s = 6.9 * tau; r.response_dB = Object.fromEntries([0.1, 1, 10, 100].map((m) => [String(m), 20 * Math.log10(1 / Math.sqrt(1 + m * m))])); } else { const Cn = 1 / (2 * Math.PI * v.R * v.ft); r.capacitorNeeded_F = Cn; if (v.ser !== "none") { const s = eNearest(v.ser, Cn * 1e12) * 1e-12; r.capacitorNearest_F = s; r.cutoffWithNearest_Hz = 1 / (2 * Math.PI * v.R * s); } } }
      if (v.net === "rl") { const f = v.R / (2 * Math.PI * L); r.cutoff_Hz = f; r.tau_s = L / v.R; r.reactanceAtCutoff_ohm = 2 * Math.PI * f * L; }
      if (v.net === "lc") { if (v.mode === "f") { const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C)), Z = Math.sqrt(L / C); r.resonance_Hz = f0; r.characteristicImpedance_ohm = Z; r.reactanceAtResonance_ohm = 2 * Math.PI * f0 * L; if (v.R > 0) { r.q = Z / v.R; r.bandwidth_Hz = f0 / (Z / v.R); } } else r.inductorNeeded_H = 1 / (Math.pow(2 * Math.PI * v.ft, 2) * C); }
      return r;
    },
    examples: [{ net: "rc", mode: "f", R: 10000, C: 100, L: 100, ft: 1000, ser: "E12" }, { net: "rc", mode: "c", R: 10000, C: 100, L: 100, ft: 1000, ser: "E12" }, { net: "rl", mode: "f", R: 10, C: 100, L: 100, ft: 1000, ser: "E12" }, { net: "lc", mode: "f", R: 1, C: 100, L: 100, ft: 1000, ser: "E12" }],
  };

  /* — shunt — */
  out.shunt = {
    summary: "Current-sense shunt sizing: resistance, sense voltage and power for a full-scale current, amplifier/ADC range, resolution and accuracy.",
    outputs: [["shunt_ohm", "Shunt resistance", "Ω"], ["senseVoltage_V", "Sense voltage at full scale", "V"], ["power_W", "Power at full scale", "W"], ["suggestedPackage", "Package guess from power", ""], ["amplifierOutput_V", "Amplifier output at full scale = Vs*gain", "V"], ["adcRangeUsed_pct", "100 * Vout / Vref", "%"], ["gainToFillAdc", "Vref / Vs", "×"], ["adcCount_V", "One LSB = Vref/2^bits", "V"], ["adcCount_A", "Current per count = lsb/(gain*R)", "A"], ["countsAtFullScale", "Vout / lsb", ""],
      ["toleranceError_pct", "±tol", "%"], ["selfHeatingError_pct", "tcr*1e-6*rise*100", "%"], ["worstCaseError_pct", "tol + self-heating", "%"]],
    formula: ["mode v: R = (Vs[mV]/1000) / Imax;  mode r: R = R[mΩ]/1000", "Vs = R*Imax;  P = Imax^2 * R", "package: P>2 '2512 / TO-220 / bar'; P>1 '2512'; P>0.5 '2010'; P>0.25 '1206'; else '0805'", "Vo = Vs*gain;  ADC used = 100*Vo/Vref;  gain to fill = Vref/Vs;  lsb = Vref/2^bits;  A per count = lsb/(gain*R);  counts = Vo/lsb", "drift = tcr[ppm/°C]*1e-6*rise*100 [%];  worst case = tol + drift (before amplifier offset and gain error)"].join("\n"),
    assumptions: ["Choose a part rated at least 2× the computed power.", "Below ~20 mV sense voltage, amplifier offset and solder-joint thermocouple effects matter.", "Use a four-wire (Kelvin) connection.", "Page flags amplifier output above Vref and ADC use under 50 %."],
    run: (c, v) => { const R = v.mode === "v" ? (v.Vs / 1000) / v.Imax : v.R / 1000, Vs = R * v.Imax, Pw = v.Imax * v.Imax * R, Vo = Vs * v.gain, lsb = v.Vref / Math.pow(2, v.bits), drift = v.tcr * 1e-6 * v.rise * 100; return { shunt_ohm: R, senseVoltage_V: Vs, power_W: Pw, suggestedPackage: Pw > 2 ? "2512 / TO-220 / bar" : Pw > 1 ? "2512" : Pw > 0.5 ? "2010" : Pw > 0.25 ? "1206" : "0805", amplifierOutput_V: Vo, adcRangeUsed_pct: 100 * Vo / v.Vref, gainToFillAdc: v.Vref / Vs, adcCount_V: lsb, adcCount_A: lsb / (v.gain * R), countsAtFullScale: Vo / lsb, toleranceError_pct: v.tol, selfHeatingError_pct: drift, worstCaseError_pct: v.tol + drift }; },
    examples: [{ Imax: 5, mode: "v", Vs: 100, R: 20, tol: 1, tcr: 50, rise: 40, gain: 20, Vref: 3.3, bits: 12 }, { Imax: 20, mode: "r", Vs: 100, R: 5, tol: 0.5, tcr: 20, rise: 30, gain: 50, Vref: 3.3, bits: 16 }],
  };

  /* assemble; every example is also pushed through the page's own compute() so it must not throw */
  const specs = [];
  for (const c of P.CALCS) {
    if (c.id === "ref") continue;
    const o = out[c.id];
    const examples = o.examples.map((ex) => {
      const st = toPage(c, ex);
      const res = r6(o.run(c, st));
      c.compute(st);
      return { inputs: ex, outputs: res };
    });
    specs.push({
      id: c.id, title: c.title, kind: "calculator", summary: o.summary,
      inputs: baseInputs(c), outputs: o.outputs.map(([name, label, unit]) => ({ name, label, unit })),
      formula: o.formula, assumptions: o.assumptions, examples, notes: NOTE_NOMAX,
    });
  }
  /* reference tables, parsed straight out of the page's HTML */
  const ref = byId.ref, tables = [];
  const secs = ref.theory.replace(/<h3>/g, "\u0001<h3>").split("\u0001").slice(1);
  const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
  for (const sec of secs) {
    const name = strip(sec.match(/<h3>(.*?)<\/h3>/)[1]), tb = sec.match(/<table class="ref">([\s\S]*?)<\/table>/);
    if (!tb) continue;
    const rows = [...tb[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) => [...m[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((x) => strip(x[1])));
    tables.push({ name, columns: rows[0], rows: rows.slice(1) });
  }
  const refTables = tables.map((t) => t.name);
  specs.push({
    id: "ref", title: ref.title, kind: "reference",
    summary: "Fixed look-up tables used by the PCB calculators: copper weights, length/area conversions, wire gauge, dielectric constants, E-series. The page has no inputs; each table is in `data`.",
    inputs: [{ name: "table", label: "Which reference table to read", unit: "", type: "enum", options: refTables.map((t) => ({ value: t, label: t })), default: refTables[0], notes: "Not a control on the page, which shows all tables at once; provided so every calculator has a machine-readable input." }],
    outputs: [{ name: "rows", label: "Rows of the selected table (see `data.tables`)", unit: "" }],
    formula: ["Page constants behind the tables and conversions:", "copper thickness per oz = 34.8 um (= 1.37 mil); 1 mil = 0.0254 mm; 1 mm^2 = 1550.0031 mil^2", "copper resistivity 1.72e-8 ohm·m at 20 °C, temperature coefficient 0.00393 /°C", "sheet resistance = rho / thickness (the copper-weight table lists it in mΩ/□ at 20 °C)", "E-series: 6, 12, 24, 96 values per decade, steps ×1.47, ×1.21, ×1.10, ×1.02"].join("\n"),
    assumptions: ["The wire-gauge current column is a chassis-wiring rule of thumb, not a standard.", "FR-4 is a flammability rating, not a material spec; ε_r varies with laminate and frequency."],
    data: {
      constants: { copperMicronsPerOz: P.OZ_UM, milToMm: 0.0254, mil2PerMm2: P.MM2_MIL2, copperResistivity_ohm_m_at20C: P.RHO_CU, copperTempCoefficientPerC: P.ALPHA_CU },
      eSeries: { E12: P.E12, E24: P.E24, E96: P.E96 },
      tables,
    },
    examples: [{ inputs: { table: refTables[0] }, outputs: { rows: tables[0].rows.length } }],
    notes: "Reference tab of the calculator page, not a computation: values are copied from the page's tables. Table cells are display strings (some are ranges such as '4.2 – 4.6').",
  });
  return specs;
}

/* ───────────── assemble ───────────── */
const specs = {
  "fastener-sheet-metric": { summary: "Metric fastener reference sheet, M2–M20: thread data, tap drills, clearance holes, head/drive/nut dimensions, washers, torque strings and 3D-print hole sizes.", ...sheetSpec("fastener-sheet.html", true) },
  "fastener-sheet-inch": { summary: "Inch fastener reference sheet, #2–3/4 in UNC/UNF: thread data, tap drills, clearance holes, head/drive/nut dimensions, washers, torque strings and 3D-print hole sizes.", ...sheetSpec("fastener-sheet-inch.html", false) },
  "holding-force-metric": { summary: "Pick the smallest metric screw that safely holds a load (kg) in a given direction, material and safety factor.", ...holdingSpec("kg", "holding-force-metric.html", 25) },
  "holding-force-inch": { summary: "Pick the smallest inch screw that safely holds a load (lb) in a given direction, material and safety factor.", ...holdingSpec("lb", "holding-force-inch.html", 50) },
  "torque-metric": { summary: "Tightening torque for metric screws (N·m) by size, property class and tapped material, including the limit set by thread strip in the hole.", ...torqueSpec(true, "torque-metric.html") },
  "torque-inch": { summary: "Tightening torque for inch screws (lb-in) by size, grade and tapped material, including the limit set by thread strip in the hole.", ...torqueSpec(false, "torque-inch.html") },
  pcb: { summary: "Ten hobbyist PCB calculators on one page: trace width, via current, trace resistance, resistor divider, Ohm's law, LED resistor, controlled impedance, RC/RL/LC filters, current-sense shunt, and reference tables.", calculators: pcbSpecs(), notes: "Each entry of `calculators` is a full spec with its own inputs, outputs, formula and examples. They share the single page url." },
};

const header = `// GENERATED by scripts/gen-tool-specs.cjs from public/tools/**. Do not edit by hand:
// edit a calculator page, then re-run \`node scripts/gen-tool-specs.cjs\`.
// Constants and tables are read from each page's own JS; worked examples are computed with the page's formulas.
import { pageUrl } from "@/content/site";
import { getTool } from "@/content/tools";

export type ToolSpecInput = {
  name: string;
  label: string;
  unit: string;
  type: "number" | "enum" | "boolean" | "set";
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string | number; label: string }[];
  default?: unknown;
  activeWhen?: string;
  hint?: string;
  notes?: string;
};
export type ToolSpecOutput = { name: string; label: string; unit: string };
export type ToolSpecExample = { inputs: Record<string, unknown>; outputs: Record<string, unknown> };
export type CalculatorSpec = {
  id: string;
  title: string;
  kind: string;
  summary: string;
  inputs: ToolSpecInput[];
  outputs: ToolSpecOutput[];
  formula: string;
  assumptions?: string[];
  examples: ToolSpecExample[];
  data?: unknown;
  notes?: string;
};
export type ToolSpec = {
  id: string;
  title: string;
  kind: string;
  summary: string;
  url: string;
  inputs?: ToolSpecInput[];
  outputs?: ToolSpecOutput[];
  formula?: string;
  assumptions?: string[];
  examples?: ToolSpecExample[];
  /** reference sheets: table data instead of inputs/outputs */
  data?: unknown;
  /** pcb only: one spec per calculator on the page */
  calculators?: (CalculatorSpec & { url: string })[];
  notes?: string;
};

type RawSpec = Omit<ToolSpec, "id" | "title" | "kind" | "url" | "calculators"> & { calculators?: CalculatorSpec[] };
`;
const body = `
const RAW: Record<string, RawSpec> = ${JSON.stringify(r6(specs), null, 1)};

/** One spec per slug in content/tools.ts; title, kind and url always come from there. */
export const toolSpecs: ToolSpec[] = Object.entries(RAW).map(([id, raw]) => {
  const t = getTool(id);
  if (!t) throw new Error(\`toolSpecs: unknown tool slug \${id}\`);
  const url = pageUrl(t.href ?? \`/tools/\${id}\`);
  const { calculators, ...rest } = raw;
  const spec: ToolSpec = { id, title: t.title, kind: t.kind, ...rest, url };
  if (calculators) spec.calculators = calculators.map((c) => ({ ...c, url }));
  return spec;
});

export function getToolSpec(id: string): ToolSpec | undefined {
  return toolSpecs.find((s) => s.id === id);
}
`;
fs.writeFileSync(path.join(ROOT, "content/toolSpecs.ts"), header + body);
console.log("wrote content/toolSpecs.ts", (header + body).length, "bytes");
