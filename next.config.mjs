import createJiti from "jiti";
import createNextDocsMDX from "next-docs-mdx/config";
import nextPwa from "next-pwa";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./src/config/env/server");

const withMDX = createNextDocsMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
};

const withPWA = nextPwa({
  dest: "public",
  register: true,
});

const config = withPWA({
  ...nextConfig,
});

export default withMDX(config);
