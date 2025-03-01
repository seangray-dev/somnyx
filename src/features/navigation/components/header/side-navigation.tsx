import { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth, useSession } from "@clerk/nextjs";
import { LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";

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

import { navigationLinks } from "../../config/links";
import { navigation } from "./footer-links";

export default function SideNavigation({
  side = "left",
}: {
  side?: "left" | "right" | "bottom" | "top";
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useSession();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleAuthClick = () => {
    if (isSignedIn) {
      signOut();
    } else {
      setOpen(false);
      router.push("/sign-in" as Route);
    }
  };

  // Filter links based on authentication state
  const visibleLinks = navigationLinks.filter((link) =>
    isSignedIn
      ? link.visibility === "private" || link.visibility === "both"
      : link.visibility === "public" || link.visibility === "both"
  );

  // Separate authenticated features
  const authenticatedLinks = visibleLinks.filter(
    (link) => link.visibility === "private"
  );
  const publicLinks = visibleLinks.filter(
    (link) => link.visibility !== "private"
  );

  const renderNavLink = (link: any) => (
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
      <Link href={link.href}>{link.label}</Link>
    </Button>
  );

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
            {/* Show authenticated features first if logged in */}
            {isSignedIn && (
              <>
                {authenticatedLinks.map(renderNavLink)}
                <div className="my-2 border-t" />
              </>
            )}
            {/* Always show public links */}
            {publicLinks.map(renderNavLink)}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              className="flex w-fit items-center gap-4 text-foreground hover:text-muted-foreground"
              variant={"link"}
              onClick={handleAuthClick}
            >
              {isSignedIn ? (
                <>
                  <LogOutIcon size={16} /> Sign Out
                </>
              ) : (
                <>
                  <LogInIcon size={16} /> Sign In
                </>
              )}
            </Button>
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
                  <Link href={link.href as Route}>{link.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
