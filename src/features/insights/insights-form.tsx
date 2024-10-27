"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, isLastDayOfMonth, isSameMonth, parse } from "date-fns";
import { LockIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useAvailableMonths from "./api/use-available-months";

const formSchema = z.object({
  month: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function InsightsForm() {
  const [open, setOpen] = useState(false);
  const { data: months, isLoading } = useAvailableMonths();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const formatMonthYear = (monthYear: string) => {
    const [month, year] = monthYear.split("-");
    const date = parse(`${year}-${month}-01`, "yyyy-MM-dd", new Date());
    return format(date, "MMMM yyyy");
  };

  const canGenerateCurrentMonthInsights = () => {
    const today = new Date();
    return isLastDayOfMonth(today);
  };

  const isCurrentMonth = (monthYear: string) => {
    const [month, year] = monthYear.split("-");
    const comparisonDate = new Date(Number(year), Number(month) - 1, 1);
    return isSameMonth(new Date(), comparisonDate);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Insight</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate a new insight</DialogTitle>
          <DialogDescription>
            Select the month you would like to generate an insight for.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months?.map((monthYear) => {
                        const isCurrent = isCurrentMonth(monthYear);
                        const disabled =
                          isCurrent && !canGenerateCurrentMonthInsights();

                        return (
                          <SelectItem
                            key={monthYear}
                            value={monthYear}
                            disabled={disabled}
                          >
                            <div className="flex items-center gap-4">
                              <span>{formatMonthYear(monthYear)}</span>
                              {disabled && (
                                <div className="inline-flex items-center gap-1 text-xs">
                                  <LockIcon size={12} />
                                  <span>Unlocks at the end of the month</span>
                                </div>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Get My Insights
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
