"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

import { completeOnboarding } from "./_actions";
import ButtonHandler from "./_components/button-handlers";
import OnboardingFormProvider from "./_components/form-provider";
import HighlightBar from "./_components/highlight-bar";
import OnboardingFormStep from "./_components/onboarding-step";

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  const updateUserOnboardingCompleted = useMutation(
    api.users.updateUserOnboardingCompleted
  );

  const handleSubmit = async () => {
    // Update the user onboardingCompleted for Clerk
    const res = await completeOnboarding();
    if (res?.message) {
      await user?.reload();
      // Update the user onboardingCompleted for Convex
      await updateUserOnboardingCompleted({});
      router.push("/dashboard");
    }
    if (res?.error) {
      console.log(res.error);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <OnboardingFormProvider>
        <div className="flex flex-col gap-2">
          <OnboardingFormStep />
          <ButtonHandler />
        </div>
        <HighlightBar />
      </OnboardingFormProvider>
    </div>
  );
}
