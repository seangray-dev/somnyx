import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function useDreamCountByMonth() {
  const data = useQuery(api.queries.dreams.getDreamCountByMonth, {});
  const isLoading = data === undefined;

  return { isLoading, data };
}
