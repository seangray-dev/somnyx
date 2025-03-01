"use client";

import { useState } from "react";

import { ShareIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
  disabled?: boolean;
  onDisabledClick?: () => void;
  className?: string;
  shrink?: boolean;
}

export default function ShareButton({
  url,
  title,
  text,
  disabled,
  onDisabledClick,
  className,
  shrink,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleClick = () => {
    if (disabled) {
      onDisabledClick?.();
      return;
    }
    handleShare();
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          url: url.trim(),
          title: title?.trim(),
          text: text?.trim(),
        });
        toast.success("Thanks for sharing!");
      } else {
        await navigator.clipboard.writeText(url.trim());
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    } finally {
      setIsSharing(false);
    }
  };

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
