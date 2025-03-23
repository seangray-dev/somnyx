import { APP_ROUTES, STATIC_ROUTES } from "../config/routes";

/**
 * Determines if the mobile header should be shown for a given path
 * - Returns true for app routes (protected routes)
 * - Returns false for static routes (public routes)
 */
export function shouldShowMobileHeader(pathname: string): boolean {
  return APP_ROUTES.some((route) => pathname.startsWith(route.path));
}

/**
 * Determines if the regular (main) header should be shown for a given path
 * - Returns true for static routes
 * - Returns true when mobile header is not shown
 */
export function shouldShowRegularHeader(pathname: string): boolean {
  const isStaticRoute = STATIC_ROUTES.some((route) => pathname === route.path);
  const showsMobileHeader = shouldShowMobileHeader(pathname);

  return isStaticRoute || !showsMobileHeader;
}
