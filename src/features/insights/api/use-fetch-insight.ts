// hooks/useInsightGenerated.ts
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function useFetchInsight(monthYear: string) {
  const data = useQuery(api.queries.insights.getInsightForMonth, {
    monthYear,
  });
  const isLoading = data === undefined;

  return { isLoading, data };
}
