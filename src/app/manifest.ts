import { MetadataRoute } from "next";

import { SEO } from "@/config/app";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Somnyx",
    short_name: "Somnyx",
    description: SEO.default.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    icons: [
      {
        src: "/pwa/manifest-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/pwa/manifest-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
