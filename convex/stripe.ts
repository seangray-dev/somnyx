"use node";

import { v } from "convex/values";
import Stripe from "stripe";

import { baseUrl } from "../src/config/app";
import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

type Metadata = {
  userId: string;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export const checkout = action({
  args: {
    product: v.object({ priceId: v.string(), credits: v.number() }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      return undefined;
    }

    if (!user.emailVerified) {
      return undefined;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: args.product.priceId,
          quantity: 1,
          adjustable_quantity: { enabled: true, minimum: 0 },
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: user.subject,
        credits: args.product.credits,
      },
      mode: "payment",
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: baseUrl,
    });

    return session.url;
  },
});

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, args) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    try {
      // Convert payload to raw buffer as Stripe expects
      const payloadBuffer = Buffer.from(args.payload);

      const event = stripe.webhooks.constructEvent(
        payloadBuffer,
        args.signature,
        webhookSecret
      );

      console.log("Webhook event received:", {
        type: event.type,
        id: event.id,
      });

      const completedEvent = event.data.object as Stripe.Checkout.Session & {
        metadata: Metadata;
      };

      if (event.type === "checkout.session.completed") {
        console.log("Processing completed checkout:", {
          sessionId: completedEvent.id,
          metadata: completedEvent.metadata,
        });

        const userId = completedEvent.metadata.userId;
        const credits = parseInt(completedEvent.metadata.credits);

        // @ts-expect-error - Type instantiation is excessively deep and possibly infinite.
        await ctx.runMutation(internal.users.updateUserCredits, {
          userId,
          amount: credits,
        });

        console.log("Credits updated successfully:", {
          userId,
          credits,
        });
      }

      return { success: true };
    } catch (err) {
      console.error("Webhook error:", err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});
