import { useQuery } from "convex/react";
import { atom, useAtom } from "jotai";

import { api } from "@/convex/_generated/api";

type EmotionWithCount = {
  name: string;
  emoji: string;
  dreams: number;
};

type Emotion = {
  _id: string;
  name: string;
  emoji: string;
};

const emotionsAtom = atom<Emotion[] | null>(null);

export const useGetAllEmotions = () => {
  const [emotions, setEmotions] = useAtom(emotionsAtom);

  const fetchedEmotions = useQuery(api.queries.getAllEmotions);

  if (fetchedEmotions && !emotions) {
    setEmotions(fetchedEmotions);
  }

  const isLoading = emotions === undefined;

  return { emotions, isLoading };
};

export const useEmotionById = (id: string) => {
  const { emotions, isLoading } = useGetAllEmotions();

  const emotion = emotions?.find((e) => e._id === id);

  return { emotion, isLoading };
};

const emotionFrequenciesAtom = atom<EmotionWithCount[] | null>(null);

export default function useEmotionFrequencies() {
  const [emotionCounts, setEmotionCounts] = useAtom(emotionFrequenciesAtom);
  const fetchedEmotionCounts = useQuery(api.queries.getEmotionFrequencies);
  const { emotions } = useGetAllEmotions();

  if (fetchedEmotionCounts && emotions && !emotionCounts) {
    const countsMap: Record<string, number> = {};
    fetchedEmotionCounts.forEach((count) => {
      countsMap[count.name] = count.dreams;
    });

    const allEmotionsWithCounts = emotions
      .map((emotion) => ({
        name: emotion.name,
        emoji: emotion.emoji,
        dreams: countsMap[emotion.name] || 0,
      }))
      .sort((a, b) => b.dreams - a.dreams);

    setEmotionCounts(allEmotionsWithCounts);
  }

  const isLoading = emotionCounts === undefined;

  return {
    data: emotionCounts,
    isLoading,
  };
}
