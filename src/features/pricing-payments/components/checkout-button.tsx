import { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAction } from "convex/react";
import { toast } from "sonner";

import LoadingButton from "@/components/shared/loading-button";
import { api } from "@/convex/_generated/api";
import { createCreditEvent } from "@/features/_analytics/events/credits";
import { useAnalytics } from "@/features/_analytics/hooks/use-analytics";
import { useSession } from "@/lib/client-auth";

import { pricingOptions } from "../config/pricing-options";
import { formatPrice } from "../utils";

interface CheckoutButtonProps {
  product: { priceId: string; credits: number };
  label: string;
}

export default function CheckoutButton({
  product,
  label,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { track } = useAnalytics();
  // @ts-ignore
  const checkout = useAction(api.stripe.checkout);
  const router = useRouter();
  const { isLoggedIn } = useSession();
  const priceID = pricingOptions.find(
    (option) => option.priceId === product.priceId
  );

  const handleCheckout = async (product: {
    priceId: string;
    credits: number;
  }) => {
    if (product.priceId === "starter") {
      router.push("/sign-up" as Route);
      return;
    }

    if (!isLoggedIn) {
      toast.error("You must be logged in to make a purchase.");
      return;
    }

    const url = await checkout({ product });

    if (!url) {
      track(
        createCreditEvent("PURCHASE-ERROR", {
          packageId: product.priceId,
          packageName: priceID?.name,
          creditAmount: product.credits,
          price: formatPrice(priceID?.price ?? 0),
          error: "Failed to generate checkout URL",
        })
      );
      toast.error("Something went wrong. Please try again.");
      return;
    }

    track(
      createCreditEvent("PACKAGE-SELECTED", {
        packageId: product.priceId,
        packageName: priceID?.name,
        creditAmount: product.credits,
        price: formatPrice(priceID?.price ?? 0),
      })
    );

    router.push(url as Route);
  };

  const handleClick = async () => {
    setIsLoading(true);
    await handleCheckout(product);
    setIsLoading(false);
  };

  return (
    <LoadingButton
      isLoading={isLoading}
      onClick={handleClick}
      className="w-full"
    >
      {label}
    </LoadingButton>
  );
}
