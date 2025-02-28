import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth, useSession } from "@clerk/nextjs";
import { LogOutIcon, MenuIcon } from "lucide-react";

import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { navigation } from "../site-footer/footer-links";
import { getPrivateLinks, getPublicLinks } from "./links";

export default function SideNavigation({
  side = "left",
}: {
  side?: "left" | "right" | "bottom" | "top";
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useSession();
  const { signOut } = useAuth();

  const navigationLinks = isSignedIn ? getPrivateLinks() : getPublicLinks();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="sm:hidden">
        <Button variant="ghost" size="icon">
          <MenuIcon size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side={side} className="flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="mx-auto">
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-1 flex-col gap-2">
            {navigationLinks.map((link) => (
              <Button
                onClick={() => setOpen(false)}
                variant={"link"}
                key={link.label}
                className={cn(
                  "flex w-fit items-center gap-4 text-foreground hover:text-muted-foreground",
                  ((pathname.startsWith(link.href) && link.href !== "/") ||
                    pathname === link.href) &&
                    "text-primary underline"
                )}
              >
                {link.icon}
                {/* @ts-expect-error */}
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {isSignedIn && (
              <Button
                className="w-fit flex-row items-center gap-4"
                variant={"ghost"}
                onClick={() => signOut()}
              >
                <LogOutIcon size={16} />
                Sign Out
              </Button>
            )}
            <div className="border-t pt-4">
              {navigation.legal.map((link) => (
                <Button
                  onClick={() => setOpen(false)}
                  variant={"link"}
                  key={link.name}
                  className={cn(
                    "flex w-fit items-center gap-4 text-foreground hover:text-muted-foreground",
                    ((pathname.startsWith(link.href) && link.href !== "/") ||
                      pathname === link.href) &&
                      "text-primary underline"
                  )}
                >
                  {/* @ts-expect-error */}
                  <Link href={link.href}>{link.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
