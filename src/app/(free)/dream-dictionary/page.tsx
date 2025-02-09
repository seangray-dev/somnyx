"use client";

import Link from "next/link";

import { useQuery } from "convex/react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  const elements = useQuery(api.queries.commonElements.getAllCommonElements);

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

      {/* Categories Grid */}
      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
