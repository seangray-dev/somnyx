import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export default function useUserCredits() {
  const user = useQuery(api.users.getMyUser);
  const data = useQuery(api.users.getUserCredits, {
    userId: user?.userId!,
  });
  const isLoading = data === undefined;

  return { isLoading, data };
}
