"use client";

import { type ReactNode } from "react";

import { usePostHog } from "posthog-js/react";

import { AnalyticsContext } from "../hooks/use-analytics";
import PageViewTracker from "./pageview-tracker";
import { PostHogProvider } from "./posthog-provider";

interface AnalyticsProviderProps {
  children: ReactNode;
}

export default function AnalyticsProvider({
  children,
}: AnalyticsProviderProps) {
  return (
    <AnalyticsContext.Provider
      value={{
        instance: {
          track: (event) => {
            // We initialize PostHog in its provider, so we delegate tracking there
            // This allows us to potentially add more providers in the future
            return null;
          },
          identify: (userId, traits) => {
            return null;
          },
          reset: () => {
            return null;
          },
        },
      }}
    >
      <PostHogProvider>
        <PostHogAnalyticsConnector>
          <PageViewTracker />
          {children}
        </PostHogAnalyticsConnector>
      </PostHogProvider>
    </AnalyticsContext.Provider>
  );
}

// Separate connector component to handle PostHog-specific logic
function PostHogAnalyticsConnector({ children }: { children: ReactNode }) {
  const posthog = usePostHog();

  return (
    <AnalyticsContext.Provider
      value={{
        instance: posthog
          ? {
              track: (event) => posthog.capture(event.name, event.properties),
              identify: (userId, traits) => posthog.identify(userId, traits),
              reset: () => posthog.reset(),
            }
          : null,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
