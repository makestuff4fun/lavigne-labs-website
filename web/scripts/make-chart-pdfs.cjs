// Build-time: print the exported shop chart pages to vector-text PDFs (A4 + Letter)
// with headless Chromium. Binary: $CHROME_BIN or the Playwright headless shell.
// Serves ./out over localhost (pages reference absolute /_next assets), injects an
// @page size + zoom, and picks the largest zoom that fits the page budget.
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const { spawn } = require("child_process");

const OUT = path.resolve(__dirname, "..", "out");
const DEFAULT_BIN = path.join(os.homedir(), ".cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell");
const BIN = process.env.CHROME_BIN || DEFAULT_BIN;
if (!fs.existsSync(BIN)) {
  console.error(`ERROR: Chromium not found at ${BIN}\n  Set CHROME_BIN to a chrome/chromium (headless shell) binary. Needed to generate the shop chart PDFs.`);
  process.exit(1);
}
const TITLES = {
  "metric-tap-drills": "Metric Tap Drill Chart",
  "inch-tap-drills": "Inch Tap Drill Chart (UNC/UNF)",
  "decimal-equivalents": "Drill Decimal Equivalents Chart",
  "cheat-sheet": "Shop Cheat Sheet",
};
// [preferred pages, hard max pages, min zoom for the preferred count]
const BUDGET = { "metric-tap-drills": [1, 2, 0.75], "inch-tap-drills": [1, 2, 0.75], "decimal-equivalents": [1, 2, 0.75], "cheat-sheet": [1, 1, 0.4] };
const VARIANTS = { a4: "A4", letter: "Letter" };

const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  let p = path.join(OUT, decodeURIComponent(u.pathname));
  if (!p.startsWith(OUT)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!fs.existsSync(p)) { res.writeHead(404).end(); return; }
  let body = fs.readFileSync(p);
  const type = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".woff2": "font/woff2" }[path.extname(p)] || "application/octet-stream";
  if (p.endsWith(".html") && u.searchParams.has("size")) {
    const z = u.searchParams.get("zoom") || "1";
    const css = `<style>@page{size:${u.searchParams.get("size")};margin:11mm}` +
      `@media print{.chart-sheet{zoom:${z}}.chart-cols.c2{grid-template-columns:repeat(2,minmax(0,1fr))}.chart-cols.c4{grid-template-columns:repeat(4,minmax(0,1fr))}.chart-sheet{padding:0}.chart-head h1{font-size:2rem}}</style><title>${u.searchParams.get("title")}</title>`;
    body = Buffer.from(body.toString("utf8").replace(/<title>.*?<\/title>/, "").replace("</head>", css + "</head>"));
  }
  res.writeHead(200, { "content-type": type }).end(body);
});

async function render(port, slug, size, zoom, file) {
  const url = `http://127.0.0.1:${port}/tools/charts/${slug}/?size=${size}&zoom=${zoom}&title=${encodeURIComponent(TITLES[slug] + " — Lavigne Labs")}`;
  // async spawn: the page is served by this same process, so the event loop must stay free
  fs.rmSync(file, { force: true });
  const r = await new Promise((resolve) => {
    const c = spawn(BIN, ["--headless", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${file}`, url]);
    let stderr = "";
    c.stderr.on("data", (d) => (stderr += d));
    const t = setTimeout(() => c.kill("SIGKILL"), 60000);
    c.on("close", (status) => { clearTimeout(t); resolve({ status, stderr }); });
    c.on("error", (e) => { clearTimeout(t); resolve({ status: -1, stderr: String(e) }); });
  });
  if (r.status !== 0 || !fs.existsSync(file)) throw new Error(`Chromium failed for ${slug} ${size}: ${r.stderr}`);
  const pdf = fs.readFileSync(file, "latin1");
  return (pdf.match(/\/Type\s*\/Page[^s]/g) || []).length;
}

server.listen(0, "127.0.0.1", async () => {
  const port = server.address().port;
  const dir = path.join(OUT, "tools/charts");
  try {
    for (const [slug, [pref, max, minZoom]] of Object.entries(BUDGET)) {
      for (const [v, size] of Object.entries(VARIANTS)) {
        const file = path.join(dir, `${slug}-${v}.pdf`);
        // largest zoom that fits the preferred page count (not below minZoom),
        // else the largest zoom that fits the hard maximum
        let pick = null, fallback = null, n = 0;
        for (let z = 1.0; z >= 0.4 - 1e-9 && !pick; z = Math.round((z - 0.05) * 100) / 100) {
          n = await render(port, slug, size, z, file);
          if (n <= pref && z >= minZoom - 1e-9) pick = { z, n };
          else if (n <= max && !fallback) fallback = { z, n };
          if (!pick && z < minZoom && fallback) break;
        }
        pick = pick || fallback;
        if (!pick) throw new Error(`${slug}-${v}.pdf does not fit in ${max} page(s)`);
        await render(port, slug, size, pick.z, file);
        console.log(`  ${slug}-${v}.pdf  zoom ${pick.z}  ${pick.n} page(s)`);
      }
    }
  } catch (e) { console.error("ERROR: " + e.message); process.exitCode = 1; }
  server.close();
});
