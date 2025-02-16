"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSession } from "@/lib/client-auth";
import { cn } from "@/lib/utils";

import { shouldShowLayout } from "../hidden-paths";
import HeaderActions from "./header-actions";
import SideNavigation from "./side-navigation";

export default function SiteHeader() {
  const pathname = usePathname();
  const { isLoggedIn } = useSession();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  if (isLoggedIn && !isDesktop && !shouldShowLayout(pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-t-4 border-t-primary bg-background/90 py-3 backdrop-blur">
      <nav className="container flex items-center justify-between gap-2">
        <div className="flex h-full items-center">
          <div className="flex h-full items-center gap-2">
            <SideNavigation />
            <Logo />
          </div>
          <div className="mx-4 flex h-7">
            <Separator orientation="vertical" className="h-full bg-border" />
          </div>
          <div className="hidden h-full items-center gap-4 sm:flex">
            <Link
              href="/interpret"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary hover:underline",
                pathname === "/interpret" && "text-primary underline"
              )}
            >
              Interpret
            </Link>
            <Link
              href="/dream-dictionary"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary hover:underline",
                (pathname === "/dream-dictionary" ||
                  pathname.startsWith("/dream-meaning/")) &&
                  "text-primary underline"
              )}
            >
              <span className="hidden md:inline">Dream </span>{" "}
              <span>Dictionary</span>
            </Link>
            <Link
              href="/blog"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary hover:underline",
                pathname === "/blog" && "text-primary underline"
              )}
            >
              Blog
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <HeaderActions />
        </div>
      </nav>
    </header>
  );
}
