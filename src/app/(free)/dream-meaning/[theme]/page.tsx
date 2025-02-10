import { notFound } from "next/navigation";

import { preloadQuery } from "convex/nextjs";

import ThemeContent from "@/components/dream-meaning/theme-content";
import { api } from "@/convex/_generated/api";
import FooterCtaSection from "@/components/dream-meaning/footer-cta-section";

export default async function Page({ params }: { params: { theme: string } }) {
  const themePage = await preloadQuery(
    // @ts-ignore
    api.queries.themePages.getThemePageByNamePublic,
    {
      name: params.theme,
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
