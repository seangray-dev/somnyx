"use client";

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

import DreamCardActions from "../shared/dream-card-actions";
import EmotionsBadge from "../shared/emotions-badge";
import Loader from "../shared/loader";

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
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
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
        </div>
        <div>
          <DreamCardActions {...{ _id, isPublic }} />
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
