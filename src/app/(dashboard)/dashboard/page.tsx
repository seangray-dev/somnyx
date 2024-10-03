"use client";

import { AddDreamButton } from "@/components/dashboard/add-dream-button";
import { useSession } from "@/lib/client-auth";
import getGreeting from "@/utils/get-greeting";

export default function DashboardPage() {
  const session = useSession();

  const user = session?.session?.user;

  return (
    <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
      <h1 className="text-xl font-medium">{`${getGreeting()}, ${user?.firstName || "User"}!`}</h1>
      <AddDreamButton />
    </div>
  );
}
