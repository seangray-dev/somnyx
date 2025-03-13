import { Metadata } from "next";

import { SEO, baseUrl } from "@/config/app";
import DreamscapeExplorer from "@/features/dreamscape/components/dreamscape-explorer";
import { generateJSONLD } from "@/features/dreamscape/util/json-ld";

export default async function DreamscapePage() {
  const jsonLd = generateJSONLD();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="pt-20">
        <div className="mx-auto space-y-12">
          <div className="container space-y-4">
            <h1 className="text-4xl font-bold">Dreamscape Explorer</h1>
            <p className="max-w-[80ch] text-lg text-muted-foreground">
              Discover and explore shared dreams from the Somnyx community. Each
              dream offers a unique window into the subconscious mind and the
              universal human experience of dreaming.
            </p>
          </div>
          <DreamscapeExplorer />
        </div>
      </main>
    </>
  );
}

export const metadata: Metadata = {
  // TODO: OG + Twitter Images
  title: SEO.pages.dreamscape.title,
  description: SEO.pages.dreamscape.description,
  openGraph: {
    title: SEO.pages.dreamscape.title,
    description: SEO.pages.dreamscape.description,
    url: `${baseUrl}/dreamscape`,
  },
  twitter: {
    title: SEO.pages.dreamscape.title,
    description: SEO.pages.dreamscape.description,
  },
};
