"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useUser } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";

export default function PostHogPageView(): null {
  const posthog = usePostHog();
  const userInfo = useUser();
  const { user } = userInfo;

  useEffect(() => {
    if (user?.id) {
      posthog.identify(user.id, {
        email: user.emailAddresses[0]?.emailAddress,
      });
    } else {
      posthog.reset();
    }
  }, [posthog, user]);

  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  return null;
}
