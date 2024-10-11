import { preloadQuery } from "convex/nextjs";

import RecentDreams from "@/components/dashboard/recent-dreams";
import { api } from "@/convex/_generated/api";

export default async function DashboardPage() {
  const recentDreams = await preloadQuery(api.queries.getRecentUserDreams, {});

  return (
    <div className="flex flex-col gap-6">
      <RecentDreams recentDreams={recentDreams} />
    </div>
  );
}
