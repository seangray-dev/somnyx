const HIDDEN_PATHS = [
  "/dashboard",
  "/journal",
  "/settings",
  "/dreams/",
  "/insights",
];

export function shouldShowLayout(pathname: string) {
  // Check if the current path starts with any of the hidden paths
  return !HIDDEN_PATHS.some((path) => pathname.startsWith(path));
}
