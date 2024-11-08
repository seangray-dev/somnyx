import { EmotionalInsight } from "../../types";
import DominantEmotions from "./dominant-emotions";
import EmotionalTrend from "./emotional-trend";
import EmotionalTriggers from "./emotional-triggers";

export default function EmotionalInsights({
  emotionalInsights,
}: {
  emotionalInsights: EmotionalInsight;
}) {
  const { dominantEmotions, emotionalTrends, emotionalTriggers } =
    emotionalInsights;

  return (
    <div className="flex flex-col gap-4">
      <DominantEmotions dominantEmotions={dominantEmotions} />
      <EmotionalTrend emotionalTrends={emotionalTrends} />
      <EmotionalTriggers emotionalTrigger={emotionalTriggers} />
    </div>
  );
}
