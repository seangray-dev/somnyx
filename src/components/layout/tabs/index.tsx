"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BookOpenIcon, CogIcon, LayoutDashboardIcon } from "lucide-react";

import { AddDreamButton } from "@/components/shared/add-dream-button";
import { useSession } from "@/lib/client-auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboardIcon },
  { href: "/journal", label: "Journal", Icon: BookOpenIcon },
  { href: "/settings", label: "Settings", Icon: CogIcon },
];

export default function Tabs() {
  const pathname = usePathname();
  const { isLoggedIn } = useSession();

  if (pathname === "/" || !isLoggedIn) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full border-t bg-background pb-5 shadow-[0_-2px_4px_rgba(0,0,0,0.1)] sm:hidden">
      <nav className="flex h-16 items-center justify-around">
        {/* Render the first two items */}
        {navItems.slice(0, 2).map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={{ pathname: href }}
              className={`flex flex-col items-center justify-center gap-1 transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              prefetch={false}
            >
              <Icon className="size-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}

        {/* AddDreamButton as the 3rd item */}
        <AddDreamButton isTab />

        {/* Render the rest of the items */}
        {navItems.slice(2).map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={{ pathname: href }}
              className={`flex flex-col items-center justify-center gap-1 transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              prefetch={false}
            >
              <Icon className="size-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
