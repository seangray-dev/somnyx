"use client";

import { useAtomValue } from "jotai";

import useGetThemePages from "../hooks/use-get-theme-pages";
import { searchStatusAtom } from "../store";
import CategoriesGridContainer from "./categories-grid-container";
import NoSearchResults from "./no-search-results";
import SearchResults from "./search-results";

export default function Content() {
  const { groupedPages, loading } = useGetThemePages();
  const searchStatus = useAtomValue(searchStatusAtom);

  return (
    <>
      {searchStatus === "idle" && (
        <CategoriesGridContainer data={groupedPages} loading={loading} />
      )}
      {searchStatus === "results" && <SearchResults />}
      {searchStatus === "no-results" && <NoSearchResults />}
    </>
  );
}
