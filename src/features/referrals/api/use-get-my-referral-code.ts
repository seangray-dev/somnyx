import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

export default function useGetMyReferralCode() {
  // @ts-ignore
  const data = useQuery(api.queries.referrals.getMyReferralCode);
  const isLoading = data === undefined;

  return { isLoading, data };
}
