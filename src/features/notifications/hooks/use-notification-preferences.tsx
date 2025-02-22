import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

type UpdatePreferencesArgs = {
  dailyReminderTime?: number;
  enabledTypes: string[];
};

export default function useNotificationPreferences() {
  // @ts-ignore
  const user = useQuery(api.users.getMyUser);
  const data = useQuery(
    // @ts-ignore
    api.queries.notificationPreferences.getNotificationPreferences,
    {
      userId: user?.userId!,
    }
  );
  // Move useMutation to top level
  const updatePreferences = useMutation(
    api.mutations.notificationPreferences.updateNotificationPreferences
  );

  const isLoading = data === undefined;

  const savePreferences = async (updates: UpdatePreferencesArgs) => {
    if (!user?.userId) throw new Error("User not found");

    return await updatePreferences({
      userId: user.userId,
      ...updates,
    });
  };

  return { isLoading, data, savePreferences };
}
