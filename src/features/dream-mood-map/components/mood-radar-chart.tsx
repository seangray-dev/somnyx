"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import useEmotionFrequencies from "../api/use-emotion-frequencies";
import { chartConfig } from "./chart-config";
import MockMoodRadarChart from "./mock-mood-radar-chart";

export default function MoodRadarChart() {
  const { data: emotions, isLoading } = useEmotionFrequencies();

  if (!emotions || emotions.length === 0) {
    return <MockMoodRadarChart />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dream Mood Map</CardTitle>
        <CardDescription>
          Distribution of emotions in your dreams
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto max-h-[250px]"
          >
            <RadarChart data={emotions}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="name" />
              <PolarGrid />
              <Radar
                dataKey="dreams"
                fill="var(--color-emotions)"
                fillOpacity={0.6}
                dot={{
                  r: 4,
                  fillOpacity: 1,
                }}
              />
            </RadarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
