import { MetadataRoute } from "next";

import { fetchQuery } from "convex/nextjs";

import { baseUrl } from "@/config/app";
import { api } from "@/convex/_generated/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all published theme pages from dream dictionary
  const themePages = await fetchQuery(
    // @ts-ignore
    api.queries.themePages.getPublishedThemePages
  );

  // Create sitemap entries for theme pages
  const dictionaryRoutes = themePages.map((theme) => ({
    url: `${baseUrl}/dream-dictionary/${theme.seo_slug}-dream-meaning`,
    lastModified: new Date(theme.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...dictionaryRoutes];
}
