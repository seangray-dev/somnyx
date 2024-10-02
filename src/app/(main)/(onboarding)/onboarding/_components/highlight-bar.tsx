"use client";

import React from "react";

import { useOnboardingContextHook } from "@/context/use-onboarding-context";
import { cn } from "@/lib/utils";

type Props = {};

export default function HighlightBar(props: Props) {
  const { currentStep } = useOnboardingContextHook();

  return (
    <div className="grid grid-cols-3 gap-3">
      <div
        className={cn(
          "col-span-1 h-2 rounded-full",
          currentStep == 1 ? "bg-orange" : "bg-platinum"
        )}
      ></div>
      <div
        className={cn(
          "col-span-1 h-2 rounded-full",
          currentStep == 2 ? "bg-orange" : "bg-platinum"
        )}
      ></div>
      <div
        className={cn(
          "col-span-1 h-2 rounded-full",
          currentStep == 3 ? "bg-orange" : "bg-platinum"
        )}
      ></div>
    </div>
  );
}
