import { Metadata } from "next";

import { SEO } from "@/config/app";
import SignupTracker from "@/features/_analytics/components/signup-tracker";
import EmotionFrequency from "@/features/dream-mood-map/components";
import RecentDreamsSection from "@/features/dreams/components/recent-dreams-section";
import Insights from "@/features/insights/components/dashboard";

export default async function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-16">
      <SignupTracker />
      <EmotionFrequency />
      <RecentDreamsSection />
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
