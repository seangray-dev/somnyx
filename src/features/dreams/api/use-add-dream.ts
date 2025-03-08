import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";

import { DreamFormData } from "../types";

export function useAddDream() {
  // ts-ignore
  const addNewDream = useMutation(api.mutations.dreams.addNewDream);

  const handleAddDream = async (data: DreamFormData) => {
    try {
      await addNewDream({
        date: data.date.toISOString().split("T")[0],
        isRecurring: data.isRecurring,
        isLucid: data.isLucid,
        emotions: data.emotions,
        role: data.role,
        people: data.people,
        places: data.places,
        things: data.things,
        details: data.details,
        withAnalysis: data.withAnalysis,
      });
      toast.success("Dream added successfully!");
      return true;
    } catch (err) {
      toast.error("Failed to add dream", {
        description: "Please try again later.",
      });
      return false;
    }
  };

  return { addDream: handleAddDream };
}
