import { UseFormReturn } from "react-hook-form";

import Loader from "@/components/shared/loader";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Id } from "@/convex/_generated/dataModel";
import { useGetAllEmotions } from "@/features/store/emotions";

import { DreamFormData } from "../../types";

interface EmotionsSectionProps {
  form: UseFormReturn<DreamFormData>;
  editMode?: boolean;
}

export function EmotionsSection({ form, editMode }: EmotionsSectionProps) {
  const { emotions, isLoading: emotionsLoading } = useGetAllEmotions();

  return (
    <FormField
      control={form.control}
      name="emotions"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel>How did the dream make you feel?</FormLabel>
            <FormDescription className="text-pretty">
              Select all emotions you experienced - this helps create more
              accurate interpretations.
            </FormDescription>
          </div>
          {emotionsLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader />
              <div>Loading emotions...</div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {emotions?.map((emotion) => (
                <FormField
                  key={emotion._id}
                  control={form.control}
                  name="emotions"
                  render={({ field }) => {
                    const emotionId = emotion._id as Id<"emotions">;
                    return (
                      <FormItem key={emotionId}>
                        <FormLabel>
                          <Badge
                            variant={"outline"}
                            className={`flex items-center px-3 py-2 ${
                              field.value?.includes(emotionId)
                                ? "bg-primary text-primary-foreground"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div>{emotion.emoji}</div>
                              <div>{emotion.name}</div>
                            </div>
                            <FormControl>
                              <Checkbox
                                className="sr-only border-none"
                                checked={field.value?.includes(emotionId)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        emotionId,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== emotionId
                                        )
                                      );
                                }}
                                disabled={editMode}
                              />
                            </FormControl>
                          </Badge>
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
