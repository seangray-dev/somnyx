import { ConvexError, v } from "convex/values";

import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "./mutations/notificationPreferences";
import { getUserId } from "./util";

export const updateUser = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
    profileImage: v.string(),
    first_name: v.string(),
    last_name: v.string(),
  },
  handler: async (ctx, args) => {
    let user = await getUserByUserId(ctx, args.userId);

    if (!user) {
      throw new ConvexError("user with id not found");
    }

    await ctx.db.patch(user._id, {
      email: args.email,
      first_name: args.first_name,
      last_name: args.last_name,
      profileImage: args.profileImage,
    });
  },
});

export const createUser = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    profileImage: v.string(),
  },
  handler: async (ctx, args) => {
    let user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      await ctx.db.insert("users", {
        userId: args.userId,
        first_name: args.first_name,
        last_name: args.last_name,
        email: args.email,
        profileImage: args.profileImage,
        credits: 300,
        lastLoginAt: Date.now(),
      });

      await ctx.db.insert("notificationPreferences", {
        userId: args.userId,
        enabledTypes: DEFAULT_NOTIFICATION_PREFERENCES.enabledTypes,
        dailyReminderTime: DEFAULT_NOTIFICATION_PREFERENCES.dailyReminderTime,
        updatedAt: Date.now(),
      });

      await ctx.db.insert("emailPreferences", {
        userId: args.userId,
        dreamReminders: true,
        monthlyInsights: true,
        newFeatures: true,
        updatedAt: Date.now(),
      });
    }
  },
});

export const getUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getUserMetadata = query({
  args: { userId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      return null;
    }

    return {
      profileImage: user?.profileImage,
      first_name: user.first_name,
      last_name: user.last_name,
    };
  },
});

export const getMyUser = query({
  args: {},
  async handler(ctx) {
    const userId = await getUserId(ctx);

    if (!userId) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!user) {
      return null;
    }

    return user;
  },
});

export function getFullUser(ctx: QueryCtx | MutationCtx, userId: string) {
  return ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
}

export const updateMyUser = mutation({
  args: { first_name: v.string(), last_name: v.string() },
  async handler(ctx, args) {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new ConvexError("You must be logged in.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!user) {
      throw new ConvexError("user not found");
    }

    await ctx.db.patch(user._id, {
      first_name: args.first_name,
      last_name: args.last_name,
    });
  },
});

export const getUserByIdInternal = internalQuery({
  args: { userId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return user;
  },
});

// Delete all related data tied to this user
export const deleteUser = internalMutation({
  args: { userId: v.string() },
  async handler(ctx, args) {
    const user = await getUserByUserId(ctx, args.userId);
    if (!user) {
      throw new ConvexError("could not find user");
    }

    // Delete all notifications and preferences
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    await Promise.all(notifications.map((n) => ctx.db.delete(n._id)));

    const notificationPreferences = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (notificationPreferences) {
      await ctx.db.delete(notificationPreferences._id);
    }

    // Delete all dreams and their analysis
    const dreams = await ctx.db
      .query("dreams")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    await Promise.all(dreams.map((d) => ctx.db.delete(d._id)));

    // Get and delete all analysis entries and their associated storage items
    const analysis = await ctx.db
      .query("analysis")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Delete storage items first
    await Promise.all(
      analysis
        .filter((a) => a.imageStorageId)
        .map((a) => ctx.storage.delete(a.imageStorageId!))
    );
    // Then delete analysis records
    await Promise.all(analysis.map((a) => ctx.db.delete(a._id)));

    // Delete all insights
    const insights = await ctx.db
      .query("insights")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    await Promise.all(insights.map((i) => ctx.db.delete(i._id)));

    // Finally delete the user
    await ctx.db.delete(user._id);
  },
});

export const getUserCredits = query({
  args: { userId: v.optional(v.string()) },
  async handler(ctx, args) {
    const user = await getUserByUserId(ctx, args.userId!);

    if (!user) {
      return;
    }

    return user.credits;
  },
});

export const getUserByUserId = (
  ctx: MutationCtx | QueryCtx,
  userId: string
) => {
  return ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
};

export const updateUserCredits = internalMutation({
  args: {
    userId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getFullUser(ctx, args.userId);

    if (!user) throw new Error(`User not found for ID: ${args.userId}`);

    const newCredits = (user.credits || 0) + args.amount;
    if (newCredits < 0) throw new Error("Insufficient credits.");

    await ctx.db.patch(user._id, { credits: newCredits });
  },
});

async function validateCredits(
  ctx: MutationCtx,
  requiredCredits: number,
  userId?: string
) {
  const user = userId
    ? await getFullUser(ctx, userId)
    : await getUserByUserId(ctx, (await getUserId(ctx)) as string);

  if (!user) throw new Error("User not found.");

  if (user.credits! < requiredCredits) {
    const creditsNeeded = requiredCredits - user.credits!;
    throw new Error(
      `Insufficient credits. You need ${creditsNeeded} more credits.`
    );
  }

  return user;
}

export const consumeCredits = internalMutation({
  args: { cost: v.number(), userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await validateCredits(ctx, args.cost, args.userId);

    await ctx.db.patch(user._id, {
      credits: user.credits! - args.cost,
    });
  },
});

export const getTotalUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.length;
  },
});

export const isUserAdmin = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    return user?.isAdmin ?? false;
  },
});

export const toggleAdminStatus = mutation({
  args: { userId: v.string(), isAdmin: v.boolean() },
  handler: async (ctx, args) => {
    // Check if current user is admin
    const currentIdentity = await ctx.auth.getUserIdentity();
    if (!currentIdentity) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", currentIdentity.subject))
      .first();

    if (!currentUser?.isAdmin) throw new Error("Unauthorized");

    // Update target user's admin status
    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!targetUser) throw new Error("User not found");

    await ctx.db.patch(targetUser._id, {
      isAdmin: args.isAdmin,
      adminSince: args.isAdmin ? Date.now() : undefined,
    });

    return { success: true };
  },
});

export const updateLastLogin = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const user = await getUserByUserId(ctx, args.userId);

      if (!user) {
        throw new ConvexError(`User not found with ID: ${args.userId}`);
      }

      await ctx.db.patch(user._id, {
        lastLoginAt: Date.now(),
      });
    } catch (error) {
      // Log the error for monitoring but still throw it
      console.error("Failed to update last login:", error);
      throw error;
    }
  },
});
