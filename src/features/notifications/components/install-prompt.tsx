"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { InfoIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSession } from "@/lib/client-auth";

export default function InstallPrompt() {
  const { isLoggedIn } = useSession();
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isTablet = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    // Check if device is iOS
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    // Check if app is installed
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    setIsLoading(false);
    setIsVisible(true);
  }, []);

  // Don't show if still loading or user dismissed
  if (isLoading || !isVisible || !isLoggedIn) {
    return null;
  }

  // Don't show if already installed or on tablet
  if (isStandalone || isTablet) {
    return null;
  }

  // Only show on iOS devices that haven't installed the PWA
  if (!isIOS) {
    return null;
  }

  return (
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
  );
}
