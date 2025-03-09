import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SearchResultCardProps = {
  title: string;
  description?: string;
  type?: "symbol" | "theme";
};

export default function SearchResultCard({
  title,
  description,
  type = "symbol",
}: SearchResultCardProps) {
  return (
    <Link href={`/dream-dictionary/${title.toLowerCase()}-dream-meaning`}>
      <Card className="transition-all hover:bg-muted/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-1">{title}</CardTitle>
            <Badge variant={type === "symbol" ? "default" : "secondary"}>
              {type}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
