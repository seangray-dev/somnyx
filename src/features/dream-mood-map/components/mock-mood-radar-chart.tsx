import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { Badge } from "@/components/ui/badge";
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

import { chartConfig } from "./chart-config";

const mockData = [
  { name: "Happy", dreams: 12 },
  { name: "Sad", dreams: 9 },
  { name: "Angry", dreams: 4 },
  { name: "Fear", dreams: 9 },
  { name: "Calm", dreams: 7 },
  { name: "Love", dreams: 6 },
  { name: "Confused", dreams: 5 },
  { name: "Nervous", dreams: 9 },
  { name: "Excited", dreams: 10 },
  { name: "Awkward", dreams: 8 },
  { name: "Desire", dreams: 6 },
  { name: "Disgust", dreams: 5 },
];

export default function MockMoodRadarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dream Mood Map</CardTitle>
        <CardDescription>No dreams logged yet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className="pointer-events-none mx-auto max-h-[350px] blur-[2px]"
          >
            <RadarChart data={mockData}>
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
          <Badge
            variant={"secondary"}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm"
          >
            Log some dreams to see your dream mood map.
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
