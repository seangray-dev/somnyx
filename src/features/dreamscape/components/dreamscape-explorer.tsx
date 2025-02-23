"use client";

import { useEffect, useState } from "react";

import { usePaginatedQuery } from "convex/react";
import { useInView } from "react-intersection-observer";

import { api } from "@/convex/_generated/api";

import { DreamPreviewCard } from "./dream-preview-card";
import DreamPreviewSkeleton from "./dream-preview-skeleton";
import { DreamscapeHeader } from "./dreamscape-header";
import ExhaustedList from "./exhausted-list";
import { SortSelector } from "./sort-selector";

type SortOption = "recent" | "random";

export default function DreamscapeExplorer() {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const { ref, inView } = useInView();

  const {
    results: dreams,
    status,
    loadMore,
  } = usePaginatedQuery(
    // @ts-ignore
    api.queries.dreams.getPublicDreams,
    { sortBy },
    { initialNumItems: 10 }
  );

  useEffect(() => {
    if (inView && status === "CanLoadMore") {
      loadMore(10);
    }
  }, [inView, status, loadMore]);

  return (
    <div className="space-y-8">
      <DreamscapeHeader>
        <SortSelector value={sortBy} onValueChange={setSortBy} />
      </DreamscapeHeader>

      <div className="container mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dreams?.map((dream) => (
          <DreamPreviewCard key={dream._id} dream={dream} />
        ))}

        {/* Loading skeletons */}
        {(status === "LoadingFirstPage" || status === "LoadingMore") && (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <DreamPreviewSkeleton key={index} />
            ))}
          </>
        )}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-1" />

      {status === "Exhausted" && <ExhaustedList />}
    </div>
  );
}
