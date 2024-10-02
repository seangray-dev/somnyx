import React from "react";

import { FieldValues, UseFormRegister } from "react-hook-form";

import { TypeSelectionFormProps } from "@/types/types";

import { UserTypeCard } from "../user-type-card";

export function TypeSelectionForm({
  register,
  setUserType,
  userType,
}: TypeSelectionFormProps) {
  return (
    <>
      <h2 className="text-gravel font-bold md:text-4xl">
        Let&apos;s get started
      </h2>
      <p className="text-iridium md:text-sm">
        Tell us about yourself! What do you do? Let&apos;s tailor your
        <br /> experience so it best suits you.
      </p>
      <UserTypeCard
        register={register}
        setUserType={setUserType}
        userType={userType}
        value="agency"
        title="I own an agency"
        text="Setting up my account for my agency."
      />
      <UserTypeCard
        register={register}
        setUserType={setUserType}
        userType={userType}
        value="creator"
        title="I am a content creator"
        text="Looking to create content for my agency."
      />
    </>
  );
}
