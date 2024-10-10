"use client";

import { UserButton } from "@clerk/nextjs";

import { useSession } from "@/lib/client-auth";

export default function Account() {
  const session = useSession();
  const { isLoggedIn } = session;
  const fullName = session.session?.user.fullName;
  const email = session.session?.user.primaryEmailAddress;
  return (
    <>
      {isLoggedIn && (
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <UserButton />
          <div className="text-xs text-muted-foreground">
            <p>{fullName}</p>
            <p>{email?.emailAddress}</p>
          </div>
        </div>
      )}
    </>
  );
}
