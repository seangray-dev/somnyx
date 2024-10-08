import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { timeAgo } from "@/utils/date-time";

import EmotionsBadge from "../shared/emotions-badge";
import Loader from "../shared/loader";
import DreamCardActions from "./dream-card-actions";

export default function DreamCard({
  _id,
  isPublic,
  title,
  details,
  date,
  emotions,
}: {
  _id: string;
  isPublic?: boolean;
  title?: string;
  details: string;
  date: string;
  emotions: string[];
}) {
  return (
    <Card className="flex w-full flex-col">
      <CardHeader>
        <CardTitle className="w-fit">
          <Link
            href={{ pathname: `/dreams/${_id}` }}
            className="hover:underline"
          >
            {title ? (
              // replace double quotes with empty string
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
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4 text-muted-foreground">
        <p className="line-clamp-3 flex-grow">{details}</p>
        <div className="flex flex-wrap gap-2">
          {emotions.map((emotion) => (
            <EmotionsBadge key={emotion} emotionId={emotion} />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{timeAgo(date)}</div>
        <div>
          <DreamCardActions {...{ _id, isPublic }} />
        </div>
      </CardFooter>
    </Card>
  );
}
