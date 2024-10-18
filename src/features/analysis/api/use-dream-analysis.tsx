import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function useDreamAnalysis(params: { dreamId: string }) {
  const data = useQuery(api.queries.analysis.getAnalysisByDreamId, {
    dreamId: params.dreamId as Id<"dreams">,
  });
  const isLoading = data === undefined;

  return { isLoading, data };
}
