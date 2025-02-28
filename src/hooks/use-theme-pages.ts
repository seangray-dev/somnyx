"use client";

import { useEffect } from "react";

import { useQuery } from "convex/react";
import { useSetAtom } from "jotai";

import { themePageMapAtom } from "@/atoms/theme-pages";
import { api } from "@/convex/_generated/api";

export function useThemePages() {
  const setThemePageMap = useSetAtom(themePageMapAtom);
  const mapping = useQuery(api.queries.themePages.getThemePageMapping);

  useEffect(() => {
    if (mapping) {
      setThemePageMap(mapping);
    }
  }, [mapping, setThemePageMap]);
}
