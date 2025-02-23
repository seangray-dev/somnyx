import Image from "next/image";
import Link from "next/link";

import { EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useGetAnalysisImageUrl } from "@/hooks/use-convex-image";
import { formatDate } from "@/lib/utils";

interface DreamPreviewCardProps {
  dream: Doc<"dreams"> & { imageStorageId?: Id<"_storage"> };
}

export function DreamPreviewCard({ dream }: DreamPreviewCardProps) {
  const { _id, title, details, date, imageStorageId } = dream;
  const imageUrl = useGetAnalysisImageUrl(imageStorageId);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title || "Dream Image"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted">
            <EyeOffIcon className="size-4 text-muted-foreground" />
            <p className="text-center text-xs text-muted-foreground">
              No Image
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <CardHeader>
          <CardTitle className="line-clamp-2">
            {title ? title.replace(/"/g, "") : "Untitled Dream"}
          </CardTitle>
          <CardDescription>{formatDate(date)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="line-clamp-3 text-pretty text-sm text-muted-foreground">
            {details}
          </p>
        </CardContent>
        <CardFooter className="mt-auto">
          <Link href={`/dreams/${_id}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              Explore
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}
