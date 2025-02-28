import { atom } from "jotai";

export type ThemePageMap = {
  [key: string]: string; // name -> seo_slug mapping
};

export const themePageMapAtom = atom<ThemePageMap>({});
