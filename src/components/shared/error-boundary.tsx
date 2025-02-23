"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import * as Sentry from "@sentry/nextjs";
import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env/server";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const isProduction = env.NODE_ENV === "production";
  const errorReference = error.digest || "unknown";

  return (
    <div
      className="container mx-auto flex flex-1 flex-col items-center justify-center p-4 antialiased"
      role="alert"
      aria-labelledby="error-title"
      aria-describedby="error-description"
    >
      <div className="flex max-w-xl flex-col items-center gap-6">
        <Image
          alt="Error illustration"
          width={200}
          height={200}
          src="/images/error.svg"
          priority
        />
        <h2 id="error-title" className="text-center text-2xl font-semibold">
          Oops, something went wrong!
        </h2>
        <div id="error-description" className="text-center">
          <p>
            If you believe this is a bug or need further assistance,{" "}
            <Link
              href="/support"
              target="_blank"
              className="font-medium underline"
              aria-label="Contact support for assistance"
            >
              contact support
            </Link>
            {isProduction && (
              <span className="mt-2 block text-sm text-muted-foreground">
                Please reference error ID: {errorReference}
              </span>
            )}
          </p>
        </div>
        <Alert
          variant="destructive"
          role="status"
          className="bg-destructive text-destructive-foreground"
        >
          <AlertCircleIcon
            className="h-4 w-4 fill-destructive-foreground"
            aria-hidden="true"
          />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {isProduction
              ? "An unexpected error occurred. Our team has been notified."
              : error.message}
          </AlertDescription>
        </Alert>
        <Button
          className="w-full"
          onClick={reset}
          aria-label="Attempt to recover from error"
        >
          Try again
        </Button>

        <Link
          className="font-medium underline"
          href="/"
          aria-label="Return to home page"
        >
          Visit Home Page
        </Link>
      </div>
    </div>
  );
}
