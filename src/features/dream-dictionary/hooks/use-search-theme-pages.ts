import { useEffect } from "react";

import { useQuery } from "convex/react";
import { useAtom } from "jotai";

import { api } from "@/convex/_generated/api";

import { searchAtom, searchResultsAtom, searchStatusAtom } from "../store";

export function useSearchTehemPages() {
  const [query, setQuery] = useAtom(searchAtom);
  const [status, setStatus] = useAtom(searchStatusAtom);
  const [, setResults] = useAtom(searchResultsAtom);

  const searchResults = useQuery(
    api.queries.themePages.searchThemePages,
    query ? { query } : "skip"
  );

  useEffect(() => {
    if (!query) {
      setStatus("idle");
      setResults([]);
      return;
    }

    if (searchResults === undefined) {
      setStatus("searching");
      return;
    }

    if (searchResults.length === 0) {
      setStatus("no-results");
      return;
    } else {
      setResults(searchResults);
      setStatus("results");
    }
  }, [query, searchResults, setQuery, setResults, setStatus]);

  return { setQuery };
}
