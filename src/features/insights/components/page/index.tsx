"use client";

import { Loader2Icon } from "lucide-react";

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
