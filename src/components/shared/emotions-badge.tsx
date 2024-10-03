"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Badge } from "../ui/badge";

export default function EmotionsBadge({ emotionId }: { emotionId: string }) {
  const emotion = useQuery(api.queries.emotions.getEmotionById, {
    id: emotionId as Id<"emotions">,
  });

  if (!emotion) {
    return null;
  }

  const { emoji, name } = emotion;

  return (
    <Badge variant={"outline"} className="flex items-center gap-2 px-3 py-2">
      <div className="flex items-center gap-2 hover:cursor-default">
        <div>{emoji}</div>
        <div>{name}</div>
      </div>
    </Badge>
  );
}
