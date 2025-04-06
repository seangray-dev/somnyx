import Link from "next/link";

import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ReferralError() {
  return (
    <div className="container flex flex-1 flex-col items-center justify-center gap-4">
      <Alert className="max-w-sm bg-destructive text-destructive-foreground">
        <div className="flex items-center gap-2">
          <AlertCircleIcon className="-mt-1 h-4 w-4" />
          <AlertTitle className="text-lg">
            We&apos;re sorry for the inconvenience
          </AlertTitle>
        </div>
        <AlertDescription className="pt-2">
          It looks like this referral code is invalid or another problem has
          occurred.
          <span className="block pt-2">
            Please try again or{" "}
            <Link
              href="/support"
              target="_blank"
              className="font-medium underline"
            >
              contact support
            </Link>
          </span>
        </AlertDescription>
      </Alert>
    </div>
  );
}
