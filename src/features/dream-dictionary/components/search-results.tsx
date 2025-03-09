"use client";

import { useAtomValue } from "jotai";

import { Doc } from "@/convex/_generated/dataModel";

import { searchResultsAtom } from "../store";
import SearchResultCard from "./search-results-card";

export default function SearchResults() {
  const results = useAtomValue(searchResultsAtom);

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {results.map((result: Doc<"themePages">) => (
        <SearchResultCard
          key={result._id}
          title={result.name}
          description={result.summary}
          type={result.type}
        />
      ))}
    </div>
  );
}
