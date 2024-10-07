"use client";

import { useSession } from "@/lib/client-auth";
import getGreeting from "@/utils/get-greeting";

import Loader from "../shared/loader";
import { AddDreamButton } from "./add-dream-button";

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
    <section className="sm:flew-row container flex flex-wrap items-center justify-between gap-4">
      {isLoaded && (
        <h1 className="text-xl font-medium sm:text-2xl">{`${getGreeting()}, ${user?.firstName || "User"}!`}</h1>
      )}
      <AddDreamButton />
    </section>
  );
}
