"use client";

import { SignInButton } from "@clerk/nextjs";

import { AddDreamButton } from "@/components/shared/add-dream-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/client-auth";

import UserDropdownMenu from "./user-dropdown-menu";

export default function HeaderActions() {
  const session = useSession();
  const { isLoggedIn, isLoaded } = session;

  return (
    <div className="flex items-center gap-3">
      {isLoggedIn ? (
        <>
          <AddDreamButton />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
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
