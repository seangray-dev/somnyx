"use client";

import Link from "next/link";

import { format, parse } from "date-fns";
import { ChevronRightIcon, LockIcon, LockOpenIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import useDreamCountByMonth from "./api/use-dream-count-by-month";
import useInsightGenerated from "./api/use-insight-generated";

export default function InsightsCard({ monthYear }: { monthYear: string }) {
  const { data: insightGenerated, isLoading: insightGeneratedLoading } =
    useInsightGenerated(monthYear);
  const { data: dreamCounts, isLoading: dreamCountLoading } =
    useDreamCountByMonth();

  const [month, year] = monthYear.split("-");
  const formattedDate = format(
    parse(`${year}-${month}-01`, "yyyy-M-dd", new Date()),
    "MMMM yyyy"
  );

  const dreamCount = dreamCounts?.[monthYear] || 0;

  return (
    <Link href={{ pathname: `/insights/${monthYear}` }}>
      <Card className="transition-all duration-150 hover:bg-secondary">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="flex w-fit items-center gap-2">
                {insightGeneratedLoading ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <>
                    <div>{formattedDate}</div>
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
    </Link>
  );
}
