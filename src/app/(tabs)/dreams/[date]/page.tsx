"use client";

import Link from "next/link";

import { useQuery } from "convex/react";
import { format, parseISO } from "date-fns";

import { api } from "@/convex/_generated/api";
import { DreamPreviewCard } from "@/features/dreamscape/components/dream-preview-card";

export default function DreamsByDatePage({
  params,
}: {
  params: { date: string };
}) {
  const dreams = useQuery(api.queries.dreams.getDreamsByDate, {
    date: params.date,
  });
  const formattedDate = format(parseISO(params.date), "MMMM d, yyyy");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dreams from {formattedDate}</h1>
        <Link
          href="/dreams"
          className="text-primary transition-colors hover:text-primary/80"
        >
          ← Back to Calendar
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dreams?.map((dream) => (
          <DreamPreviewCard key={dream._id} dream={dream} />
        ))}

        {dreams?.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted-foreground">
            No public dreams found for this date.
          </p>
        )}
      </div>
    </div>
  );
}
