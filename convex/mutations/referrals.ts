import { v } from "convex/values";
import { nanoid } from "nanoid";

import { internalMutation } from "../_generated/server";

const REFERRAL_CODE_LENGTH = 6;

export const createReferralCode = internalMutation({
  args: {
    referrerId: v.string(),
  },
  handler: async (ctx, { referrerId }) => {
    // Generate a unique referral code
    const referralCode = nanoid(REFERRAL_CODE_LENGTH).toUpperCase();

    // Create the referral record
    await ctx.db.insert("referrals", {
      referrerId,
      referralCode,
      referees: [],
    });

    return referralCode;
  },
});

// Migration function to create referral codes for all existing users
export const createReferralCodesForExistingUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all users
    const users = await ctx.db.query("users").collect();

    // Get existing referrals to avoid duplicates
    const existingReferrals = await ctx.db.query("referrals").collect();
    const existingReferrerIds = new Set(
      existingReferrals.map((r) => r.referrerId)
    );

    // Create referral codes for users who don't have one
    for (const user of users) {
      if (!existingReferrerIds.has(user.userId)) {
        const referralCode = nanoid(REFERRAL_CODE_LENGTH).toUpperCase();
        await ctx.db.insert("referrals", {
          referrerId: user.userId,
          referralCode,
          referees: [],
        });
        console.log(
          `Created referral code ${referralCode} for user ${user.userId}`
        );
      }
    }

    return { success: true };
  },
});
