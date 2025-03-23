import { useQuery } from "convex/react";
import { atom } from "jotai";

import { api } from "@/convex/_generated/api";

export const isAdminAtom = atom<boolean>(false);

export function useIsAdmin() {
  // @ts-ignore
  const isAdmin = useQuery(api.users.isUserAdmin);

  return {
    isAdmin: isAdmin ?? false,
    isLoading: isAdmin === undefined,
  };
}
