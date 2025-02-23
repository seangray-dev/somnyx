"use client";

import Link from "next/link";

import {
  differenceInDays,
  endOfMonth,
  format,
  isFuture,
  isLastDayOfMonth,
  parse,
} from "date-fns";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useFetchInsight from "../../api/use-fetch-insight";
import EmotionalInsights from "./emotional-insights";
import GrowthInsights from "./growth-insights";
import NoInsight from "./no-insight";
import PatternInsights from "./pattern-insights";
import Summary from "./summary";
import ThemesInsightsTab from "./themes-insights";

export default function InsightsPage({ monthYear }: { monthYear: string }) {
  const { data: insight, isLoading } = useFetchInsight(monthYear);
  const [month, year] = monthYear.split("-");
  const requestedDate = parse(`${year}-${month}-01`, "yyyy-MM-dd", new Date());
  const today = new Date();
  const monthName = format(requestedDate, "MMMM");
  const lastDayOfMonth = endOfMonth(requestedDate);

  // Check if the requested month is in the future
  if (isFuture(requestedDate)) {
    return (
      <div className="container flex flex-1 flex-col items-center justify-center gap-4">
        <div className="text-center">
          Monthly insights for {monthName} {year} are not available yet.
        </div>
        <Button>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // Check if it's the current month but not the last day
  const isCurrentMonth =
    requestedDate.getMonth() === today.getMonth() &&
    requestedDate.getFullYear() === today.getFullYear();

  if (isCurrentMonth && !isLastDayOfMonth(today)) {
    return (
      <div className="container flex flex-1 flex-col items-center justify-center gap-4">
        <div className="text-center">
          Monthly insights for {monthName} {year} will be available in{" "}
          <span className="font-bold">
            {differenceInDays(lastDayOfMonth, today)}
          </span>{" "}
          days.
        </div>
        <Button>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container flex flex-1 flex-col items-center justify-center gap-4">
        <Loader2Icon size={32} className="animate-spin" />
        <div>Loading Insight</div>
      </div>
    );
  }

  if (!insight) {
    return <NoInsight monthYear={monthYear} />;
  }

  const {
    summary,
    emotionalInsights,
    personalGrowth,
    rolePatterns,
    settingAnalysis,
    socialDynamics,
    symbolism,
    thematicAnalysis,
    temporalPatterns,
  } = insight.insight;

  const patternsInsights = {
    rolePatterns,
    settingAnalysis,
    socialDynamics,
    temporalPatterns,
  };

  const themesInsights = {
    symbolism,
    thematicAnalysis,
  };

  return (
    <div className="container flex flex-col gap-4">
      <Summary summary={summary} monthYear={monthYear} />
      <Tabs defaultValue="emotions" className="w-full">
        <TabsList className="grid h-full w-full grid-cols-2 sm:flex sm:justify-evenly">
          <TabsTrigger value="emotions" className="w-full">
            Emotions
          </TabsTrigger>
          <TabsTrigger value="growth" className="w-full">
            Growth
          </TabsTrigger>
          <TabsTrigger value="patterns" className="w-full">
            Patterns
          </TabsTrigger>
          <TabsTrigger value="themes" className="w-full">
            Themes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="emotions">
          <EmotionalInsights emotionalInsights={emotionalInsights} />
        </TabsContent>
        <TabsContent value="growth">
          <GrowthInsights personalGrowth={personalGrowth} />
        </TabsContent>
        <TabsContent value="patterns">
          <PatternInsights patternsInsights={patternsInsights} />
        </TabsContent>
        <TabsContent value="themes">
          <ThemesInsightsTab themesInsights={themesInsights} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
