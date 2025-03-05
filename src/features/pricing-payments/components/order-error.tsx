"use client";

import { useEffect } from "react";

import { createCreditEvent } from "@/features/_analytics/events/credits";
import { useAnalytics } from "@/features/_analytics/hooks/use-analytics";

interface OrderErrorProps {
  sessionId: string;
  error: string;
}

export default function OrderError({ sessionId, error }: OrderErrorProps) {
  const { track } = useAnalytics();

  useEffect(() => {
    track(
      createCreditEvent("PURCHASE-ERROR", {
        stripeSessionId: sessionId,
        error,
      })
    );
  }, [track, sessionId, error]);

  return (
    <div className="container flex flex-col items-center justify-center py-12">
      Error retrieving session details. Please try again later.
    </div>
  );
}
