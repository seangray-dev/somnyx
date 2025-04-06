import Link from "next/link";

import { CheckCircle2 } from "lucide-react";

import { getDisplayName } from "../utils/get-display-name";

interface Referrer {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string;
}

export default function ReferralClaimed({ referrer }: { referrer: Referrer }) {
  return (
    <div className="container flex flex-1 flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <CheckCircle2 className="mb-2 size-10 text-primary" />
        <h1 className="text-3xl font-bold">Already Claimed!</h1>
        <p className="text-muted-foreground">
          You&apos;ve already claimed a referral from {getDisplayName(referrer)}
        </p>
      </div>
      <p className="text-center text-muted-foreground">
        You can only claim one referral. Head to your{" "}
        <Link className="font-medium underline" href="/dashboard">
          dashboard
        </Link>{" "}
        to see your credits!
      </p>
    </div>
  );
}
