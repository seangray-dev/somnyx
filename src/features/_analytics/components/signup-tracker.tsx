"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@clerk/nextjs";

export default function SignupTracker() {
  const searchParams = useSearchParams();
  const { userId, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("[SignupTracker] Mount", {
      isSignedIn,
      userId,
      source: searchParams.get("source"),
      sessionId: searchParams.get("sessionId"),
    });

    const source = searchParams.get("source");
    const sessionId = searchParams.get("sessionId");

    if (isSignedIn && userId && source === "dream_interpreter" && sessionId) {
      console.log("[SignupTracker] Tracking funnel completion", {
        userId,
        source,
        sessionId,
      });

      fetch("/api/analytics/funnel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source,
          sessionId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("[SignupTracker] Funnel tracked", data);
          router.replace("/dashboard");
        })
        .catch((error) => {
          console.error("[SignupTracker] Error", error);
        });
    }
  }, [isSignedIn, userId, searchParams, router]);

  return null;
}
