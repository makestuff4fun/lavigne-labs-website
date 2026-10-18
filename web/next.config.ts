import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// If node_modules is a symlink (e.g. a shared install in a git worktree),
// Turbopack needs a root that contains both the app and the link target.
function turbopackRoot(): string | undefined {
  try {
    const nm = path.join(process.cwd(), "node_modules");
    if (!fs.lstatSync(nm).isSymbolicLink()) return undefined;
    const a = process.cwd().split(path.sep);
    const b = fs.realpathSync(nm).split(path.sep);
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    return a.slice(0, i).join(path.sep) || path.sep;
  } catch {
    return undefined;
  }
}

// `STATIC_EXPORT=1 next build` produces a fully static ./out folder that can be
// uploaded by FTP/cPanel and served beside (or instead of) WordPress — no Node
// server needed. Normal `next build`/`next dev` are unaffected.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = staticExport
  ? {
      turbopack: { root: turbopackRoot() },
      output: "export",
      images: { unoptimized: true },
      trailingSlash: true, // each route -> /route/index.html (clean on Apache/cPanel)
    }
  : { turbopack: { root: turbopackRoot() } };

export default nextConfig;
