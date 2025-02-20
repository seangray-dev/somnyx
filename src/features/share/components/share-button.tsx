"use client";

import { useState } from "react";

import { ShareIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
}

export default function ShareButton({ url, title, text }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

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
      size="lg"
      className="flex w-full items-center gap-2"
      onClick={handleShare}
      disabled={isSharing}
    >
      <ShareIcon className="size-4" />
      <span>Share</span>
    </Button>
  );
}
