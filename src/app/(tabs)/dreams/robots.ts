import { MetadataRoute } from "next";

import { baseUrl } from "@/config/app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/dreams/*",
    },
    sitemap: `${baseUrl}/dreams/sitemap.xml`,
  };
}
