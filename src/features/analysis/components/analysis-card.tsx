"use client";

import Link from "next/link";
import { useState } from "react";

import { useMutation, useQuery } from "convex/react";
import { SparklesIcon } from "lucide-react";

import Loader from "@/components/shared/loader";
import LoadingButton from "@/components/shared/loading-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CREDIT_COSTS } from "@/convex/util";
import useDreamAnalysis from "@/features/analysis/api/use-dream-analysis";
import useUserCredits from "@/features/credits/api/use-user-credits";

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
      </div>
    ) : content ? (
      <div className="text-muted-foreground">{content}</div>
    ) : (
      <div className="flex flex-col gap-2 pt-2">
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
      </div>
    )}
  </div>
);

export default function AnalysisCard({ dreamId }: AnalysisProps) {
  const {
    data: analysis,
    isLoading,
    noAnalysis,
  } = useDreamAnalysis({
    dreamId,
  });
  const [generateAnalyisLoading, setGenerateAnalyisLoading] = useState(false);
  const { data: userCredits } = useUserCredits();
  const user = useQuery(api.users.getMyUser);
  const hasSufficientCredits = userCredits! >= CREDIT_COSTS.ANALYSIS;
  const neededCredits = CREDIT_COSTS.ANALYSIS - userCredits!;
  const generateAnalyis = useMutation(api.mutations.generateAnalysis);

  const handleGenerateAnalysis = async () => {
    setGenerateAnalyisLoading(true);
    await generateAnalyis({
      dreamId: dreamId as Id<"dreams">,
      userId: user?.userId!,
    });
    setGenerateAnalyisLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 pt-4 text-muted-foreground">
          <Loader />
          <p className="text-center text-sm">Analyzing your dream...</p>
        </div>
      );
    }

    if (noAnalysis) {
      return (
        <div className="flex flex-col gap-8">
          <p className="text-muted-foreground">
            No analysis was generated for this dream yet.
          </p>
          {!hasSufficientCredits ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <Link
                href={"/#pricing"}
                className={buttonVariants({ variant: "default" })}
              >
                Purchase Credits
              </Link>
              <p className="text-sm">
                You need {neededCredits} more credits to analyze this dream.
              </p>
            </div>
          ) : (
            <LoadingButton
              disabled={generateAnalyisLoading}
              isLoading={generateAnalyisLoading}
              onClick={handleGenerateAnalysis}
            >
              <SparklesIcon size={16} className="mr-2" />
              Analyze Dream ({CREDIT_COSTS.ANALYSIS} Credits)
            </LoadingButton>
          )}
        </div>
      );
    }

    return <div className="text-muted-foreground">{analysis?.summary}</div>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Analysis</CardTitle>
        <CardDescription className="text-balance text-base">
          {renderContent()}
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
