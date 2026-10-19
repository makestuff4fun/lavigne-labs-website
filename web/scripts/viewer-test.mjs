// Drives a work page in headless Chromium: keyboard arrows, thumbnail, lightbox, Esc, focus return.
//   node scripts/viewer-test.mjs <baseUrl> <path>
import { spawn, execSync } from "node:child_process";
const [base, path] = process.argv.slice(2);
const chrome = execSync("find ~/.cache/ms-playwright -name chrome-headless-shell -type f | head -1").toString().trim();
const port = 9800 + Math.floor(Math.random() * 100);
const proc = spawn(chrome, [`--remote-debugging-port=${port}`, "--no-sandbox", "--disable-gpu", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let t;
for (let i = 0; i < 50 && !t; i++) { try { t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === "page"); } catch {} await sleep(200); }
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); pend.get(d.id)?.(d); };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, (d) => res(d.result)); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send("Runtime.evaluate", { expression: e, returnByValue: true })).result.value;
const key = async (k, code = k) => { for (const type of ["keyDown", "keyUp"]) await send("Input.dispatchKeyEvent", { type, key: k, code, windowsVirtualKeyCode: { ArrowRight: 39, ArrowLeft: 37, Escape: 27 }[k] }); await sleep(250); };
const counter = () => ev(`document.querySelector('[data-viewer] [aria-live]').textContent.trim()`);
await send("Page.navigate", { url: base + path }); await sleep(1500);
const out = {};
out.slides = await ev(`document.querySelectorAll('[data-slide]').length`);
await ev(`document.querySelector('[data-viewer]').focus()`);
out.start = await counter();
await key("ArrowRight"); out.afterRight = await counter();
await key("ArrowRight"); out.afterRight2 = await counter();
await key("ArrowLeft"); out.afterLeft = await counter();
await ev(`document.querySelector('[data-slide] img').click()`); await sleep(300);
out.lightboxOpen = await ev(`!!document.querySelector('[data-lightbox]')`);
out.bodyLocked = await ev(`document.body.style.overflow`);
out.focusInDialog = await ev(`document.querySelector('[data-lightbox]').contains(document.activeElement)`);
await key("ArrowRight"); out.lightboxCounter = await ev(`document.querySelector('[data-lightbox] [aria-live]').textContent.trim()`);
await key("Escape"); out.lightboxClosed = await ev(`!document.querySelector('[data-lightbox]')`);
out.bodyUnlocked = await ev(`document.body.style.overflow === ''`);
console.log(JSON.stringify(out, null, 1));
ws.close(); proc.kill();
