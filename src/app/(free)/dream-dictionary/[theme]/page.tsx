import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

import { fetchQuery, preloadQuery } from "convex/nextjs";

import ThemePageContent from "@/components/dream-dictionary/theme-page";
import { SEO, applicationName, baseUrl } from "@/config/app";
import { api } from "@/convex/_generated/api";
import { generateJSONLD } from "@/features/dream-dictionary/utils/json-ld";

export default async function ThemePage({
  params,
}: {
  params: { theme: string };
}) {
  // If the URL doesn't end with -dream-meaning, redirect to the correct format
  if (!params.theme.endsWith("-dream-meaning")) {
    permanentRedirect(`/dream-dictionary/${params.theme}-dream-meaning`);
  }

  // Extract the actual theme name by removing -dream-meaning
  const themeName = params.theme.replace("-dream-meaning", "");

  const preloadedThemePage = await preloadQuery(
    // @ts-ignore
    api.queries.themePages.getThemePageByNamePublic,
    {
      name: themeName.toLowerCase(),
    }
  );

  const jsonLd = generateJSONLD(preloadedThemePage);

  return (
    <>
      <ThemePageContent preloadedThemePage={preloadedThemePage} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { theme: string };
}): Promise<Metadata> {
  // TODO: Dynamic metadata for theme pages - title, description, image,
  const themeName = params.theme.replace("-dream-meaning", "");
  const theme = await fetchQuery(
    // @ts-ignore
    api.queries.themePages.getThemePageByNamePublic,
    {
      name: themeName.toLowerCase(),
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
  const title = `${name} Dream Meaning | ${applicationName}`;

  return {
    robots: {
      index: true,
      follow: true,
    },
    title,
    description: seo_description,
    keywords: `${name} dream meaning, ${name} in dreams, ${name} dream interpretation, what does ${name} mean in dreams`,
    openGraph: {
      title,
      description: seo_description,
      type: "article",
      publishedTime: new Date(theme._creationTime).toISOString(),
      authors: [applicationName],
    },
    twitter: {
      title,
      description: seo_description,
    },
    alternates: {
      canonical: `${baseUrl}/dream-dictionary/${themeName}-dream-meaning`,
    },
  };
}
