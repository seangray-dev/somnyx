import Link from "next/link";
import { useState } from "react";

import { MenuIcon } from "lucide-react";

import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { navigation } from "../site-footer/footer-links";
import { links } from "./links";

export default function SideNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="sm:hidden">
        <Button variant="ghost" size="icon">
          <MenuIcon size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="mx-auto">
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-2">
            {links.map((link) => (
              <Button
                onClick={() => setOpen(false)}
                variant={"link"}
                key={link.label}
                className="flex items-center gap-4 text-foreground hover:text-primary"
              >
                {link.icon}
                {/* @ts-expect-error */}
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t pt-4">
            {navigation.legal.map((link) => (
              <Button
                onClick={() => setOpen(false)}
                variant={"link"}
                key={link.name}
                className="flex w-fit items-center gap-4 text-foreground hover:text-primary"
              >
                {/* @ts-expect-error */}
                <Link href={link.href}>{link.name}</Link>
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
