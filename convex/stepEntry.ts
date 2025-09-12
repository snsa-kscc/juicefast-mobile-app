import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userId: v.string(),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("stepEntry", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const getByUserId = query({
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
    
    return entries.filter(entry => 
      entry.timestamp >= args.startTime && entry.timestamp <= args.endTime
    );
  },
});

