import { MetadataRoute } from "next";

import { SEO } from "@/config/app";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Somnyx",
    short_name: "Somnyx",
    description: SEO.default.description,
    start_url: "https://somnyx.app",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#030712",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    share_target: {
      action: "/share-target",
      method: "get",
      enctype: "application/x-www-form-urlencoded",
      params: [
        {
          name: "text",
          value: "text",
        },
        {
          name: "url",
          value: "url",
        },
      ],
    },
    shortcuts: [
      {
        name: "Dream Dictionary",
        url: "/dream-dictionary",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],
    scope: "/",
    related_applications: [
      {
        platform: "webapp",
        url: "https://somnyx.app/manifest.webmanifest",
      },
    ],
    prefer_related_applications: true,
    protocol_handlers: [
      {
        protocol: "web+somnyx",
        url: "/%s",
      },
    ],
  };
}
