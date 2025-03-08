import Link from "next/link";

import EmotionsBadge from "@/components/shared/emotions-badge";
import Loader from "@/components/shared/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { formatDateForURL, timeAgo } from "@/utils/date-time";

import DreamCardActions from "./dream-card-actions";

export function DreamCard({ dream }: { dream: Doc<"dreams"> }) {
  const { title, details, date, slug, emotions } = dream;

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="w-fit">
            <Link
              href={{
                pathname: `/dreams/${formatDateForURL(date)}/${slug}`,
              }}
              className="hover:underline"
            >
              {title ? (
                title.replace(/"/g, "")
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Untitled</span>
                  <Loader />
                </div>
              )}
            </Link>
          </CardTitle>
          <CardDescription>
            {!title && "Your title is being generated"}
          </CardDescription>
        </div>
        <div>
          <DreamCardActions dream={dream} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4 text-muted-foreground">
        <p className="line-clamp-3 flex-grow">{details}</p>
        <div className="flex flex-wrap gap-2">
          {emotions.map((emotion) => (
            <EmotionsBadge key={emotion} emotionId={emotion} />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">{timeAgo(date)}</div>
      </CardFooter>
    </Card>
  );
}
