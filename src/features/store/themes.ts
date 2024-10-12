import { useQuery } from "convex/react";
import { atom, useAtom } from "jotai";

import { api } from "@/convex/_generated/api";

const themesAtom = atom<
  null | { _id: string; name: string; description: string }[]
>(null);

export const useGetAllThemes = () => {
  const [themes, setThemes] = useAtom(themesAtom);

  const fetchedThemes = useQuery(api.queries.themes.getAllThemes);

  if (fetchedThemes && !themes) {
    setThemes(fetchedThemes);
  }

  const isLoading = themes === undefined;

  return { themes, isLoading };
};

export const useRoleById = (id: string) => {
  const { themes, isLoading } = useGetAllThemes();

  const theme = themes?.find((t) => t._id === id);

  return { theme, isLoading };
};
