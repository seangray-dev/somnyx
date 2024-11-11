import { useState } from "react";

import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useGenerateInsight() {
  const generateInsight = useMutation(api.mutations.insights.generateInsight);
  const [scheduledFunctionId, setScheduledFunctionId] =
    useState<Id<"_scheduled_functions"> | null>(null);

  const scheduledFunction = useQuery(
    api.queries.scheduler.getScheduledFunction,
    scheduledFunctionId ? { id: scheduledFunctionId } : "skip"
  );

  const generate = async (monthYear: string) => {
    try {
      const functionId = await generateInsight({ monthYear });
      setScheduledFunctionId(functionId);
    } catch (error) {
      console.error("Failed to start generation:", error);
      throw error;
    }
  };

  const status = scheduledFunction?.state?.kind || "idle";
  const isGenerating = status === "pending" || status === "inProgress";

  return {
    generate,
    isGenerating,
    status,
  };
}
