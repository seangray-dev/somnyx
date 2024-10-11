"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";

import DreamCard from "@/components/shared/dream-card";
import { api } from "@/convex/_generated/api";

type RecentDreamsProps = {
  recentDreams: Preloaded<typeof api.queries.getRecentUserDreams>;
};

export default function RecentDreams(props: RecentDreamsProps) {
  const recentDreams = usePreloadedQuery(props.recentDreams);

  if (!recentDreams) {
    return null;
  }

  return (
    <section>
      <div className="container flex flex-col gap-6">
        <div>
          <h2 className="text-lg sm:text-2xl">Recent Dreams</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentDreams.map((dream) => (
            <DreamCard key={dream._id} {...dream} />
          ))}
        </div>
      </div>
    </section>
  );
}
