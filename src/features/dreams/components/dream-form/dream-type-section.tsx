import { UseFormReturn } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { DreamFormData } from "../../types";

interface DreamTypeSectionProps {
  form: UseFormReturn<DreamFormData>;
  editMode?: boolean;
}

export function DreamTypeSection({ form, editMode }: DreamTypeSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="isRecurring"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Recurring Dream</FormLabel>
              <FormDescription className="text-pretty">
                I&apos;ve had this dream (or very similar) before
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isLucid"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={editMode}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Lucid Dream</FormLabel>
              <FormDescription className="text-pretty">
                I was aware I was dreaming during the experience
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
