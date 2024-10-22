"use client";

import { usePathname } from "next/navigation";

import { useSession } from "@/lib/client-auth";

import DreamsInCurrentMonthCount from "./dreams-in-current-month-count";
import MostFrequentEmotion from "./most-frequent-emotion";
import TotalDreamsCount from "./total-dreams-count";

export default function Stats() {
  const pathname = usePathname();
  const { isLoggedIn, isLoaded } = useSession();

  if (pathname === "/settings" || (!isLoggedIn && isLoaded)) {
    return null;
  }

  return (
    <div className="border-b bg-secondary py-4 font-medium text-secondary-foreground">
      <div className="container flex flex-col justify-around gap-2 sm:flex-row sm:items-center">
        <TotalDreamsCount />
        <DreamsInCurrentMonthCount />
        <MostFrequentEmotion />
      </div>
    </div>
  );
}
