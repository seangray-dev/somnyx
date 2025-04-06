"use client";

import { useState } from "react";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { baseUrl } from "@/config/app";
import { cn } from "@/lib/utils";

import useGetMyReferrals from "../api/use-get-my-referrals";
import { getDisplayName } from "../utils/get-display-name";

interface Referee {
  refereeId: string;
  completedAt: number;
  rewardAmount: number;
  email: string | undefined;
}

interface Referrer {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string;
  completedAt: number | undefined;
}

export default function ReferralInfo() {
  const { data: referrals, isLoading: isLoadingReferrals } =
    useGetMyReferrals();
  const [copied, setCopied] = useState<boolean>(false);
  const { referralCode, referees = [], referrer } = referrals || {};

  const isLoading = isLoadingReferrals;

  if (isLoading) {
    return null;
  }

  const isDev = process.env.NODE_ENV === "development";
  const domain = isDev ? "localhost:3000" : baseUrl;
  const referralLink = `${domain}/r/${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const claims = referees.length;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {referrer ? (
              <>
                You were referred by {getDisplayName(referrer)} on{" "}
                {referrer.completedAt &&
                  new Date(referrer.completedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </>
            ) : (
              "You have not been referred. Use a referral link to get free credits!"
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Refer friends and earn free credits</CardTitle>
          <CardDescription>
            Each time you refer someone, both you and your friend will receive
            500 free credits.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Input
            className="max-w-72"
            type="text"
            readOnly
            value={referralLink}
          />
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="disabled:opacity-100"
                  onClick={handleCopy}
                  aria-label={copied ? "Copied" : "Copy to clipboard"}
                  disabled={copied}
                >
                  <div
                    className={cn(
                      "transition-all",
                      copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    )}
                  >
                    <Check
                      className="stroke-emerald-500"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    className={cn(
                      "absolute transition-all",
                      copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
                    )}
                  >
                    <Copy size={16} strokeWidth={2} aria-hidden="true" />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 text-xs">
                Click to copy
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your referrals ({claims} / 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {referees.length > 0 ? (
              <ul className="space-y-1">
                {referees.map((referee: Referee) => (
                  <li key={referee.refereeId}>
                    {referee.email} -{" "}
                    {referee.completedAt
                      ? new Date(referee.completedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Pending"}
                  </li>
                ))}
              </ul>
            ) : (
              "No referrals yet. Share your referral link to get started!"
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
