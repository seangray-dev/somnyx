import { Metadata } from "next";

import { fetchQuery, preloadQuery } from "convex/nextjs";

import ThemePageContent from "@/components/dream-dictionary/theme-page";
import { applicationName, SEO } from "@/config/app";
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

export async function generateMetadata({
  params,
}: {
  params: { theme: string };
}): Promise<Metadata> {
  // TODO: Dynamic metadata for theme pages - title, description, image,
  const theme = await fetchQuery(
    // @ts-ignore
    api.queries.themePages.getThemePageByNamePublic,
    {
      name: params.theme.toLowerCase(),
    }
  );

  // TODO: Fallbacks - images, etc.
  if (!theme) {
    return {
      title: SEO.pages.dreamDictionary.title,
      description: SEO.pages.dreamDictionary.description,
    };
  }

  const { name, seo_description } = theme;
  const title = `${SEO.pages.dreamDictionary.title} - ${name} | ${applicationName}`;

  return {
    title,
    description: seo_description,
    openGraph: {
      title,
      description: seo_description,
    },
    twitter: {
      title,
      description: seo_description,
    },
  };
}
