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
