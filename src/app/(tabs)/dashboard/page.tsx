import { Metadata } from "next";

import { SEO } from "@/config/app";
import EmotionFrequency from "@/features/dream-mood-map/components";
import Insights from "@/features/insights/components/dashboard";
import RecentDreams from "@/features/recent-dreams/components/recent-dreams";

export default async function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-16">
      <EmotionFrequency />
      <RecentDreams />
      <Insights />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.pages.dashboard.title,
    description: SEO.pages.dashboard.description,
    openGraph: {
      title: SEO.pages.dashboard.title,
      description: SEO.pages.dashboard.description,
    },
    twitter: {
      title: SEO.pages.dashboard.title,
      description: SEO.pages.dashboard.description,
    },
  };
}
