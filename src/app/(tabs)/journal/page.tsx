import { Metadata } from "next";

import JournalEntries from "@/components/journal/entries";
import { SEO } from "@/config/app";

export default function JournalPage() {
  return (
    <div className="container flex flex-1 flex-col gap-6">
      <JournalEntries />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.pages.journal.title,
    description: SEO.pages.journal.description,
    openGraph: {
      title: SEO.pages.journal.title,
      description: SEO.pages.journal.description,
    },
    twitter: {
      title: SEO.pages.journal.title,
      description: SEO.pages.journal.description,
    },
  };
}
