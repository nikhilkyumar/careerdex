import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  // Keep `next dev` output separate from production builds. Next clears its
  // output directory during a build, which can invalidate a running dev server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};
export default nextConfig;
