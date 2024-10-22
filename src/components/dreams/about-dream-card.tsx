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
import { timeAgo } from "@/utils/date-time";

import DreamCardActions from "../shared/dream-card-actions";
import EmotionsBadge from "../shared/emotions-badge";
import Loader from "../shared/loader";
import { Badge } from "../ui/badge";

type AboutDreamCardProps = {
  dream: Preloaded<typeof api.queries.dreams.getDreamById>;
  emotions: Preloaded<typeof api.queries.emotions.getEmotionsByDreamId>;
  role: Preloaded<typeof api.queries.roles.getRoleById>;
};

export default function AboutDreamCard(props: AboutDreamCardProps) {
  const dream = usePreloadedQuery(props.dream);
  const emotions = usePreloadedQuery(props.emotions);
  const role = usePreloadedQuery(props.role);
  const themes = dream?.themes;

  if (!dream) {
    return null;
  }

  const { _id, isPublic, title, details, date, people, places, things } = dream;

  return (
    <Card>
      <CardHeader className="flex flex-row items-baseline justify-between">
        <div className="space-y-1">
          <CardTitle className="w-fit text-3xl">
            {title ? (
              // replace double quotes with empty string
              title.replace(/"/g, "")
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Untitled</span>
                <Loader />
              </div>
            )}
          </CardTitle>
          <CardDescription className="max-w-[80ch] text-base">
            <div className="pb-2 text-sm">
              {!title && "Your title is being generated"}
            </div>
            {details}
          </CardDescription>
        </div>
        <div>
          <DreamCardActions {...{ _id, isPublic }} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4">
        <div>
          <h2 className="pb-2 font-bold">Role</h2>
          <div className="text-sm text-muted-foreground">
            <p>{role?.name}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Emotions</h3>
            <div className="flex flex-wrap gap-2">
              {emotions.map((emotion) => (
                <EmotionsBadge key={emotion} emotionId={emotion} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Themes</h3>
            <div className="flex flex-wrap gap-2">
              {themes
                ? themes.map((theme) => (
                    <Badge key={theme} variant={"outline"}>
                      {theme}
                    </Badge>
                  ))
                : "None"}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">People, Places & Things</h3>
          <div className="flex flex-wrap gap-2">
            {(() => {
              const combinedItems = [
                ...(people?.map((item) => ({ label: item, type: "person" })) ??
                  []),
                ...(places?.map((item) => ({ label: item, type: "place" })) ??
                  []),
                ...(things?.map((item) => ({ label: item, type: "thing" })) ??
                  []),
              ];

              return combinedItems.length > 0 ? (
                combinedItems.map(({ label }, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="hover:cursor-default"
                  >
                    {label}
                  </Badge>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">N/A</div>
              );
            })()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{timeAgo(date)}</div>
      </CardFooter>
    </Card>
  );
}
