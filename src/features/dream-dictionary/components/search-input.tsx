"use client";

import { useCallback, useEffect, useState } from "react";

import { useAtomValue } from "jotai";
import { Loader2Icon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

import { useSearchTehemPages } from "../hooks/use-search-theme-pages";
import { searchStatusAtom } from "../store";

export default function SearchInput() {
  const { setQuery } = useSearchTehemPages();
  const searchStatus = useAtomValue(searchStatusAtom);

  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    setQuery(debouncedValue);
  }, [debouncedValue, setQuery]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl pb-12 pt-8">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search dream symbols and themes..."
          className="pl-9"
          onChange={handleSearch}
        />
        {searchStatus === "searching" && (
          <Loader2Icon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
