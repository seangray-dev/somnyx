import createJiti from "jiti";
import createNextDocsMDX from "next-docs-mdx/config";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./src/config/env/server");

const withMDX = createNextDocsMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vivid-hornet-727.convex.cloud",
      },
    ],
  },
};

export default withMDX(nextConfig);
