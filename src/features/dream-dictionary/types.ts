import { Doc } from "@/convex/_generated/dataModel";

type ThemePageWithCategory = Omit<Doc<"themePages">, "category"> & {
  category: Doc<"themeCategories">;
};

export type CategoryGroup = {
  category: Doc<"themeCategories">;
  symbols: ThemePageWithCategory[];
  themes: ThemePageWithCategory[];
};
