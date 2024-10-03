"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import DreamCard from "./dream-card";

export default function RecentDreams() {
  const recentDreams = useQuery(api.queries.getRecentUserDreams, {});

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
