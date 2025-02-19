"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import IconLogo from "@/components/shared/icon-logo";
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
            <Logo className="hidden sm:inline-flex" />
            <IconLogo className="inline-flex sm:hidden" />
          </div>
          <div className="mx-4 hidden h-7 items-center sm:flex">
            <Separator orientation="vertical" className="h-full bg-border" />
          </div>
          <div className="hidden h-full items-center gap-4 sm:flex">
            {!isLoggedIn && (
              <Link
                href="/interpret"
                className={cn(
                  "border-b border-transparent text-sm font-medium transition-all duration-150 hover:border-b-muted-foreground hover:text-muted-foreground",
                  pathname === "/interpret" && "border-b-primary text-primary"
                )}
              >
                Interpret
              </Link>
            )}
            <Link
              href="/dream-dictionary"
              className={cn(
                "border-b border-transparent text-sm font-medium transition-all duration-150 hover:border-b-muted-foreground hover:text-muted-foreground",
                (pathname === "/dream-dictionary" ||
                  pathname.startsWith("/dream-dictionary/")) &&
                  "border-b-primary text-primary"
              )}
            >
              <span className="hidden md:inline">Dream </span>{" "}
              <span>Dictionary</span>
            </Link>
            <Link
              href="/blog"
              className={cn(
                "border-b border-transparent text-sm font-medium transition-all duration-150 hover:border-b-muted-foreground hover:text-muted-foreground",
                (pathname === "/blog" || pathname.startsWith("/blog/")) &&
                  "border-b-primary text-primary"
              )}
            >
              Blog
            </Link>
          </div>
        </div>
        <HeaderActions />
      </nav>
    </header>
  );
}
