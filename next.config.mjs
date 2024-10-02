import createJiti from "jiti";
import createNextDocsMDX from "next-docs-mdx/config";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./src/env/server.ts");

const withMDX = createNextDocsMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
};

export default withMDX(nextConfig);
