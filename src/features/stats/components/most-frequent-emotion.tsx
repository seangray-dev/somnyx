import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import useGetMostFrequentEmotion from "../api/use-get-most-frequent-emotion";

export default function MostFrequentEmotion() {
  const { isLoading, data } = useGetMostFrequentEmotion();
  const { emotionName, emoji } = data || {};

  return (
    <div className="flex items-center justify-between gap-2 text-sm sm:flex-col sm:justify-center">
      <div>Most Frequent Emotion</div>
      {!data && !isLoading && <div>No dreams yet</div>}
      {isLoading ? (
        <Skeleton className="h-[20px] w-[50px] rounded-full bg-muted-foreground" />
      ) : (
        emotionName && (
          <Badge
            variant={"outline"}
            className="flex items-center gap-2 border-muted-foreground"
          >
            <span>{emoji}</span>
            <span>{emotionName}</span>
          </Badge>
        )
      )}
    </div>
  );
}
