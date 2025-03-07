"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CookieIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cookieConsentGiven } from "@/utils/cookie-consent-given";

export default function CookieConsent({
  onAcceptCallback = () => {},
  onDeclineCallback = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hide, setHide] = useState(false);

  const accept = () => {
    setIsOpen(false);
    localStorage.setItem("somnyx_cookie_consent", "yes");
    setTimeout(() => {
      setHide(true);
    }, 700);
    onAcceptCallback();
  };

  const decline = () => {
    setIsOpen(false);
    localStorage.setItem("somnyx_cookie_consent", "no");
    setTimeout(() => {
      setHide(true);
    }, 700);
    onDeclineCallback();
  };

  useEffect(() => {
    try {
      const consent = cookieConsentGiven();
      if (consent === "undecided") {
        setIsOpen(true);
      } else {
        setIsOpen(false);
        setTimeout(() => {
          setHide(true);
        }, 700);
      }
    } catch (e) {}
  }, []);

  return (
    <div
      className={cn(
        "fixed z-[200] duration-700",
        "bottom-0 left-0 right-0 w-full",
        "sm:bottom-4 sm:left-auto sm:right-4 sm:w-full sm:max-w-sm",
        !isOpen
          ? "translate-y-8 opacity-0 transition-[opacity,transform]"
          : "translate-y-0 opacity-100 transition-[opacity,transform]",
        hide && "hidden"
      )}
    >
      <Card className="rounded-none sm:mx-0 sm:rounded-lg">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Cookie Consent</CardTitle>
          <CookieIcon size={18} />
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p className="text-sm">
            We use cookies and similar technologies for:
            <ul className="mt-2 list-disc pl-4 text-sm">
              <li>Essential website functionality</li>
              <li>Analytics and performance tracking via PostHog</li>
            </ul>
          </p>
          <p className="text-xs">
            By clicking{" "}
            <span className="font-medium opacity-80">&quot;Accept&quot;</span>,
            you consent to analytics tracking. Essential cookies will be used
            regardless of choice. You can change these settings at any time.
            <br />
          </p>
          <Link
            href="/privacy-policy"
            className="text-xs underline transition-all duration-150 hover:text-primary"
          >
            Learn more
          </Link>
        </CardContent>
        <CardFooter className="flex gap-2 border-t py-4">
          <Button onClick={decline} className="w-full" variant="secondary">
            Decline
          </Button>
          <Button onClick={accept} className="w-full">
            Accept
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
