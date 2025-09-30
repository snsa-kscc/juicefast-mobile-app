import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Update user's push token
export const updatePushToken = mutation({
  args: {
    userId: v.string(),
    pushToken: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal("user"), v.literal("nutritionist")))
  },
  handler: async (ctx, args) => {
    // Find existing user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        pushToken: args.pushToken,
        name: args.name,
        role: args.role
      });
      return existingUser._id;
    } else {
      // Create new user record
      return await ctx.db.insert("users", {
        userId: args.userId,
        pushToken: args.pushToken,
        name: args.name,
        role: args.role
      });
    }
  },
});

// Get user's push token
export const getPushToken = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .first();

    return user?.pushToken || null;
  },
});

// Get user info
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .first();

    return user || null;
  },
});

// Clear user's push token (for logout/security)
export const clearPushToken = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", q => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        pushToken: undefined
      });
      return true;
    }

    return false;
  },
});

// Get user by push token
export const getUserByPushToken = query({
  args: { pushToken: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("pushToken"), args.pushToken))
      .first();

    return user || null;
  },
});