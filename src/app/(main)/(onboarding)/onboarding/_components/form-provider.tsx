"use client";

import React from "react";

import { FormProvider } from "react-hook-form";

import { OnboardingContextProvider } from "@/context/use-onboarding-context";
import { useOnboardingForm } from "@/hooks/use-onboarding";

import { Loader } from "./loader";

type Props = {
  children: React.ReactNode;
};

const OnboardingFormProvider = ({ children }: Props) => {
  const { methods, onHandleSubmit, loading } = useOnboardingForm();

  return (
    <OnboardingContextProvider>
      <FormProvider {...methods}>
        <form onSubmit={onHandleSubmit} className="h-full">
          <div className="flex h-full flex-col justify-between gap-3">
            <Loader loading={loading}>{children}</Loader>
          </div>
        </form>
      </FormProvider>
    </OnboardingContextProvider>
  );
};

export default OnboardingFormProvider;
