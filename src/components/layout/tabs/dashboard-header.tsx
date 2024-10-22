"use client";

import { usePathname } from "next/navigation";

import { format } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/client-auth";
import getGreeting from "@/utils/get-greeting";

import UserDropdownMenu from "../site-header/user-dropdown-menu";

export default function DashboardHeader() {
  const { session, isLoaded, isLoggedIn } = useSession();
  const pathname = usePathname();

  if (pathname === "/settings" || (!isLoggedIn && isLoaded)) {
    return null;
  }

  const user = session?.user;
  const firstName = user?.firstName;

  return (
    <section className="flex flex-col gap-4 border-b py-5">
      <div className="container flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            {format(new Date(), "EEE, MMM d, yyyy")}
          </p>
          <h1 className="flex items-center text-xl font-medium sm:text-2xl">
            {getGreeting()}
            {isLoaded ? (
              firstName ? (
                `, ${firstName}!`
              ) : (
                "!"
              )
            ) : (
              <Skeleton className="ml-2 inline-flex h-6 w-32" />
            )}
          </h1>
        </div>
        <div className="sm:hidden">
          <UserDropdownMenu />
        </div>
      </div>
    </section>
  );
}
