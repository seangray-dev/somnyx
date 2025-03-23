"use node";

import { v } from "convex/values";
import Stripe from "stripe";

import { baseUrl } from "../src/config/app";
import { internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

type Metadata = {
  userId: string;
};

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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
  args: {
    payload: v.string(),
    signature: v.string(),
  },
  handler: async (ctx, args) => {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        args.payload,
        args.signature,
        endpointSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed.", err);
      return { success: false };
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session & {
            metadata: Metadata & { credits: string };
          };

          const userId = session.metadata.userId;
          if (!userId) {
            throw new Error("No userId found in session metadata");
          }

          const credits = parseInt(session.metadata.credits);
          await ctx.runMutation(internal.users.updateUserCredits, {
            userId,
            amount: credits,
          });
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      return { success: true };
    } catch (err) {
      console.error("Error processing webhook:", err);
      return { success: false };
    }
  },
});
