import { HeaderRoute } from "../types";

/**
 * Static routes are public-facing routes that are accessible without authentication
 * These routes show the main header by default, and on mobile:
 * - Show main header for logged out users
 * - Show mobile header for logged in users
 */
export const STATIC_ROUTES: HeaderRoute[] = [
  { path: "/", type: "static" },
  { path: "/free-dream-interpretation", type: "static" },
  { path: "/dreamscape", type: "static" },
  { path: "/dream-dictionary", type: "static" },
  { path: "/privacy-policy", type: "static" },
  { path: "/terms-of-service", type: "static" },
];

/**
 * App routes are protected routes that require authentication
 * These routes always show the mobile header on mobile devices
 */
export const APP_ROUTES: HeaderRoute[] = [
  { path: "/dashboard", type: "app" },
  { path: "/journal", type: "app" },
  { path: "/settings", type: "app" },
  { path: "/dreams", type: "app" },
  { path: "/insights", type: "app" },
];
