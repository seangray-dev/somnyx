"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { InfoIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isTablet = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    setIsLoading(false);
    setIsVisible(true);
  }, []);

  if (isLoading || !isVisible || isStandalone || isTablet || isIOS) {
    return null;
  }

  return (
    isIOS && (
      <div className="sticky top-0 z-50 flex items-center justify-between bg-purple-200 px-2 py-2 text-purple-900">
        <div className="container flex items-center gap-2 text-xs">
          <InfoIcon className="size-4" />
          <Link
            href={{ pathname: "/install-guide" }}
            className="flex items-center gap-2 text-pretty hover:underline"
          >
            Click Here To Install Somnyx On Your Device
          </Link>
        </div>
        <Button
          variant="destructive"
          size="icon"
          className="h-fit w-fit bg-transparent text-current hover:text-destructive-foreground"
          onClick={() => setIsVisible(false)}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    )
  );
}
