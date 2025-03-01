import { APP_ROUTES, STATIC_ROUTES } from "../config/routes";

export function shouldShowMobileHeader(pathname: string): boolean {
  return APP_ROUTES.some((route) => pathname.startsWith(route.path));
}

export function shouldShowRegularHeader(pathname: string): boolean {
  return (
    STATIC_ROUTES.some((route) => pathname === route.path) ||
    !shouldShowMobileHeader(pathname)
  );
}
