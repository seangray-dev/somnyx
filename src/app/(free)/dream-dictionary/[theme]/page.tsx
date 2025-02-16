import { Metadata } from "next";

import { preloadQuery } from "convex/nextjs";

import ThemePageContent from "@/components/dream-dictionary/theme-page";
import { SEO } from "@/config/app";
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

export async function generateMetadata(): Promise<Metadata> {
  // TODO: Dynamic metadata for theme pages - title, description, image,

  return {
    title: SEO.pages.dreamDictionary.title,
    description: SEO.pages.dreamDictionary.description,
    openGraph: {
      title: SEO.pages.dreamDictionary.title,
      description: SEO.pages.dreamDictionary.description,
    },
    twitter: {
      title: SEO.pages.dreamDictionary.title,
      description: SEO.pages.dreamDictionary.description,
    },
  };
}
