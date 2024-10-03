import { Preloaded, usePreloadedQuery } from "convex/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";

import EmotionsBadge from "../shared/emotions-badge";
import Loader from "../shared/loader";

export default function AboutDreamCard(props: {
  dream: Preloaded<typeof api.queries.dreams.getDreamById>;
  emotions: Preloaded<typeof api.queries.emotions.getEmotionsByDreamId>;
}) {
  const dream = usePreloadedQuery(props.dream);
  const emotions = usePreloadedQuery(props.emotions);

  if (!dream) {
    return null;
  }

  return (
    <Card className="max-w-[80ch]">
      <CardHeader>
        <CardTitle className="w-fit">
          {dream.title ? (
            dream.title
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Untitled</span>
              <Loader />
            </div>
          )}
        </CardTitle>
        <CardDescription>
          {!dream.title && "Your title is being generated"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4">
        <p className="flex-grow text-muted-foreground">{dream.details}</p>
        <div>
          <h2 className="font-bold">Role</h2>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Emotions</h3>
          <div className="flex flex-wrap gap-2">
            {emotions.map((emotion) => (
              <EmotionsBadge key={emotion} emotionId={emotion} />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
