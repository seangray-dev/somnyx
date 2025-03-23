import { ClipboardCopyIcon, ShareIcon } from "lucide-react";
import {
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterShareButton,
  XIcon,
} from "react-share";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createDreamEvent } from "@/features/_analytics/events/dreams";
import { useAnalytics } from "@/features/_analytics/hooks/use-analytics";

type ShareOption = {
  name: string;
  icon: React.ComponentType<any>;
  Button?: React.ComponentType<any>;
  isCopyLink?: boolean;
  isNativeShare?: boolean;
};

type ShareLinksProps = {
  url: string;
  isOwnDream?: boolean;
  title?: string;
  text?: string;
};

const SHARE_OPTIONS: ShareOption[] = [
  {
    name: "Share to",
    icon: ShareIcon,
    isNativeShare: true,
  },
  {
    name: "Copy Link",
    icon: ClipboardCopyIcon,
    Button: Button,
    isCopyLink: true,
  },
  {
    name: "X",
    icon: XIcon,
    Button: TwitterShareButton,
  },
  {
    name: "Reddit",
    icon: RedditIcon,
    Button: RedditShareButton,
  },
  {
    name: "Facebook",
    icon: FacebookIcon,
    Button: FacebookShareButton,
  },
];

export default function ShareLinks({
  url,
  isOwnDream = false,
  title,
  text,
}: ShareLinksProps) {
  const { track } = useAnalytics();

  const handleShare = async ({ platform }: { platform: string }) => {
    try {
      if (platform === "Share to") {
        if (navigator.share) {
          await navigator.share({
            url: url.trim(),
            title: title?.trim(),
            text: text?.trim(),
          });
          track(
            createDreamEvent(isOwnDream ? "SHARED-OWN" : "SHARED-OTHER", {
              shareMethod: "native",
              platform: "none",
            })
          );
          toast.success("Thanks for sharing!");
        }
        return;
      }

      if (platform === "Copy Link") {
        await navigator.clipboard.writeText(url);
        track(
          createDreamEvent(isOwnDream ? "SHARED-OWN" : "SHARED-OTHER", {
            shareMethod: "copy",
            platform: "none",
          })
        );
        toast.success("Link copied to clipboard");
        return;
      }

      track(
        createDreamEvent(isOwnDream ? "SHARED-OWN" : "SHARED-OTHER", {
          shareMethod: "social",
          platform: platform as "X" | "Reddit" | "Facebook",
        })
      );
      toast.success(`Sharing on ${platform}...`);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  return (
    <>
      {SHARE_OPTIONS.map((option) => (
        <DropdownMenuItem
          asChild={option.isCopyLink || option.isNativeShare}
          key={option.name}
        >
          {option.isCopyLink || option.isNativeShare ? (
            <div
              className="flex w-full items-center gap-2 hover:cursor-pointer"
              onClick={() => handleShare({ platform: option.name })}
            >
              <option.icon size={16} className="rounded" />
              <span>{option.name}</span>
            </div>
          ) : option.Button ? (
            <option.Button
              url={url}
              className="flex w-full items-center gap-2"
              onClick={() => handleShare({ platform: option.name })}
            >
              <option.icon size={16} className="rounded" />
              <span>{option.name}</span>
            </option.Button>
          ) : null}
        </DropdownMenuItem>
      ))}
    </>
  );
}
