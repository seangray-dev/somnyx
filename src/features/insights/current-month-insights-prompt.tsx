import { differenceInDays, endOfMonth, format } from "date-fns";
import { ClockIcon, SparklesIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CREDIT_COSTS } from "@/convex/util";

import InsightsForm from "./insights-form";

export default function CurrentMonthInsightsPrompt() {
  const today = new Date();
  const currentMonth = format(today, "MMMM yyyy");
  const endOfCurrentMonth = endOfMonth(today);
  const daysRemaining = differenceInDays(endOfCurrentMonth, today);
  const insightUnavailable = daysRemaining !== 0;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          <SparklesIcon className="-mt-1 mr-2 inline-flex items-center text-primary" />
          Monthly Insight
        </CardTitle>
        <CardDescription className="pt-2 text-base">
          Get AI-powered insights about your dream patterns, emotional journey,
          and personal growth for {currentMonth}
        </CardDescription>
      </CardHeader>
      {insightUnavailable && (
        <CardContent>
          <Badge
            variant={"secondary"}
            className="flex w-fit items-center gap-2"
          >
            <ClockIcon size={18} />
            <p className="text-xs sm:text-sm">
              Next insight available in {daysRemaining}{" "}
              {daysRemaining === 1 ? "day" : "days"}
            </p>
          </Badge>
        </CardContent>
      )}
      <CardFooter className="flex flex-col gap-2 capitalize">
        <Button
          size={"lg"}
          className="w-full cursor-not-allowed"
          disabled={insightUnavailable}
        >
          Generate {currentMonth} insight <br className="sm:hidden" />(
          {CREDIT_COSTS.INSIGHT} credits)
        </Button>
        <InsightsForm />
      </CardFooter>
    </Card>
  );
}
