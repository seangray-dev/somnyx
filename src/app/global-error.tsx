"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import * as Sentry from "@sentry/nextjs";
import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 antialiased">
        <div className="flex max-w-xl flex-col items-center gap-6">
          <Image alt="" width={200} height={200} src="/images/error.svg" />
          <h2 className="text-center text-2xl font-semibold">
            Oops, something went wrong!
          </h2>
          <div className="text-center">
            <p>
              If you believe this is a bug or need further assistance,{" "}
              <Link
                href="/support"
                target="_blank"
                className="font-medium underline"
              >
                contact support
              </Link>
            </p>
          </div>
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
          <Button className="w-full" onClick={reset}>
            Try again
          </Button>

          <Link className="font-medium underline" href="/">
            Visit Home Page
          </Link>
        </div>
      </body>
    </html>
  );
}
