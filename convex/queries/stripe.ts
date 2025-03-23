import { action } from "../_generated/server";
import { stripe } from "../stripe";

export const getOrders = action({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      return [];
    }

    const sessions = await stripe.checkout.sessions.list({
      customer: user.email,
      limit: 10,
      expand: ["data.line_items"],
    });

    return sessions.data.map((session) => ({
      id: session.id,
      amount: session.amount_total,
      credits: session.metadata?.credits,
      status: session.payment_status,
      date: new Date(session.created * 1000).toISOString(),
      items: session.line_items?.data || [],
    }));
  },
});
