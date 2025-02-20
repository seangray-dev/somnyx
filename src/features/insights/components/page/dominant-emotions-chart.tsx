import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { DominantEmotion } from "../../types";

export default function DominantEmotionsChart({
  dominantEmotions,
}: {
  dominantEmotions: DominantEmotion[];
}) {
  // chart only has 5 colours, so we need to cycle through them
  const chartData = dominantEmotions.map((emotion, index) => ({
    emotion: emotion.emotion,
    frequency: emotion.frequency,
    fill: `hsl(var(--chart-${(index % 4) + 1}))`,
  }));

  const chartConfig = chartData.reduce((config, item) => {
    config[item.emotion] = {
      label: item.emotion,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px] min-h-fit min-w-fit flex-1"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="frequency"
          nameKey="emotion"
          innerRadius={60}
          strokeWidth={5}
          activeIndex={0}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="emotion" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
