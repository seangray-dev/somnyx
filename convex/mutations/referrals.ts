import { v } from "convex/values";
import { nanoid } from "nanoid";

import { internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";
import { getUserId } from "../util";

const REFERRAL_CODE_LENGTH = 6;
const REFERRAL_REWARD_AMOUNT = 500;
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

export const processReferral = mutation({
  args: {
    referralCode: v.string(),
  },
  handler: async (ctx, { referralCode }) => {
    const refereeId = await getUserId(ctx);
    if (!refereeId) {
      console.error("User is not logged in", {
        referralCode,
      });
      throw new Error("You must be logged in to use a referral code");
    }

    // Find the referral
    const referral = await ctx.db
      .query("referrals")
      .withIndex("by_referralCode", (q) => q.eq("referralCode", referralCode))
      .first();

    if (!referral) {
      console.error("Invalid referral code", {
        referralCode,
      });
      throw new Error("Invalid referral code");
    }

    // Check if user has already been referred
    const hasBeenReferred = referral.referees.some(
      (referee) => referee.refereeId === refereeId
    );

    if (hasBeenReferred) {
      console.error("User has already used this referral code", {
        refereeId,
        referralCode,
      });
      throw new Error("You have already used this referral code");
    }

    // Check if user is trying to use their own code
    if (referral.referrerId === refereeId) {
      console.error("User is trying to use their own referral code", {
        refereeId,
        referralCode,
      });
      throw new Error("You cannot use your own referral code");
    }

    // Add the referee to the list
    await ctx.db.patch(referral._id, {
      referees: [
        ...referral.referees,
        {
          refereeId,
          completedAt: Date.now(),
          rewardAmount: REFERRAL_REWARD_AMOUNT,
        },
      ],
    });

    // Update both users credits
    // @ts-ignore
    await ctx.runMutation(internal.users.updateUserCredits, {
      userId: refereeId,
      amount: REFERRAL_REWARD_AMOUNT,
    });

    await ctx.runMutation(internal.users.updateUserCredits, {
      userId: referral.referrerId,
      amount: REFERRAL_REWARD_AMOUNT,
    });

    return true;
  },
});


