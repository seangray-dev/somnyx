"use client";

import { usePathname } from "next/navigation";

import Logo from "@/components/shared/logo";

import HeaderActions from "./header-actions";

export default function SiteHeader() {
  const pathname = usePathname();

  const hiddenPaths = ["/dashboard", "/journal", "/settings"];

  if (hiddenPaths.includes(pathname) || pathname.startsWith("/dreams/")) {
    return null;
  }

  return (
    <header className="z-50border-b sticky top-0 border-t-4 border-t-primary bg-background/90 py-3 backdrop-blur">
      <nav className="container flex items-center justify-between">
        <Logo />
        <HeaderActions />
      </nav>
    </header>
  );
}
