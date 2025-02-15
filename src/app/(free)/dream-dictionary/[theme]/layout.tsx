import { preloadQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";

import ThemePage from "./page";

export default async function layout({
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

  return <ThemePage preloadedThemePage={preloadedThemePage} />;
}
