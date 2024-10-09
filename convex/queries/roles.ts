import { v } from "convex/values";

import { internalQuery, query } from "../_generated/server";

export const getAllRoles = query({
  handler: async (ctx) => {
    return await ctx.db.query("roles").collect();
  },
});

export const getRoleById = query({
  args: { id: v.id("roles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getRoleByIdInternal = internalQuery({
  args: { id: v.id("roles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
