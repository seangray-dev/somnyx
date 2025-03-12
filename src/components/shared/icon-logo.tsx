import Image from "next/image";
import Link from "next/link";

import { applicationName } from "@/config/app";
import { cn } from "@/lib/utils";

import logoIcon from "../../../public/images/logo-icon-white.png";

export default function IconLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "relative flex h-8 w-8 items-center transition-opacity hover:opacity-70",
        className
      )}
      aria-label={`${applicationName} home`}
    >
      <Image
        className="h-auto w-full invert dark:invert-0"
        src={logoIcon}
        alt={`${applicationName} Logo`}
        width={32}
        height={32}
        priority
        placeholder="blur"
      />
    </Link>
  );
}
