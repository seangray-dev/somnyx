import { useQuery } from "convex/react";
import { atom, useAtom } from "jotai";

import { api } from "@/convex/_generated/api";

const emotionsAtom = atom<
  null | { _id: string; name: string; emoji: string }[]
>(null);

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
