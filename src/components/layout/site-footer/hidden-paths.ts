const HIDDEN_PATHS_FOOTER = [
  "/dashboard",
  "/journal",
  "/settings",
  "/dreams/",
  "/insights",
];

export function shouldShowFooter(pathname: string) {
  // Check if the current path starts with any of the hidden paths
  return !HIDDEN_PATHS_FOOTER.some((path) => pathname.startsWith(path));
}
