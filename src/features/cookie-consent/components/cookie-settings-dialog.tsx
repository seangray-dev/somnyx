"use client";

import Link from "next/link";
import { useState } from "react";

import { CookieIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cookieConsentGiven } from "@/utils/cookie-consent-given";

import CookieSettings from "./cookie-settings";

export function CookieSettingsDialog() {
  const [isOpen, setIsOpen] = useState(false);

  // Don't show the badge if user hasn't made an initial choice yet
  // (the main banner will be showing in this case)
  if (cookieConsentGiven() === "undecided") return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              >
                <CookieIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cookie Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cookie Settings</DialogTitle>
          <DialogDescription>
            Manage your cookie preferences for this device
            <br />
            <Link
              onClick={() => setIsOpen(false)}
              href="/privacy-policy"
              className="text-xs underline underline-offset-4 transition-all duration-150 hover:text-primary"
            >
              Learn more
            </Link>
          </DialogDescription>
        </DialogHeader>
        <CookieSettings />
      </DialogContent>
    </Dialog>
  );
}
