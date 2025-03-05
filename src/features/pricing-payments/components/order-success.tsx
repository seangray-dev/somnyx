"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import type { Stripe } from "stripe";

import { Button } from "@/components/ui/button";
import { createCreditEvent } from "@/features/_analytics/events/credits";
import { useAnalytics } from "@/features/_analytics/hooks/use-analytics";

import { formatPrice } from "../utils";

interface OrderSuccessProps {
  session: Stripe.Checkout.Session;
}

export default function OrderSuccess({ session }: OrderSuccessProps) {
  const { track } = useAnalytics();

  useEffect(() => {
    track(
      createCreditEvent("PURCHASE-SUCCESS", {
        stripeSessionId: session.id,
        packageId: session.metadata?.priceId,
        packageName: session.metadata?.packageName,
        creditAmount: Number(session.metadata?.credits),
        price: formatPrice(Number(session.amount_total ?? 0) / 100),
      })
    );
  }, []);

  return (
    <div className="container mx-auto flex flex-1 flex-col items-center justify-center gap-8 py-12">
      <Image
        width={300}
        height={300}
        alt=""
        src={"/images/order-success.svg"}
        className="mx-auto size-36"
      />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Order Success!</h1>
          <p className="text-muted-foreground">
            Thanks for your purchase, {session.customer_details?.name}! Happy
            dreaming!
          </p>
        </div>
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
