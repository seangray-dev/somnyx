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
        src: "./favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
