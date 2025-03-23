import { MetadataRoute } from "next";

import { fetchQuery } from "convex/nextjs";

import { baseUrl } from "@/config/app";
import { api } from "@/convex/_generated/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch public dreams
  const { page: dreams } = await fetchQuery(
    // @ts-ignore
    api.queries.dreams.getPublicDreams,
    {
      paginationOpts: {
        numItems: 100,
        cursor: null,
      },
      sortBy: "recent",
    }
  );

  return dreams.map((dream) => ({
    url: `${baseUrl}/dreams/${dream.date}/${dream.slug}`,
    lastModified: new Date(dream._creationTime),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
}
