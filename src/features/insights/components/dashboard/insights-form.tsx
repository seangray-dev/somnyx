"use client";

import Link from "next/link";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { format, isLastDayOfMonth, isSameMonth, parse } from "date-fns";
import { LockIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import LoadingButton from "@/components/shared/loading-button";
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
import { api } from "@/convex/_generated/api";
import { CREDIT_COSTS } from "@/convex/util";
import useUserCredits from "@/features/credits/api/use-user-credits";

import useAvailableMonths from "../../api/use-available-months";
import useInsightGenerated from "../../api/use-insight-generated";

const formSchema = z.object({
  monthYear: z.string().min(1, "Please select a month"),
});

export default function InsightsForm() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // @ts-ignore
  const generateInsight = useMutation(api.mutations.generateInsight);
  const { data: months } = useAvailableMonths();
  const { data: userCredits } = useUserCredits();
  const hasSufficientCredits = (userCredits ?? 0) >= CREDIT_COSTS.INSIGHT;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthYear: "",
    },
  });

  const generatedStatusMap = Object.fromEntries(
    months?.map((monthYear) => [monthYear, useInsightGenerated(monthYear)]) ??
      []
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const currentCredits = userCredits ?? 0;
    if (!hasSufficientCredits) {
      const neededCredits = CREDIT_COSTS.INSIGHT - currentCredits;
      toast.error(
        <div>
          Insufficient credits. You need {neededCredits} more credits.
          <br />
          <Link
            href="/#pricing"
            className="text-destructive-foreground underline"
          >
            Get more credits
          </Link>
        </div>
      );
      return;
    }

    try {
      setIsLoading(true);
      await generateInsight({ monthYear: values.monthYear });
      toast.success("Insight generated successfully!");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate insight");
    } finally {
      setIsLoading(false);
    }
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
        <Button size={"lg"} variant="outline" className="w-full capitalize">
          Generate insight
          <br className="sm:hidden" /> for different month
        </Button>
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
              name="monthYear"
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
                        const { data: isGenerated } =
                          generatedStatusMap[monthYear];
                        const disabled =
                          isCurrent && !canGenerateCurrentMonthInsights();

                        if (isGenerated) return null;

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
            <LoadingButton
              isLoading={isLoading}
              className="w-full"
              type="submit"
            >
              Generate Insight ({CREDIT_COSTS.INSIGHT} Credits)
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
