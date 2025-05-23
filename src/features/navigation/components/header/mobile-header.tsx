"use client";

import { useRouter } from "next/navigation";

import { ChevronLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useHeaderVisibility } from "../../hooks/use-header-visibility";
import SideNavigation from "./side-navigation";

export default function MobileHeader() {
  const router = useRouter();
  const { shouldShowMobileHeader } = useHeaderVisibility();

  if (!shouldShowMobileHeader()) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between py-2 sm:hidden">
        <Button
          onClick={() => router.back()}
          size="sm"
          variant="ghost"
          className="pl-0"
        >
          <ChevronLeftIcon className="size-4" />
          Back
        </Button>
        <SideNavigation side="right" />
      </div>
    </div>
  );
}
