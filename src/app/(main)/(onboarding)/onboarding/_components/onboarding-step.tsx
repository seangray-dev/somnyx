"use client";

import React, { useState } from "react";

import { useFormContext } from "react-hook-form";

import { useOnboardingContextHook } from "@/context/use-onboarding-context";

import { TypeSelectionForm } from "./forms/type-selection-form";

type Props = {};

export default function OnboardingFormStep(props: Props) {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const { currentStep } = useOnboardingContextHook();
  const [onUserType, setOnUserType] = useState<"owner" | "student">("owner");

  switch (currentStep) {
    case 1:
      return (
        <TypeSelectionForm
          register={register}
          userType={onUserType}
          setUserType={setOnUserType}
        />
      );
  }

  return <div>RegistrationFormStep</div>;
}
