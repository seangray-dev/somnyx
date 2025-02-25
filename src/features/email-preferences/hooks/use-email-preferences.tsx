import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

type UpdatePreferencesArgs = {
  dreamReminders: boolean;
  monthlyInsights: boolean;
  newFeatures: boolean;
};

export default function useNotificationPreferences() {
  // @ts-ignore
  const user = useQuery(api.users.getMyUser);
  const data = useQuery(
    // @ts-ignore
    api.queries.emails.getUserEmailPreferences,
    {
      userId: user?.userId!,
    }
  );
  const updatePreferences = useMutation(
    api.mutations.emails.updateEmailPreferences
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
