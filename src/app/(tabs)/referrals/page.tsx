import ReferralInfo from "@/features/referrals/components/referral-info";

export default function ReferralsPage() {
  return (
    <div className="container flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Referrals</h1>
      <ReferralInfo />
    </div>
  );
}
