const HIDDEN_PATHS_FOOTER = [
  "/dashboard",
  "/journal",
  "/settings",
  "/dreams/",
  "/insights",
];

const HIDDEN_PATHS_HEADER = [
  "/",
  "/free-dream-interpretation",
  "/dreamscape",
  "/dream-dictionary",
];

export function shouldShowFooter(pathname: string) {
  // Check if the current path starts with any of the hidden paths
  return !HIDDEN_PATHS_FOOTER.some((path) => pathname.startsWith(path));
}

export function shouldShowMobileHeader(pathname: string) {
  // Check if the current path starts with any of the hidden paths
  return !HIDDEN_PATHS_HEADER.some((path) => pathname.startsWith(path));
}
