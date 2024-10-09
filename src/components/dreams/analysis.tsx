"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";

type AnalysisProps = {
  analysis: Preloaded<typeof api.queries.analysis.getAnalysisByDreamId>;
};

export default function Analysis(props: AnalysisProps) {
  const analysis = usePreloadedQuery(props.analysis);

  if (!analysis) {
    return null;
  }

  const {
    summary,
    emotionalBreakdown,
    symbolicInterpretation,
    underlyingMessage,
    actionableTakeaway,
  } = analysis;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Analysis</CardTitle>
        <CardDescription className="max-w-[80ch] text-balance text-base">
          {summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 text-pretty pt-4 md:grid-cols-2">
        <div>
          <h4 className="text-xl font-bold">Emotional Breakdown</h4>
          <div className="text-muted-foreground">{emotionalBreakdown}</div>
        </div>
        <div>
          <h4 className="text-xl font-bold">Symbolic Interpretation</h4>
          <div className="text-muted-foreground">{symbolicInterpretation}</div>
        </div>
        <div>
          <h4 className="text-xl font-bold">Underlying Message</h4>
          <div className="text-muted-foreground">{underlyingMessage}</div>
        </div>
        <div>
          <h4 className="text-xl font-bold">Actionable Takeaway</h4>
          <div className="text-muted-foreground">{actionableTakeaway}</div>
        </div>
      </CardContent>
    </Card>
  );
}
