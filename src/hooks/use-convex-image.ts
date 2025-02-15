import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useGetThemePageImageUrl(
  storageId: Id<"_storage"> | undefined
): string | null {
  const url =
    // @ts-ignore
    useQuery(api.queries.themePages.getThemePageImageUrl, { storageId }) ??
    null;
  return url;
}

export function useGetAnalysisImageUrl(
  storageId: Id<"_storage"> | undefined
): string | null {
  const url =
    // @ts-ignore
    useQuery(api.queries.analysis.getAnalysisImageUrl, { storageId }) ?? null;
  return url;
}
