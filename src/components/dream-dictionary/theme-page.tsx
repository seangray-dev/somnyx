"use client";

import { notFound } from "next/navigation";

import {
  Preloaded,
  useMutation,
  usePreloadedQuery,
  useQuery,
} from "convex/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";

import FooterCtaSection from "@/components/dream-dictionary/footer-cta-section";
import ThemeContent from "@/components/dream-dictionary/theme-content";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

interface ThemePageContentProps {
  preloadedThemePage: Preloaded<
    typeof api.queries.themePages.getThemePageByNamePublic
  >;
}

export default function ThemePageContent({
  preloadedThemePage,
}: ThemePageContentProps) {
  const themePage = usePreloadedQuery(preloadedThemePage);
  const isAdmin = useQuery(api.users.isUserAdmin);
  const togglePublish = useMutation(
    api.mutations.themePages.togglePublishState
  );

  // Wait for both themePage and isAdmin to be loaded
  if (themePage === undefined || isAdmin === undefined) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  // Only show 404 if:
  // 1. The page doesn't exist, or
  // 2. The page is unpublished and the user is not an admin
  if (!themePage || (!themePage.isPublished && !isAdmin)) {
    return notFound();
  }

  const handlePublish = async () => {
    try {
      const result = await togglePublish({
        id: themePage._id,
        isPublished: !themePage.isPublished,
      });
      if (result?.success) {
        toast.success(
          `Theme page ${themePage.isPublished ? "unpublished" : "published"} successfully`
        );
      }
    } catch (error) {
      console.error("Failed to publish:", error);
      toast.error("Failed to update theme page");
    }
  };

  return (
    <>
      {isAdmin && (
        <div className="bg-warning py-2 text-sm text-warning-foreground">
          <div className="container flex items-center justify-between">
            <p>Only admins can see this</p>
            <Button
              size="sm"
              variant={themePage.isPublished ? "destructive" : "default"}
              className={cn(
                !themePage.isPublished &&
                  "bg-success text-success-foreground hover:bg-success/80"
              )}
              onClick={handlePublish}
            >
              {themePage.isPublished ? (
                <>
                  <EyeOffIcon className="mr-2 h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <EyeIcon className="mr-2 h-4 w-4" />
                  Publish Now
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      <ThemeContent themePage={themePage} />
      <FooterCtaSection variant="theme-page" />
    </>
  );
}
