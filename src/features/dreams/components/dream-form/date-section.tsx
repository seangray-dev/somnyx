import * as React from "react";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { DreamFormData } from "../../types";

interface DateSectionProps {
  form: UseFormReturn<DreamFormData>;
  minDate: Date;
  editMode?: boolean;
}

export function DateSection({ form, minDate, editMode }: DateSectionProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>When did you have this dream?</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={editMode}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="pointer-events-auto w-auto p-0"
              align="center"
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
              onOpenAutoFocus={(e) => {
                e.preventDefault();
              }}
            >
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
                disabled={(date: Date): boolean =>
                  Boolean(date > new Date() || date < minDate || editMode)
                }
                initialFocus
                onDayClick={(day, modifiers, e) => {
                  e.stopPropagation();
                }}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
