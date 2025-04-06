import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

export default function useGetReferrerByCode(code: string) {
  // @ts-ignore
  const data = useQuery(api.queries.referrals.getReferrerByCode, {
    code,
  });
  const isLoading = data === undefined;

  return { isLoading, data };
}
