import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function useAvailableMonths() {
  const data = useQuery(api.queries.dreams.getAvailbleMonthsForInsights, {});

  const isLoading = data === undefined;

  return { isLoading, data };
}
