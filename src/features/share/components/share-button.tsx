"use client";

import { Share2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import ShareLinks from "./share-links";

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
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      onDisabledClick?.();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={handleClick}>
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
          title={disabled ? "Make this dream public to share" : "Share"}
        >
          <Share2Icon className="size-4" />
          {!shrink && <span>Share</span>}
        </Button>
      </DropdownMenuTrigger>
      {!disabled && (
        <DropdownMenuContent align="end">
          <ShareLinks
            url={url}
            title={title}
            text={text}
            isOwnDream={isOwnDream}
          />
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
