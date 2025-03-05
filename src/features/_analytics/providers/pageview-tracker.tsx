"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { useAuth, useUser } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";

export function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  // Track pageviews
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`;
      }

      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  // Handle user identification and reset with only necessary data
  useEffect(() => {
    if (isSignedIn && userId && user && !posthog._isIdentified()) {
      const metadata = user.publicMetadata;
      posthog.identify(userId, {
        email: user.primaryEmailAddress?.emailAddress,
        dreamInterpreterSessionId: metadata.dreamInterpreterSessionId,
        signUpSource: metadata.signUpSource,
      });
    }
    if (!isSignedIn && posthog._isIdentified()) {
      posthog.reset();
    }
  }, [posthog, isSignedIn, userId, user]);

  return null;
}

export default function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
