import { HeaderRoute } from "../types";

export const STATIC_ROUTES: HeaderRoute[] = [
  { path: "/", type: "static" },
  { path: "/free-dream-interpretation", type: "static" },
  { path: "/dreamscape", type: "static" },
  { path: "/dream-dictionary", type: "static" },
  { path: "/privacy-policy", type: "static" },
  { path: "/terms-of-service", type: "static" },
];

export const APP_ROUTES: HeaderRoute[] = [
  { path: "/dashboard", type: "app" },
  { path: "/journal", type: "app" },
  { path: "/settings", type: "app" },
  { path: "/dreams", type: "app" },
  { path: "/insights", type: "app" },
];
