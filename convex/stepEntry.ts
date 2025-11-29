import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("stepEntry", {
      ...args,
      userId: identity.subject,
      timestamp: Date.now(),
    });
  },
});

export const getByUserId = query({
  args: {
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const entries = await ctx.db
      .query("stepEntry")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .collect();

    return entries.filter(
      (entry) =>
        entry.timestamp >= args.startTime && entry.timestamp <= args.endTime
    );
  },
});

export const deleteByUserIdAndTimestamp = mutation({
  args: {
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const entry = await ctx.db
      .query("stepEntry")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.eq(q.field("timestamp"), args.timestamp))
      .first();

    if (entry) {
      await ctx.db.delete(entry._id);
      return entry._id;
    }
    return null;
  },
});

// Server-side functions for API routes - these accept userId as parameter
export const getByUserIdForServer = query({
  args: {
    userId: v.string(),
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("stepEntry")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    return entries.filter(
      (entry) =>
        entry.timestamp >= args.startTime && entry.timestamp <= args.endTime
    );
  },
});
