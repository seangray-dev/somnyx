"use client";

import { useEmotionById } from "@/features/store/emotions";

import { Badge } from "../ui/badge";

export default function EmotionsBadge({ emotionId }: { emotionId: string }) {
  const { emotion, isLoading } = useEmotionById(emotionId);

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
