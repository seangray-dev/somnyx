import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

export default function useGetMyReferrals() {
  // @ts-ignore
  const data = useQuery(api.queries.referrals.getMyReferrals);
  const isLoading = data === undefined;

  return { isLoading, data };
}
