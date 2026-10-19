// Full-page screenshots via headless Chromium over raw CDP (no dependencies).
//   node scripts/shoot.mjs <baseUrl> <outDir> <name=path> [name=path ...]
// Writes <outDir>/<name>-desktop.png (1440px) and <name>-mobile.png (390px).
// Env: CHROME=/path/to/headless_shell (auto-detected under ~/.cache/ms-playwright).
import { spawn, execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const [base, outDir, ...pages] = process.argv.slice(2);
if (!base || !outDir || !pages.length) {
  console.error("usage: shoot.mjs <baseUrl> <outDir> <name=path> ...");
  process.exit(2);
}
const chrome =
  process.env.CHROME ||
  execSync("find ~/.cache/ms-playwright -name headless_shell -type f | head -1").toString().trim() ||
  execSync("find ~/.cache/ms-playwright -name chrome-headless-shell -type f | head -1").toString().trim();
mkdirSync(outDir, { recursive: true });
const port = 9300 + Math.floor(Math.random() * 500);
const proc = spawn(chrome, [`--remote-debugging-port=${port}`, "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const t = list.find((x) => x.type === "page");
      if (t) return t.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error("chrome did not start");
}
const ws = new WebSocket(await connect());
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
};
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result)));
    ws.send(JSON.stringify({ id: i, method, params }));
  });
const ev = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;

await send("Page.enable");
for (const [label, width, mobile] of [["desktop", 1440, false], ["mobile", 390, true]]) {
  await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile });
  for (const p of pages) {
    const [name, path] = p.split("=");
    await send("Page.navigate", { url: base.replace(/\/$/, "") + path });
    await sleep(600);
    // scroll through to trigger lazy images, then wait for all to decode
    await ev(`(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}
      scrollTo(0,0);await Promise.all([...document.images].map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r;setTimeout(r,4000)})));})()`);
    await sleep(400);
    const h = await ev("Math.ceil(document.documentElement.scrollHeight)");
    await send("Emulation.setDeviceMetricsOverride", { width, height: Math.min(h, 12000), deviceScaleFactor: 1, mobile });
    await sleep(300);
    const shot = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(`${outDir}/${name}-${label}.png`, Buffer.from(shot.data, "base64"));
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile });
    console.log(`${name}-${label}`, h);
  }
}
ws.close();
proc.kill();
