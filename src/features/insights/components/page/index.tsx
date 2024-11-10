"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useFetchInsight from "../../api/use-fetch-insight";
import EmotionalInsights from "./emotional-insights";
import GrowthInsights from "./growth-insights";
import PatternInsights from "./pattern-insights";
import Summary from "./summary";
import ThemesInsightsTab from "./themes-insights";

export default function InsightsPage({ monthYear }: { monthYear: string }) {
  const { data: insight, isLoading } = useFetchInsight(monthYear);

  if (isLoading || !insight) {
    return null;
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
  } = insight.insight;

  const patternsInsights = {
    rolePatterns,
    settingAnalysis,
    socialDynamics,
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
