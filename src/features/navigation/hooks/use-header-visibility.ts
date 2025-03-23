"use client";

import { usePathname } from "next/navigation";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useSession } from "@/lib/client-auth";

import { STATIC_ROUTES } from "../config/routes";
import {
  shouldShowMobileHeader,
  shouldShowRegularHeader,
} from "../utils/header-visibility";

/**
 * Hook to determine header visibility based on route type and user authentication
 *
 * Static Routes (e.g., /dreamscape, /dream-dictionary):
 * - Logged out: Always show main header
 * - Logged in: Show main header on desktop, mobile header on mobile
 *
 * App Routes (e.g., /dashboard, /journal):
 * - Show mobile header on mobile devices
 * - Show main header on desktop
 */
export function useHeaderVisibility() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { isLoggedIn } = useSession();

  // Check if current route is a static route (including sub-routes)
  const isStaticRoute = STATIC_ROUTES.some(
    (route) => pathname === route.path || pathname.startsWith(`${route.path}/`)
  );

  return {
    shouldShowMainHeader: () => {
      // Static route logic
      if (isStaticRoute) {
        if (!isLoggedIn) return true; // Always show main header for logged out users
        return isDesktop; // Show main header only on desktop for logged in users
      }

      // App route logic
      if (!isDesktop && !shouldShowRegularHeader(pathname)) {
        return false;
      }
      return true;
    },

    shouldShowMobileHeader: () => {
      // Static route logic
      if (isStaticRoute) {
        if (!isLoggedIn) return false; // Never show mobile header for logged out users
        return !isDesktop; // Show mobile header only on mobile for logged in users
      }

      // App route logic
      return !isDesktop && shouldShowMobileHeader(pathname);
    },
  };
}
