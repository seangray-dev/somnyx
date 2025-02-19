import { MetadataRoute } from "next";

import { SEO } from "@/config/app";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Somnyx",
    short_name: "Somnyx",
    description: SEO.default.description,
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#030712",
    icons: [
      {
        src: "/images/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
