import { MetadataRoute } from "next";

import { baseUrl } from "@/config/app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/blog",
    },
    sitemap: `${baseUrl}/blog/sitemap.xml`,
  };
}
