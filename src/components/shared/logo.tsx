import Image from "next/image";
import Link from "next/link";

import { applicationName } from "@/config/app";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "relative flex h-8 w-[130px] items-center transition-opacity hover:opacity-70",
        className
      )}
      aria-label={`${applicationName} home`}
    >
      <Image
        className="h-auto w-full dark:invert"
        src="/images/logo.png"
        alt={`${applicationName} Logo`}
        width={130}
        height={32}
        priority
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAAAgCAQAAABBQj7cAAAAL0lEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAODXAEZYAAHyWq6bAAAAAElFTkSuQmCC"
      />
    </Link>
  );
}
