"use client";

import { format } from "date-fns";

import { useSession } from "@/lib/client-auth";
import getGreeting from "@/utils/get-greeting";

import { AddDreamButton } from "../../shared/add-dream-button";
import Loader from "../../shared/loader";

export default function DashboardHeader() {
  const { session, isLoaded, isLoggedIn } = useSession();

  if (!isLoggedIn) {
    return null;
  }

  if (!isLoaded) {
    return <Loader />;
  }

  if (!session) {
    return null;
  }

  const user = session?.user;

  return (
    <section className="sm:flew-row container flex flex-wrap items-center justify-between gap-4 border-b py-5">
      {isLoaded && (
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            {format(new Date(), "EEE, MMM d, yyyy")}
          </p>
          <h1 className="text-xl font-medium sm:text-2xl">{`${getGreeting()}, ${user?.firstName || "User"}!`}</h1>
        </div>
      )}
      <AddDreamButton />
    </section>
  );
}
