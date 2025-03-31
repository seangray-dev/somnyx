import ReferallInfo from "@/features/referrals/components/referall-info";

export default function ReferralsPage() {
  return (
    <div className="container flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Referrals</h1>
      <ReferallInfo />
    </div>
  );
}
