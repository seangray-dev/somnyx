import { useSession } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useDreamAccess(dreamId: string) {
  const { isSignedIn, session } = useSession();
  const userId = session?.user?.id;

  // @ts-ignore - TODO: Fix type issue with hasAccessToDream query
  const hasAccess = useQuery(api.queries.dreams.hasAccessToDream, {
    dreamId: dreamId as Id<"dreams">,
    userId: userId ?? "",
  });

  return {
    hasAccess,
    isSignedIn,
    userId,
  };
}
