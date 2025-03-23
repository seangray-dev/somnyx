"use client";

import Link from "next/link";
import { useState } from "react";

import { useAction, useMutation, useQuery } from "convex/react";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export default function AdminDreamDictionaryPagesList() {
  const [regeneratingId, setRegeneratingId] = useState<Id<"themePages"> | null>(
    null
  );
  const regenerateImage = useAction(
    api.mutations.openai.regenerateThemePageImageAction
  );
  const themePages = useQuery(api.queries.themePages.getAllThemePagesAdmin);
  const togglePublish = useMutation(
    api.mutations.themePages.togglePublishState
  );
  const [publishingId, setPublishingId] = useState<Id<"themePages"> | null>(
    null
  );

  const handleTogglePublish = async (
    id: Id<"themePages">,
    currentState: boolean
  ) => {
    try {
      setPublishingId(id);
      const result = await togglePublish({
        id,
        isPublished: !currentState,
      });

      if (result?.success) {
        toast.success(
          `Theme page ${!currentState ? "published" : "unpublished"} successfully`
        );
      } else {
        toast.error("Failed to update publish state");
      }
    } catch (error) {
      console.error("Toggle publish error:", error);
      // toast.error("Failed to publish theme page");
      toast.error("Failed to update publish state", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setPublishingId(null);
    }
  };

  const handleRegenerateImage = async (id: Id<"themePages">) => {
    try {
      setRegeneratingId(id);
      const result = await regenerateImage({ pageId: id });

      if (result?.success) {
        toast.success("Image regenerated successfully");
      } else {
        toast.error("Failed to regenerate image");
      }
    } catch (error) {
      console.error("Regenerate image error:", error);
      toast.error("Failed to regenerate image");
    } finally {
      setRegeneratingId(null);
    }
  };

  if (!themePages) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dream Dictionary Pages</CardTitle>
          <CardDescription>
            View and manage the pages in the dream dictionary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dream Dictionary Pages</CardTitle>
        <CardDescription>
          View and manage the pages in the dream dictionary
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {themePages.map((page) => (
            <div
              key={page._id}
              className="flex justify-between gap-4 rounded-lg border p-4"
            >
              <div className="space-y-2">
                <h3 className="font-semibold">{page.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {page.seo_description}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Badge
                    variant={"outline"}
                    className={cn(
                      "inline-flex items-center gap-1 font-medium",
                      page.isPublished
                        ? "bg-success text-success-foreground"
                        : "bg-warning text-warning-foreground"
                    )}
                  >
                    {page.isPublished ? (
                      <>
                        <EyeIcon size={16} />
                        Published
                      </>
                    ) : (
                      <>
                        <EyeOffIcon size={16} />
                        Draft
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dream-dictionary/${page.seo_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </Link>
                  <Button
                    variant={page.isPublished ? "destructive" : "default"}
                    size="sm"
                    className="w-20"
                    onClick={() =>
                      handleTogglePublish(page._id, page.isPublished ?? false)
                    }
                    disabled={publishingId === page._id}
                  >
                    {publishingId === page._id ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      </>
                    ) : page.isPublished ? (
                      "Unpublish"
                    ) : (
                      "Publish"
                    )}
                  </Button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerateImage(page._id)}
                    disabled={regeneratingId === page._id}
                  >
                    {regeneratingId === page._id ? (
                      <>
                        Regenerating...
                        <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      "Regenerate Image"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
