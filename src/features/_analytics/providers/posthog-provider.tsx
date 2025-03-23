"use client";

import dynamicLoader from "next/dynamic";
import { useEffect } from "react";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

import { env } from "@/config/env/client";
import { cookieConsentGiven } from "@/utils/cookie-consent-given";

const SuspendedPostHogPageView = dynamicLoader(
  () => import("./pageview-tracker"),
  {
    ssr: false,
  }
);

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      person_profiles: "identified_only", // Only create person profiles for identified users
      autocapture: false,
      persistence:
        cookieConsentGiven() === "yes" ? "localStorage+cookie" : "memory",
      opt_out_capturing_by_default: true,
      loaded: () => {
        // only start capturing if consent is given
        if (cookieConsentGiven() === "yes") {
          posthog.opt_in_capturing();
        }
      },
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}
