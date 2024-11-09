"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useFetchInsight from "../../api/use-fetch-insight";
import EmotionalInsights from "./emotional-insights";
import Summary from "./summary";
import GrowthInsights from "./growth-insights";

export default function InsightsPage({ monthYear }: { monthYear: string }) {
  const { data: insight, isLoading } = useFetchInsight(monthYear);

  if (isLoading || !insight) {
    return null;
  }

  const { summary, emotionalInsights, personalGrowth } = insight.insight;

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
      </Tabs>
    </div>
  );
}
