import type { Stripe } from "stripe";

import { action } from "../_generated/server";
import { stripe } from "../stripe";

export const getOrders = action({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      return [];
    }

    try {
      // First get the customer by email
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (!customers.data.length) {
        // No customer found with this email
        return [];
      }

      const customerId = customers.data[0].id;

      // Then get the sessions for this customer
      const sessions = await stripe.checkout.sessions.list({
        customer: customerId,
        limit: 10,
        expand: ["data.line_items", "data.payment_intent"],
      });

      return sessions.data.map((session) => {
        const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
        const paymentMethod =
          paymentIntent?.payment_method as Stripe.PaymentMethod;

        return {
          id: paymentIntent?.id || session.id,
          amount: session.amount_total,
          credits: session.metadata?.credits,
          status: session.payment_status,
          date: new Date(session.created * 1000).toISOString(),
          paymentMethod: paymentMethod
            ? {
                brand: paymentMethod.card?.brand || "unknown",
                last4: paymentMethod.card?.last4 || "0000",
              }
            : undefined,
        };
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },
});
