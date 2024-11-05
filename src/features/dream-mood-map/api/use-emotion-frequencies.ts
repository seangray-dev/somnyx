import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function useEmotionFrequencies() {
  const data = useQuery(api.queries.getEmotionFrequencies);
  const isLoading = data === undefined;

  return { isLoading, data };
}