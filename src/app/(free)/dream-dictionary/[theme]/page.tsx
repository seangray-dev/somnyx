import { notFound } from "next/navigation";

import { ConvexHttpClient } from "convex/browser";
import { preloadQuery } from "convex/nextjs";

import FooterCtaSection from "@/components/dream-meaning/footer-cta-section";
import ThemeContent from "@/components/dream-meaning/theme-content";
import { env } from "@/config/env/client";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL!);

export async function generateStaticParams() {
  const themePages = await convex.query(
    // @ts-ignore
    api.queries.themePages.getAllThemePages
  );
  return themePages.map((page) => ({
    theme: page.seo_slug,
  }));
}

export default async function Page({ params }: { params: { theme: string } }) {
  const themePage = await preloadQuery(
    api.queries.themePages.getThemePageByNamePublic,
    {
      name: params.theme.toLowerCase(),
    }
  );

  // @ts-ignore
  if (!themePage._valueJSON) {
    return notFound();
  }

  return (
    <>
      <ThemeContent themePage={themePage} />
      <FooterCtaSection variant="theme-page" />
    </>
  );
}
