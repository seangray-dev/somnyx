"use client";

import { usePathname } from "next/navigation";

import { useSession } from "@/lib/client-auth";

import DreamsInCurrentMonthCount from "./dreams-in-current-month-count";
import MostFrequentEmotion from "./most-frequent-emotion";
import TotalDreamsCount from "./total-dreams-count";

export default function Stats() {
  const pathname = usePathname();
  const { isLoggedIn } = useSession();

  if (pathname === "/settings" || !isLoggedIn) {
    return null;
  }

  return (
    <div className="container flex flex-col justify-around gap-2 border-b bg-secondary py-4 font-medium text-secondary-foreground sm:flex-row">
      <TotalDreamsCount />
      <DreamsInCurrentMonthCount />
      <MostFrequentEmotion />
    </div>
  );
}
