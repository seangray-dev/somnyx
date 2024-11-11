// hooks/useInsightGenerated.ts
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function useInsightGenerated(monthYear: string) {
  const data = useQuery(api.queries.insights.checkInsightGenerated, {
    monthYear,
  });
  const isLoading = data === undefined;

  return { isLoading, data: data ?? false };
}
