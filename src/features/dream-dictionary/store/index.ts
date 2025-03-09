import { atom } from "jotai";

import { Doc } from "@/convex/_generated/dataModel";

type SearchStatus = "idle" | "searching" | "results" | "no-results";

export const searchAtom = atom("");
export const searchStatusAtom = atom<SearchStatus>("idle");
export const searchResultsAtom = atom<Doc<"themePages">[]>([]);
