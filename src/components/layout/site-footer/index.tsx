"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/shared/logo";

import { legalLinks, resourcesLinks } from "./footer-links";

export default function SiteFooter() {
  const pathname = usePathname();

  const hiddenPaths = ["/dashboard", "/journal", "/settings"];

  if (hiddenPaths.includes(pathname) || pathname.startsWith("/dreams/")) {
    return null;
  }

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <Logo />
        <div className="flex flex-wrap justify-between gap-8 text-sm text-muted-foreground">
          <div className="flex flex-col gap-1">
            {resourcesLinks.map((link) => (
              <Link
                className="hover:text-foreground hover:underline"
                href={{ pathname: link.href }}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {legalLinks.map((link) => (
              <Link
                className="hover:text-foreground hover:underline"
                href={{ pathname: link.href }}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1 border-t py-3 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
        <p className="container">
          Copyright © {new Date().getFullYear()} Somnyx. All rights reserved.
        </p>
        <div className="container flex justify-center gap-1 sm:justify-end">
          <p>Built by</p>
          <a
            target="_blank"
            href="https://graytechsolutions.com"
            className="underline hover:text-foreground"
          >
            GrayTech Solutions
          </a>
        </div>
      </div>
    </footer>
  );
}
