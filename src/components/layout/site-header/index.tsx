"use client";

import { usePathname } from "next/navigation";

import Logo from "@/components/shared/logo";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSession } from "@/lib/client-auth";

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
        <HeaderActions />
      </nav>
    </header>
  );
}
