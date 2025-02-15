import { preloadQuery } from "convex/nextjs";

import ThemePageContent from "@/components/dream-dictionary/theme-page";
import { api } from "@/convex/_generated/api";

export default async function ThemePage({
  params,
}: {
  params: { theme: string };
}) {
  const preloadedThemePage = await preloadQuery(
    // @ts-ignore
    api.queries.themePages.getThemePageByNamePublic,
    {
      name: params.theme.toLowerCase(),
    }
  );

  return <ThemePageContent preloadedThemePage={preloadedThemePage} />;
}
