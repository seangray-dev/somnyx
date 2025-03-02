import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { DreamFormData } from "../../types";

interface DetailsSectionProps {
  form: UseFormReturn<DreamFormData>;
  editMode?: boolean;
}

export function DetailsSection({ form, editMode }: DetailsSectionProps) {
  return (
    <FormField
      control={form.control}
      name="details"
      render={({ field }) => (
        <FormItem>
          <div className="mb-4">
            <FormLabel>What happened in your dream?</FormLabel>
            <FormDescription className="text-pretty">
              Share your dream story - every detail matters, no matter how small
              or strange it might seem.
            </FormDescription>
          </div>
          <FormControl>
            <Textarea
              placeholder="Start with 'In my dream...' and let the story flow naturally. What did you see, feel, or experience?"
              className="resize-none"
              rows={8}
              {...field}
              readOnly={editMode}
              disabled={editMode}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
