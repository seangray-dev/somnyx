import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function useGetMostFrequentEmotion() {
  const data = useQuery(api.queries.getMostFrequentEmotion);
  const isLoading = data === undefined;

  return { isLoading, data };
}
