import { Metadata } from "next";

import { env } from "process";
import Stripe from "stripe";

import { SEO } from "@/config/app";
import OrderError from "@/features/pricing-payments/components/order-error";
import OrderSuccess from "@/features/pricing-payments/components/order-success";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-04-10",
  });

  if (!sessionId) {
    return <OrderError sessionId="none" error="No session ID provided" />;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return <OrderSuccess session={session} />;
  } catch (error) {
    console.error("Error retrieving session:", error);
    return (
      <OrderError
        sessionId={sessionId}
        error={
          error instanceof Error ? error.message : "Failed to retrieve session"
        }
      />
    );
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.pages.orderSuccess.title,
    description: SEO.pages.orderSuccess.description,
    openGraph: {
      title: SEO.pages.orderSuccess.title,
      description: SEO.pages.orderSuccess.description,
    },
    twitter: {
      title: SEO.pages.orderSuccess.title,
      description: SEO.pages.orderSuccess.description,
    },
  };
}
