"use client";

import Link from "next/link";

import { format, isLastDayOfMonth, isSameMonth, parse } from "date-fns";
import { ChevronRightIcon, LockIcon, LockOpenIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import useDreamCountByMonth from "../api/use-dream-count-by-month";
import useInsightGenerated from "../api/use-insight-generated";

type InsightsCardProps = {
  monthYear: string;
};

export default function InsightsCard({ monthYear }: InsightsCardProps) {
  const { data: insightGenerated, isLoading: insightGeneratedLoading } =
    useInsightGenerated(monthYear);
  const { data: dreamCounts, isLoading: dreamCountLoading } =
    useDreamCountByMonth();

  const date = parse(monthYear, "MM-yyyy", new Date());
  const formattedMonth = format(date, "MMMM yyyy");
  const today = new Date();
  const isCurrentMonth = isSameMonth(date, today);
  const isDisabled = isCurrentMonth && !isLastDayOfMonth(today);
  const dreamCount = dreamCounts?.[monthYear] || 0;
  const hasNoDreams = dreamCount === 0;

  const CardContent = (
    <Card
      className={cn(
        "transition-all duration-150 hover:bg-secondary",
        hasNoDreams || (isDisabled && "cursor-not-allowed opacity-70")
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="flex w-fit items-center gap-2">
              {insightGeneratedLoading ? (
                <Skeleton className="h-6 w-48" />
              ) : (
                <>
                  <div>{formattedMonth}</div>
                  {insightGenerated ? (
                    <LockOpenIcon size={20} className="text-primary" />
                  ) : (
                    <LockIcon size={20} className="text-muted-foreground" />
                  )}
                </>
              )}
            </CardTitle>
            <CardDescription className="pt-2">
              {dreamCountLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                `${dreamCount} dreams logged `
              )}
            </CardDescription>
          </div>
          <ChevronRightIcon size={16} />
        </div>
      </CardHeader>
    </Card>
  );

  if (hasNoDreams) {
    return CardContent;
  }

  return (
    <Link
      href={`/insights/${monthYear}`}
      className={cn(
        "transition-opacity hover:opacity-75",
        isDisabled && "cursor-not-allowed opacity-50 hover:opacity-50"
      )}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
        }
      }}
    >
      {CardContent}
    </Link>
  );
}
