"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/shared/logo";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSession } from "@/lib/client-auth";
import { cn } from "@/lib/utils";

import { shouldShowLayout } from "../hidden-paths";
import HeaderActions from "./header-actions";

export default function SiteHeader() {
  const pathname = usePathname();
  const { isLoggedIn } = useSession();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  if (isLoggedIn && !isDesktop && !shouldShowLayout(pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-t-4 border-t-primary bg-background/90 py-3 backdrop-blur">
      <nav className="container flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-6 sm:flex">
            <Link
              href="/dream-dictionary"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary hover:underline",
                pathname === "/dream-dictionary" && "text-primary underline"
              )}
            >
              Dream Dictionary
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
          <HeaderActions />
        </div>
      </nav>
    </header>
  );
}
