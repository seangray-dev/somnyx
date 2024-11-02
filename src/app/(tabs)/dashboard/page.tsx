import Insights from "@/features/insights";
import RecentDreams from "@/features/recent-dreams/components/recent-dreams";

export default async function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-16">
      <RecentDreams />
      <Insights />
    </div>
  );
}
