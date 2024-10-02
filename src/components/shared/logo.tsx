import Link from "next/link";

import { appplicationName } from "@/config/app";

export default function Logo() {
  return (
    <div className="font-serif text-xl font-bold uppercase">
      <Link href="/" className="w-fit transition-opacity hover:opacity-70">
        {appplicationName}
      </Link>
    </div>
  );
}
