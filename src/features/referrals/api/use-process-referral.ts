import { useRouter } from "next/navigation";
import { useState } from "react";

import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";

export default function useProcessReferral(referralCode: string) {
  const router = useRouter();
  const processReferral = useMutation(api.mutations.referrals.processReferral);
  const [isLoading, setIsLoading] = useState(false);

  const handleProcessReferral = async () => {
    try {
      setIsLoading(true);
      await processReferral({ referralCode });
      toast.success("Referral code applied!");
      router.push("/dashboard");
      return true;
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("already claimed")) {
        toast.error("You've already claimed this referral");
      } else if (error.message?.includes("already used a referral")) {
        toast.error("You can only claim one referral");
      } else {
        toast.error("Failed to apply referral code");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { processReferral: handleProcessReferral, isLoading };
}
