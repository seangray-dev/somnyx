import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";

import { CategoryGroup } from "../types";

interface CategoryCardProps {
  category: Doc<"themeCategories">;
  pages: CategoryGroup;
}

export default function CategoryCard({ category, pages }: CategoryCardProps) {
  const { symbols, themes } = pages;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">{category.displayName}</CardTitle>
        <CardDescription className="text-pretty">
          {category.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {symbols.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Symbols
            </h3>
            <div className="flex flex-wrap gap-2">
              {symbols.map((symbol) => (
                <Link
                  key={symbol._id}
                  href={`/dream-dictionary/${symbol.seo_slug}`}
                  className="transition-opacity hover:opacity-80"
                >
                  <Badge
                    variant="secondary"
                    className="px-4 py-1.5 text-sm hover:underline"
                  >
                    {symbol.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {themes.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Themes
            </h3>
            <div className="flex flex-wrap gap-2">
              {themes.map((theme) => (
                <Link
                  key={theme._id}
                  href={`/dream-dictionary/${theme.seo_slug}`}
                  className="transition-opacity hover:opacity-80"
                >
                  <Badge className="px-4 py-1.5 text-sm hover:underline">
                    {theme.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
