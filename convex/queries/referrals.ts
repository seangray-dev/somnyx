import { query } from "../_generated/server";
import { getUserId } from "../util";

export const getMyReferralCode = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      console.error("User not authenticated");
      return null;
    }
    const referralCode = await ctx.db
      .query("referrals")
      .withIndex("by_referrerId", (q) => q.eq("referrerId", userId))
      .first();

    if (!referralCode) {
      console.error("Referral code not found for user", userId);
      return null;
    }

    return referralCode.referralCode;
  },
});
