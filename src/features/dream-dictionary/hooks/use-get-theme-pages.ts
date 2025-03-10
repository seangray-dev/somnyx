import { useMemo } from "react";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { CategoryGroup } from "../types";

type ThemePageWithCategory = Omit<Doc<"themePages">, "category"> & {
  category: Doc<"themeCategories">;
};

export default function useGetThemePages() {
  // @ts-ignore
  const data = useQuery(api.queries.themePages.getPublishedThemePages);

  const groupedPages = useMemo(() => {
    const grouped: Record<string, CategoryGroup> = {};

    for (const page of data ?? []) {
      if (!page.category) continue;

      if (!grouped[page.category._id]) {
        grouped[page.category._id] = {
          category: page.category,
          symbols: [],
          themes: [],
        };
      }

      if (page.type === "symbol") {
        grouped[page.category._id].symbols.push(page as ThemePageWithCategory);
      } else {
        grouped[page.category._id].themes.push(page as ThemePageWithCategory);
      }
    }

    const sorted = Object.values(grouped).sort((a, b) => {
      // Always put common_themes first
      if (a.category.name === "common_themes") return -1;
      if (b.category.name === "common_themes") return 1;
      // Sort rest alphabetically by displayName
      return a.category.displayName.localeCompare(b.category.displayName);
    });

    return sorted;
  }, [data]);

  const loading = data === undefined;

  return { groupedPages, loading };
}
