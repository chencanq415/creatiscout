import path from "node:path";
import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/creatiscout" : "",
  assetPrefix: isGitHubPages ? "/creatiscout/" : undefined,
  trailingSlash: isGitHubPages,
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    unoptimized: isGitHubPages,
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
