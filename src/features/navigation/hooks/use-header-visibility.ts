"use client";

import { usePathname } from "next/navigation";

import { useMediaQuery } from "@/hooks/use-media-query";

import {
  shouldShowMobileHeader,
  shouldShowRegularHeader,
} from "../utils/header-visibility";

export function useHeaderVisibility() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  return {
    shouldShowMainHeader: () => {
      if (!isDesktop && !shouldShowRegularHeader(pathname)) {
        return false;
      }
      return true;
    },
    shouldShowMobileHeader: () => {
      return !isDesktop && shouldShowMobileHeader(pathname);
    },
  };
}
