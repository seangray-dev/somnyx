import Image from "next/image";
import Link from "next/link";

import { applicationName } from "@/config/app";

export default function Logo() {
  return (
    <div className="font-serif text-xl font-bold uppercase">
      <Link href="/" className="w-fit transition-opacity hover:opacity-70">
        <Image
          className="dark:invert"
          src="/images/logo.png"
          alt={applicationName}
          width={130}
          height={130}
        />
      </Link>
    </div>
  );
}
