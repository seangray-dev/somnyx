import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-1 flex-col items-center justify-center gap-8 py-20">
      <Image src="/images/404.svg" alt="Not Found" width={200} height={200} />
      <div className="flex flex-col items-center gap-4 text-center">
        <div>
          <h2 className="text-2xl font-bold">404: Page Not Found</h2>
          <p className="text-balance text-sm text-muted-foreground">
            The page you are looking for does not exist.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};
