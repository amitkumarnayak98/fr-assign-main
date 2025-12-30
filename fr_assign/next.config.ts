import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: { unoptimized: true },
  basePath: "/fr-assign-main", // MUST match your GitHub repo name
};

export default nextConfig;
