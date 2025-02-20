"use node";

import { clerkClient } from "@clerk/clerk-sdk-node";

import { api, internal } from "../_generated/api";
import { action } from "../_generated/server";
import { getUserId } from "../util";

export const deleteAccount = action({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("You must be logged in.");
    }

    // @ts-ignore
    const user = await ctx.runQuery(api.users.getMyUser);

    if (!user) {
      throw new Error("User not found.");
    }

    // @ts-ignore
    await ctx.runMutation(internal.users.deleteUser, { userId: userId });
    await clerkClient.users.deleteUser(userId);
  },
});
