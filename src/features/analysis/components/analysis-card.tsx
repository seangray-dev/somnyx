"use client";

import Loader from "@/components/shared/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useDreamAnalysis from "@/features/analysis/api/use-dream-analysis";

type AnalysisProps = {
  dreamId: string;
};

const renderSection = (
  title: string,
  content: string | undefined,
  isLoading: boolean
) => (
  <div>
    <h4 className="text-xl font-bold">{title}</h4>
    {isLoading ? (
      <div className="flex flex-col gap-2 pt-2">
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
      </div>
    ) : (
      <div className="text-muted-foreground">{content}</div>
    )}
  </div>
);

export default function AnalysisCard({ dreamId }: AnalysisProps) {
  const { data: analysis, isLoading } = useDreamAnalysis({ dreamId });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Analysis</CardTitle>
        <CardDescription className="max-w-[80ch] text-balance text-base">
          {isLoading || !analysis?.summary ? (
            <div className="flex flex-col items-center justify-center gap-2 pt-4 text-muted-foreground">
              <Loader />
              <p className="text-center text-sm">Analyzing your dream...</p>
            </div>
          ) : (
            <div className="text-muted-foreground">{analysis.summary}</div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 text-pretty pt-4 md:grid-cols-2">
        {renderSection(
          "Emotional Breakdown",
          analysis?.emotionalBreakdown,
          isLoading
        )}
        {renderSection(
          "Symbolic Interpretation",
          analysis?.symbolicInterpretation,
          isLoading
        )}
        {renderSection(
          "Underlying Message",
          analysis?.underlyingMessage,
          isLoading
        )}
        {renderSection(
          "Actionable Takeaway",
          analysis?.actionableTakeaway,
          isLoading
        )}
      </CardContent>
    </Card>
  );
}
