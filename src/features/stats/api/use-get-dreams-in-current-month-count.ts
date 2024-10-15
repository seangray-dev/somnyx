import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function useGetDreamsInCurrentMonthCount() {
  const data = useQuery(api.queries.getDreamsInCurrentMonthCount);
  const isLoading = data === undefined;

  return { isLoading, data };
}
