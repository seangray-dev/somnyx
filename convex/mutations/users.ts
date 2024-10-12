import { api } from "../_generated/api";
import { mutation } from "../_generated/server";
import { getUserId } from "../util";

export const deleteAccount = mutation({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    if (!userId) {
      throw new Error("You must be logged in.");
    }

    // Fetch the user document by userId
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (!user) {
      throw new Error("User not found.");
    }

    // Delete the user by _id
    await ctx.db.delete(user._id);
    await ctx.scheduler.runAfter(0, api.mutations.deleteAllUserDreams, {});
  },
});
