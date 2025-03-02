import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export type UpdateDreamInput = {
  id: Id<"dreams">;
  details?: string;
  date?: string;
  isRecurring?: boolean;
  isLucid?: boolean;
  role?: Id<"roles">;
  people?: string[];
  places?: string[];
  things?: string[];
  emotions?: Id<"emotions">[];
  themes?: string[];
  symbols?: string[];
  isPublic?: boolean;
  title?: string;
};

export function useUpdateDream() {
  const updateDream = useMutation(api.mutations.dreams.updateDream);

  const handleUpdateDream = async (input: UpdateDreamInput) => {
    try {
      await updateDream(input);
      toast.success("Dream updated successfully!");
      return true;
    } catch (err) {
      toast.error("Failed to update dream", {
        description: "Please try again later.",
      });
      return false;
    }
  };

  return handleUpdateDream;
}
