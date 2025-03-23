import { MetadataRoute } from "next";

import { baseUrl } from "@/config/app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/dream-dictionary", "/dream-dictionary/*-dream-meaning"],
    },
    sitemap: `${baseUrl}/dream-dictionary/sitemap.xml`,
  };
}
