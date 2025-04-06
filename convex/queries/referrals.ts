import { v } from "convex/values";

import { query } from "../_generated/server";
import { getUserId } from "../util";

export const getMyReferrals = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      console.error("User not authenticated");
      return null;
    }

    // Get user's own referral info
    const referral = await ctx.db
      .query("referrals")
      .withIndex("by_referrerId", (q) => q.eq("referrerId", userId))
      .first();

    if (!referral) {
      console.error("Referral not found for user", userId);
      return null;
    }

    // Get all referrals to find who referred this user
    const allReferrals = await ctx.db.query("referrals").collect();
    const referrerInfo = allReferrals.find((r) =>
      r.referees.some((referee) => referee.refereeId === userId)
    );

    let referrer = null;
    if (referrerInfo) {
      const referrerUser = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", referrerInfo.referrerId))
        .first();

      if (referrerUser) {
        referrer = {
          firstName: referrerUser.first_name,
          lastName: referrerUser.last_name,
          email: referrerUser.email,
          completedAt: referrerInfo.referees.find((r) => r.refereeId === userId)
            ?.completedAt,
        };
      }
    }

    const refereesWithEmails = await Promise.all(
      referral.referees.map(async (referee) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", referee.refereeId))
          .first();
        return {
          ...referee,
          email: user?.email,
        };
      })
    );

    return { ...referral, referees: refereesWithEmails, referrer };
  },
});

export const getReferrerByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const currentUserId = await getUserId(ctx);

    // First check if user has claimed any referral
    let hasClaimed = false;
    let claimedReferral = null;
    if (currentUserId) {
      const allReferrals = await ctx.db.query("referrals").collect();
      claimedReferral = allReferrals.find((referral) =>
        referral.referees.some((referee) => referee.refereeId === currentUserId)
      );
      hasClaimed = !!claimedReferral;
    }

    // If user has claimed a referral, show that referrer's info
    if (hasClaimed && claimedReferral) {
      const referrerUser = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) =>
          q.eq("userId", claimedReferral.referrerId)
        )
        .first();

      if (!referrerUser) {
        console.error(
          "Referrer not found for claimed referral",
          claimedReferral.referrerId
        );
        return null;
      }

      return {
        referral: claimedReferral,
        referrer: {
          firstName: referrerUser.first_name,
          lastName: referrerUser.last_name,
          email: referrerUser.email,
        },
        hasClaimed: true,
      };
    }

    // If user hasn't claimed, show the info for the requested referral code
    const referral = await ctx.db
      .query("referrals")
      .withIndex("by_referralCode", (q) => q.eq("referralCode", args.code))
      .first();

    if (!referral) {
      console.error("Referral not found for code", args.code);
      return null;
    }

    if (referral.referees.length >= 5) {
      console.error("Referral has too many referees", referral.referees.length);
      return null;
    }

    const referrerUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", referral.referrerId))
      .first();

    if (!referrerUser) {
      console.error("Referrer not found for referral", referral.referrerId);
      return null;
    }

    return {
      referral,
      referrer: {
        firstName: referrerUser.first_name,
        lastName: referrerUser.last_name,
        email: referrerUser.email,
      },
      hasClaimed: false,
    };
  },
});
