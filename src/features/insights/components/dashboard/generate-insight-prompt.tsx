import Link from "next/link";
import { useState } from "react";

import { useMutation } from "convex/react";
import { differenceInDays, endOfMonth, format } from "date-fns";
import { ClockIcon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";

import LoadingButton from "@/components/shared/loading-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { CREDIT_COSTS } from "@/convex/util";
import useUserCredits from "@/features/credits/api/use-user-credits";

import InsightsForm from "./insights-form";

export default function GenerateInsightPrompt() {
  const [isLoading, setIsLoading] = useState(false);
  // @ts-ignore
  const generateInsight = useMutation(api.mutations.generateInsight);
  const { data: userCredits } = useUserCredits();
  const today = new Date();
  const currentMonth = format(today, "MMMM yyyy");
  const monthYear = format(today, "MM-yyyy");
  const endOfCurrentMonth = endOfMonth(today);
  const daysRemaining = differenceInDays(endOfCurrentMonth, today);
  const hasSufficientCredits = (userCredits ?? 0) >= CREDIT_COSTS.INSIGHT;

  const handleGenerateInsight = async () => {
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
      await generateInsight({ monthYear });
      toast.success("Insight generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate insight");
    } finally {
      setIsLoading(false);
    }
  };

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
      {daysRemaining !== 0 && (
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
        <LoadingButton
          size={"lg"}
          className="w-full capitalize"
          disabled={daysRemaining !== 0}
          isLoading={isLoading}
          onClick={handleGenerateInsight}
        >
          <div>
            <span>
              Generate {currentMonth} <br className="sm:hidden" /> insight{" "}
            </span>
            <span>({CREDIT_COSTS.INSIGHT} credits)</span>
          </div>
        </LoadingButton>
        <InsightsForm />
      </CardFooter>
    </Card>
  );
}
