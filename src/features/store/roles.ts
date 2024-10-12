import { useQuery } from "convex/react";
import { atom, useAtom } from "jotai";

import { api } from "@/convex/_generated/api";

const rolesAtom = atom<
  null | { _id: string; name: string; description: string }[]
>(null);

export const useGetAllRoles = () => {
  const [roles, setRoles] = useAtom(rolesAtom);

  const fetchedRoles = useQuery(api.queries.roles.getAllRoles);

  if (fetchedRoles && !roles) {
    setRoles(fetchedRoles);
  }

  const isLoading = roles === undefined;

  return { roles, isLoading };
};

export const useRoleById = (id: string) => {
  const { roles, isLoading } = useGetAllRoles();

  const role = roles?.find((r) => r._id === id);

  return { role, isLoading };
};
