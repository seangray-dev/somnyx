import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function useGetTotalDreamsCount() {
  const data = useQuery(api.queries.getTotalDreamsCount);
  const isLoading = data === undefined;

  return { isLoading, data };
}
