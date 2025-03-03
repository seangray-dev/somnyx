"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

import { createAuthEvent } from "@/features/_analytics/events/auth";
import { useAnalytics } from "@/features/_analytics/hooks/use-analytics";

export default function Page() {
  const { theme } = useTheme();
  const { track } = useAnalytics();
  const searchParams = useSearchParams();

  // Track page view with source attribution
  useEffect(() => {
    const source = searchParams.get("source") || undefined;
    const sessionId = searchParams.get("sessionId") || undefined;

    track(
      createAuthEvent("SIGNUP_VIEWED", {
        source,
        dreamInterpreterSessionId: sessionId,
      })
    );
  }, [track, searchParams]);

  // Get analytics parameters for metadata
  const metadata = {
    signUpSource: searchParams.get("source") || undefined,
    dreamInterpreterSessionId: searchParams.get("sessionId") || undefined,
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-20">
      {theme === "dark" ? (
        <SignUp appearance={{ baseTheme: dark }} unsafeMetadata={metadata} />
      ) : (
        <SignUp unsafeMetadata={metadata} />
      )}
    </div>
  );
}
