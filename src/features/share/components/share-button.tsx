"use client";

import { useState } from "react";

import { ShareIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  url: string;
}

export default function ShareButton({ url }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        // Convert https:// to web+somnyx:// for PWA handling
        const pwaUrl = url.trim().replace("https://", "web+somnyx://");
        await navigator.share({
          url: pwaUrl,
        });
        toast.success("Thanks for sharing!");
      } else {
        // Fallback to copying the URL
        await navigator.clipboard.writeText(url.trim());
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      // User cancelled share or something went wrong
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share");
        console.error("Error sharing:", error);
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
