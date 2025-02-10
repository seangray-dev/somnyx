"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { useQuery } from "convex/react";
import { SearchIcon } from "lucide-react";
import { useDebounce } from "use-debounce";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";

interface ElementInfo {
  name: string;
  confidence: number;
}

interface CategoryGroup {
  symbols: ElementInfo[];
  themes: ElementInfo[];
}

interface GroupedElements {
  [category: string]: CategoryGroup;
}

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue] = useDebounce(inputValue, 600);
  // @ts-ignore
  const elements = useQuery(api.queries.commonElements.getAllCommonElements);
  const themePages =
    useQuery(api.queries.themePages.searchThemePages, {
      query: debouncedValue || undefined,
    }) ?? [];

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const isSearching = inputValue.length > 0;
  const isLoading = isSearching && themePages === null;

  if (!elements) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  // Group elements by category and type
  const groupedElements = elements.reduce<GroupedElements>((acc, element) => {
    const category =
      element.category.charAt(0).toUpperCase() + element.category.slice(1);

    if (!acc[category]) {
      acc[category] = { symbols: [], themes: [] };
    }

    if (element.type === "symbol") {
      acc[category].symbols.push({
        name: element.name,
        confidence: element.confidence,
      });
    } else {
      acc[category].themes.push({
        name: element.name,
        confidence: element.confidence,
      });
    }

    return acc;
  }, {});

  return (
    <div className="container py-12 md:py-20">
      {/* Hero Section */}
      <header className="mx-auto max-w-[80ch] space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Dream Dictionary
        </h1>
        <p className="text-balance text-lg text-muted-foreground">
          Explore our comprehensive collection of dream symbols and themes, each
          with detailed interpretations backed by psychological and cultural
          insights.
        </p>
      </header>

      {/* Search Bar */}
      <div className="mx-auto mt-8 max-w-xl">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search dream symbols and themes..."
            className="pl-9"
            value={inputValue}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="pt-8">
        {isLoading ? (
          // Loading state for results (only show when actively searching)
          <div className="flex flex-1 flex-col items-center justify-center pt-8">
            <div className="flex animate-pulse flex-col items-center justify-center gap-4">
              <SearchIcon size={36} className="-ml-4" />
              <p className="text-muted-foreground">Searching...</p>
            </div>
          </div>
        ) : isSearching ? (
          // Search Results
          <>
            <h2 className="mb-4 text-lg font-semibold">
              Search Results {themePages.length > 0 && `(${themePages.length})`}
            </h2>
            {themePages.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {themePages.map((page) => (
                  <Card key={page._id} className="overflow-hidden">
                    <div className="space-y-2 p-4">
                      <h3 className="font-semibold capitalize">{page.name}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {page.summary}
                      </p>
                      <div className="pt-2">
                        <Link
                          href={`/dream-meaning/${page.seo_slug}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Read more
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No results found for &quot;{inputValue}&quot;
              </p>
            )}
          </>
        ) : (
          // Categories Grid
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedElements).map(
              ([category, { symbols, themes }]) => (
                <Card key={category} className="overflow-hidden">
                  <div className="space-y-4 p-6">
                    <h2 className="text-2xl font-semibold">{category}</h2>

                    {/* Symbols Section */}
                    {symbols.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Symbols
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {symbols
                            .sort((a, b) => b.confidence - a.confidence)
                            .map(({ name }) => (
                              <Link
                                key={name}
                                href={`/dream-meaning/${name.toLowerCase()}`}
                                className="transition-opacity hover:opacity-80"
                              >
                                <Badge variant="secondary">{name}</Badge>
                              </Link>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Themes Section */}
                    {themes.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Themes
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {themes
                            .sort((a, b) => b.confidence - a.confidence)
                            .map(({ name }) => (
                              <Link
                                key={name}
                                href={`/dream-meaning/${name.toLowerCase()}`}
                                className="transition-opacity hover:opacity-80"
                              >
                                <Badge>{name}</Badge>
                              </Link>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
