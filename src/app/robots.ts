import { MetadataRoute } from "next";

import { baseUrl } from "@/config/app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/settings/",
        "/journal/",
        "/admin/",
        "https://accounts.somnyx.app/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
