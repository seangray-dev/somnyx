import { ConvexError, v } from "convex/values";

import { Doc } from "./_generated/dataModel";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { getUserId } from "./util";

export const updateUser = internalMutation({
  args: {
    userId: v.string(),
    profileImage: v.string(),
  },
  handler: async (ctx, args) => {
    let user = await getUserByUserId(ctx, args.userId);

    if (!user) {
      throw new ConvexError("user with id not found");
    }

    await ctx.db.patch(user._id, {
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
        first_name: args.first_name,
        last_name: args.last_name,
        userId: args.userId,
        email: args.email,
        profileImage: args.profileImage,
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

export const deleteUser = internalMutation({
  args: { userId: v.string() },
  async handler(ctx, args) {
    const user = await getUserByUserId(ctx, args.userId);
    if (!user) {
      throw new ConvexError("could not find user");
    }
    await ctx.db.delete(user._id);
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

export const updateSubscription = internalMutation({
  args: { subscriptionId: v.string(), userId: v.string(), endsOn: v.number() },
  handler: async (ctx, args) => {
    const user = await getUserByUserId(ctx, args.userId);

    if (!user) {
      throw new Error("no user found with that user id");
    }

    await ctx.db.patch(user._id, {
      subscriptionId: args.subscriptionId,
      endsOn: args.endsOn,
    });
  },
});

export const updateSubscriptionBySubId = internalMutation({
  args: { subscriptionId: v.string(), endsOn: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_subscriptionId", (q) =>
        q.eq("subscriptionId", args.subscriptionId)
      )
      .first();

    if (!user) {
      throw new Error("no user found with that user id");
    }

    await ctx.db.patch(user._id, {
      endsOn: args.endsOn,
    });
  },
});

export const isUserPremium = async (user: Doc<"users">) => {
  return (user?.endsOn ?? 0) > Date.now();
};

export const isPremium = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      return false;
    }

    const user = await getUserByUserId(ctx, userId);

    if (!user) {
      return false;
    }

    return isUserPremium(user);
  },
});
