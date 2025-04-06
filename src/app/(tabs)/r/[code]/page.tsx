"use client";

import { useParams } from "next/navigation";

import { HandCoinsIcon, Loader2 } from "lucide-react";

import LoadingButton from "@/components/shared/loading-button";
import useGetReferrerByCode from "@/features/referrals/api/use-get-referrer-by-code";
import useProcessReferral from "@/features/referrals/api/use-process-referral";
import ReferralClaimed from "@/features/referrals/components/referral-claimed";
import ReferralError from "@/features/referrals/components/referral-error";
import { getDisplayName } from "@/features/referrals/utils/get-display-name";

export default function ReferralPage() {
  const { code } = useParams();
  const { data: referral, isLoading } = useGetReferrerByCode(code as string);
  const { processReferral, isLoading: isProcessingReferral } =
    useProcessReferral(code as string);

  if (isLoading) {
    return (
      <div className="container flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin" />
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  if (!referral || !referral.referrer) {
    return <ReferralError />;
  }

  const { referrer, hasClaimed } = referral;

  if (hasClaimed) {
    return <ReferralClaimed referrer={referrer} />;
  }

  return (
    <div className="container flex flex-1 flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-3xl font-bold">Congrats!</h1>
        <p className="text-muted-foreground">
          You&apos;ve been referred by {getDisplayName(referrer)}!
        </p>
      </div>
      <p>
        Click the button below for you and your friend to receive 500 credits
        each!
      </p>
      <LoadingButton
        isLoading={isProcessingReferral}
        onClick={processReferral}
        className="min-w-36 gap-2"
      >
        <HandCoinsIcon className="size-4" />
        <span>Claim credits</span>
      </LoadingButton>
    </div>
  );
}
