import type { NextConfig } from "next";

// `STATIC_EXPORT=1 next build` produces a fully static ./out folder that can be
// uploaded by FTP/cPanel and served beside (or instead of) WordPress — no Node
// server needed. Normal `next build`/`next dev` are unaffected.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = staticExport
  ? {
      output: "export",
      images: { unoptimized: true },
      trailingSlash: true, // each route -> /route/index.html (clean on Apache/cPanel)
    }
  : {};

export default nextConfig;
