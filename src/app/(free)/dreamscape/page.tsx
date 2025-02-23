import { Metadata } from "next";

import DreamscapeExplorer from "@/features/dreamscape/components/dreamscape-explorer";

export const metadata: Metadata = {
  title: "Dreamscape Explorer",
  description: "Explore and discover shared dreams from the Somnyx community.",
};

export default async function DreamscapePage() {
  return (
    <main className="pt-10">
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
  );
}
