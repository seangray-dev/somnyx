import Image from "next/image";
import Link from "next/link";

import { applicationName } from "@/config/app";
import { cn } from "@/lib/utils";

import logo from "../../../public/images/logo.png";

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
        src={logo}
        alt={`${applicationName} Logo`}
        width={130}
        height={32}
        priority
        placeholder="blur"
      />
    </Link>
  );
}
