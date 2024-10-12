"use client";

import { SignInButton } from "@clerk/nextjs";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/client-auth";

import UserDropdownMenu from "./user-dropdown-menu";

export default function HeaderActions() {
  const session = useSession();
  const { isLoggedIn, isLoaded } = session;

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      {isLoggedIn ? (
        <UserDropdownMenu />
      ) : (
        <SignInButton mode="modal">
          <Button disabled={!isLoaded}>Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}
