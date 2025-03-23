"use client";

import { Suspense } from "react";

import { useAuth } from "@clerk/nextjs";

import { cookieConsentGiven } from "@/utils/cookie-consent-given";

import CookieConsentBanner from "./cookie-consent-banner";
import { CookieSettingsDialog } from "./cookie-settings-dialog";

function CookieConsentManager() {
  const { isSignedIn, isLoaded } = useAuth();
  const consentStatus = cookieConsentGiven();

  if (!isLoaded) return null;

  // For signed-in users, only show the initial banner if they haven't made a choice
  if (isSignedIn) {
    return consentStatus === "undecided" ? <CookieConsentBanner /> : null;
  }

  // For non-signed-in users:
  // - Show banner if they haven't made a choice
  // - Show dialog if they have made a choice
  return consentStatus === "undecided" ? (
    <CookieConsentBanner />
  ) : (
    <CookieSettingsDialog />
  );
}

export default function CookieManager() {
  return (
    <Suspense fallback={null}>
      <CookieConsentManager />
    </Suspense>
  );
}
