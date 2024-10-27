import Image from "next/image";
import Link from "next/link";

import Stripe from "stripe";

import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-04-10",
  });

  if (!sessionId) {
    console.error("No session ID provided.");
    return <p>Error: No session ID provided.</p>;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const customerName = session.customer_details?.name;

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
              Thanks for your purchase, {customerName}! Happy dreaming!
            </p>
          </div>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error retrieving session:", error);
    return (
      <div className="container flex flex-col items-center justify-center py-12">
        Error retrieving session details. Please try again later.
      </div>
    );
  }
}
