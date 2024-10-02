"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/client-auth";

import { ThemeToggle } from "./theme-toggle";

export default function HeaderActions() {
  const session = useSession();
  const { isLoggedIn, isLoaded } = session;

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      {isLoggedIn ? (
        <UserButton />
      ) : (
        <SignInButton mode="modal">
          <Button disabled={!isLoaded}>Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}
