"use client";

import { usePathname } from "next/navigation";

import { useSession } from "@/lib/client-auth";

import DreamsInCurrentMonthCount from "./dreams-in-current-month-count";
import TotalDreamsCount from "./total-dreams-count";

export default function Stats() {
  const pathname = usePathname();
  const { isLoggedIn, isLoaded } = useSession();

  if (pathname === "/settings" || (!isLoggedIn && isLoaded)) {
    return null;
  }

  return (
    <section className="bg-secondary">
      <div className="container flex flex-col justify-around gap-2 py-4 font-medium sm:flex-row">
        <TotalDreamsCount />
        <DreamsInCurrentMonthCount />
      </div>
    </section>
  );
}
