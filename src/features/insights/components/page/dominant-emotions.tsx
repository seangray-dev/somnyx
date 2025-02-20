import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DominantEmotion } from "../../types";
import DominantEmotionsChart from "./dominant-emotions-chart";

export default function DominantEmotions({
  dominantEmotions,
}: {
  dominantEmotions: DominantEmotion[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dominant Emotions</CardTitle>
        <CardDescription>
          The emotions that were most prevalent in your journal entries.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <DominantEmotionsChart dominantEmotions={dominantEmotions} />
        <div className="flex flex-col gap-4 pb-4">
          {dominantEmotions.map((emotion) => (
            <div
              key={emotion.emotion}
              className="flex items-center justify-between space-y-1 border-t pt-4"
            >
              <div className="flex-shrink space-y-2">
                <p className="font-medium">{emotion.emotion}</p>
                <p className="text-sm text-muted-foreground">
                  Themes: {emotion.associatedThemes.join(", ")}
                </p>
              </div>
              <div className="flex flex-1 flex-col items-end gap-2 font-medium text-muted-foreground">
                <div className="text-base text-foreground">
                  {emotion.percentage}%
                </div>
                <div className="text-xs">(Dreams: {emotion.frequency})</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
