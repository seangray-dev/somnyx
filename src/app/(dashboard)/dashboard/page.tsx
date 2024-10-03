import DashboardHeader from "@/components/dashboard/dashboard-header";
import RecentDreams from "@/components/dashboard/recent-dreams";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      <RecentDreams />
    </div>
  );
}
