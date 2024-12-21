import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/dream-meaning(.*)",
  "/contact",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/dreams/(.*)",
  "/blog(.*)",
  "/order/success",
  "/api/dream-meaning(.*)",
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
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
