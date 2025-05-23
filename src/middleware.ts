import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/interpret(.*)",
  "/dream-meaning(.*)",
  "/dream-dictionary",
  "/dream-dictionary/(.*)",
  "/contact",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/dreams/(.*)",
  "/blog(.*)",
  "/order/success",
  "/api/dream-meaning(.*)",
  "/admin(.*)",
  "/support",
  "/privacy-policy",
  "/terms-of-service",
  "/api/cron/(.*)",
  "/dreamscape",
  "/install-guide",
  "/api/get-ip",
  "/free-dream-interpretation(.*)",
  "/ingest(.*)",
  "/robots.txt",
]);

export default clerkMiddleware((auth, req) => {
  const userId = auth().userId;

  // User isn't signed in and the route is private -- redirect to sign-in
  if (!userId && !isPublicRoute(req))
    return auth().redirectToSignIn({ returnBackUrl: req.url });

  // User is logged in and the route is protected - let them view.
  if (userId && !isPublicRoute(req)) return NextResponse.next();

  // Protect all routes that are not public
  if (!isPublicRoute(req)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|sitemap\\.xml|robots\\.txt|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
