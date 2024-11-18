"use client";

import Link from "next/link";

import { formatDate } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BlogPost } from "../types";

export function BlogPostCard({ title, description, slug, date }: BlogPost) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">{title}</CardTitle>
        <CardDescription className="flex flex-col gap-2 text-pretty">
          <span>{description}</span>
          <span className="text-xs text-muted-foreground">
            {formatDate(date, "MMMM d, yyyy")}
          </span>
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex flex-col gap-4">
        <Link className="w-full" href={{ pathname: `/blog/${slug}` }}>
          <Button variant={"secondary"} size={"sm"} className="w-full">
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
