"use client";

import { SignInButton } from "@clerk/nextjs";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import AddDreamButton from "@/features/dreams/components/dream-form/add-dream-button";
import PushNotificationManager from "@/features/notifications/components/push-notification-manager";
import { useSession } from "@/lib/client-auth";

import UserDropdownMenu from "./user-dropdown-menu";

export default function HeaderActions() {
  const session = useSession();
  const { isLoggedIn, isLoaded } = session;

  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <PushNotificationManager />
          <AddDreamButton />
          <UserDropdownMenu />
        </>
      ) : (
        <>
          <ThemeToggle />
          <SignInButton mode="modal">
            <Button disabled={!isLoaded}>Sign In</Button>
          </SignInButton>
        </>
      )}
    </div>
  );
}
