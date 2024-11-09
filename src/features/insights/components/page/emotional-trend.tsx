import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { EmotionalTrends } from "../../types";

export default function EmotionalTrend({
  emotionalTrends,
}: {
  emotionalTrends: EmotionalTrends;
}) {
  const { insights, weeklyProgression } = emotionalTrends;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotional Trends</CardTitle>
        <CardDescription>{insights}</CardDescription>
      </CardHeader>
      <CardContent className="grid items-start gap-4 md:grid-cols-2">
        {weeklyProgression.map((week) => (
          <Card key={week.week}>
            <CardHeader>
              <CardTitle className="text-xl">{week.week}</CardTitle>
              <CardDescription>
                Emotions: {week.primaryEmotions.join(", ")}
              </CardDescription>
            </CardHeader>
            <CardContent>{week.trend}</CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
