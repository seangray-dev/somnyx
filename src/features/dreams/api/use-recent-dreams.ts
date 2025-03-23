import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function useRecentDreams() {
  const data = useQuery(api.queries.dreams.getRecentUserDreams, {});
  const isLoading = data === undefined;

  return { isLoading, data };
}
