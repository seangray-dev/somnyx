"use client";

import { useSession } from "@/lib/client-auth";
import getGreeting from "@/utils/get-greeting";

import { AddDreamButton } from "./add-dream-button";

export default function DashboardHeader() {
  const session = useSession();
  const user = session?.session?.user;

  return (
    <section className="sm:flew-row container flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-xl font-medium sm:text-2xl">{`${getGreeting()}, ${user?.firstName || "User"}!`}</h1>
      <AddDreamButton />
    </section>
  );
}
