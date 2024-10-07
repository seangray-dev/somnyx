"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BookOpenIcon, CogIcon, LayoutDashboardIcon } from "lucide-react";

import { AddDreamButton } from "@/components/shared/add-dream-button";

export default function Tabs() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full border-t bg-background pb-6 shadow-[0_-2px_4px_rgba(0,0,0,0.1)] sm:hidden">
      <nav className="flex h-16 items-center justify-around">
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary"
          prefetch={false}
        >
          <LayoutDashboardIcon className="size-5" />
          <span className="text-xs font-medium">Dashboard</span>
        </Link>
        <Link
          href="/journal"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary"
          prefetch={false}
        >
          <BookOpenIcon className="size-5" />
          <span className="text-xs font-medium">Journal</span>
        </Link>
        <AddDreamButton isTab />
        {/* <Link
          href="#"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary"
          prefetch={false}
        >
          <SparklesIcon className="size-5" />
          <span className="text-xs font-medium">New Dream</span>
        </Link> */}
        <Link
          href="/settings"
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary"
          prefetch={false}
        >
          <CogIcon className="size-5" />
          <span className="text-xs font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
