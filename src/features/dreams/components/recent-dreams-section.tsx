"use client";

import { DreamCard } from "@/features/dreams/components/dream-card";
import { DreamCardSkeleton } from "@/features/dreams/components/dream-card/dream-card-skeleton";
import { NoDreams } from "@/features/dreams/components/no-dreams";

import useRecentDreams from "../api/use-recent-dreams";

export default function RecentDreamsSection() {
  const { data: recentDreams, isLoading } = useRecentDreams();

  if (!isLoading && (!recentDreams || recentDreams.length === 0)) {
    return (
      <>
        <h2 className="container text-3xl font-bold">Recent Dreams</h2>
        <NoDreams />
      </>
    );
  }

  return (
    <section className="flex flex-1 flex-col">
      <div className="container flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold">Recent Dreams</h2>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <DreamCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentDreams?.map((dream) => (
              <DreamCard key={dream._id} dream={dream} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
