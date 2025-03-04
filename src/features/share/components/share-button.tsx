"use client";

import { useCallback, useState } from "react";

import { ShareIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createDreamEvent } from "@/features/_analytics/events/dreams";
import { useAnalytics } from "@/features/_analytics/hooks/use-analytics";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
  disabled?: boolean;
  onDisabledClick?: () => void;
  className?: string;
  shrink?: boolean;
  isOwnDream?: boolean;
}

export default function ShareButton({
  url,
  title,
  text,
  disabled,
  onDisabledClick,
  className,
  shrink,
  isOwnDream,
}: ShareButtonProps) {
  const { track } = useAnalytics();
  const [isSharing, setIsSharing] = useState(false);

  const handleClick = () => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }
    handleShare();
  };

  const handleShare = useCallback(async () => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }

    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          url: url.trim(),
          title: title?.trim(),
          text: text?.trim(),
        });
        track(
          createDreamEvent(isOwnDream ? "SHARED-OWN" : "SHARED-OTHER", {
            shareMethod: "native",
          })
        );
      } else {
        await navigator.clipboard.writeText(url.trim());
        track(
          createDreamEvent(isOwnDream ? "SHARED-OWN" : "SHARED-OTHER", {
            shareMethod: "copy",
          })
        );
      }
      toast.success("Thanks for sharing!");
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    } finally {
      setIsSharing(false);
    }
  }, [url, title, text, disabled, onDisabledClick, track, isOwnDream]);

  return (
    <Button
      variant="outline"
      size={shrink ? "icon" : "default"}
      className={cn(
        shrink ? "h-9 w-9" : "flex items-center gap-2",
        {
          "opacity-50": disabled,
        },
        className
      )}
      onClick={handleClick}
      disabled={isSharing}
      title={disabled ? "Make this dream public to share" : "Share"}
    >
      <ShareIcon className="size-4" />
      {!shrink && <span>Share</span>}
    </Button>
  );
}
