"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/shared/logo";
import { FeedbackDialog } from "@/features/feedback";

import { navigation } from "../../../features/navigation/components/header/footer-links";
import { shouldShowFooter } from "./hidden-paths";

export default function SiteFooter() {
  const pathname = usePathname();

  if (!shouldShowFooter(pathname)) {
    return null;
  }

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <Logo />
        <div className="flex flex-wrap justify-between gap-8 text-sm text-muted-foreground">
          <div className="flex flex-col gap-4">
            <h6 className="font-semibold text-foreground">Product</h6>
            <div className="flex flex-col gap-2">
              {navigation.product.map((item) => (
                <Link
                  key={item.name}
                  // @ts-expect-error
                  href={item.href}
                  className="hover:text-foreground hover:underline"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h6 className="font-semibold text-foreground">Free Resources</h6>
            <div className="flex flex-col gap-2">
              {navigation.freeResources.map((item) => (
                <Link
                  key={item.name}
                  // @ts-expect-error
                  href={item.href}
                  className="hover:text-foreground hover:underline"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h6 className="font-semibold text-foreground">Support</h6>
            <div className="flex flex-col gap-2">
              {navigation.support.map((item) => (
                <div key={item.name}>
                  {"type" in item ? (
                    <FeedbackDialog
                      type={item.type as "feedback" | "issue"}
                      trigger={
                        <button className="hover:text-foreground hover:underline">
                          {item.name}
                        </button>
                      }
                    />
                  ) : (
                    <Link
                      href={{ pathname: item.href }}
                      className="hover:text-foreground hover:underline"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h6 className="font-semibold text-foreground">Legal</h6>
            <div className="flex flex-col gap-2">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={{ pathname: item.href }}
                  className="hover:text-foreground hover:underline"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex flex-col items-center justify-center gap-1 py-8 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>
            Copyright © {new Date().getFullYear()} Somnyx. All rights reserved.
          </p>
          <div className="flex justify-center gap-1 sm:justify-end">
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
      </div>
    </footer>
  );
}
