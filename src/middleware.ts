import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/dreams/(.*)",
  "/blog/(.*)",
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
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
