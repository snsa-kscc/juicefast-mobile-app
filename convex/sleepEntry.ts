import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userID: v.string(),
    hoursSlept: v.number(),
    quality: v.number(),
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sleepEntry", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const getByUserId = query({
  args: { 
      userID: v.string(),
      startTime: v.number(),
      endTime: v.number(),
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("sleepEntry")
      .withIndex("by_user_id", (q) => q.eq("userID", args.userID))
      .collect();
    
    return entries.filter(entry => 
      entry.timestamp >= args.startTime && entry.timestamp <= args.endTime
    );
  },
});

export const deleteByUserIdAndTimestamp = mutation({
  args: {
    userID: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query("sleepEntry")
      .withIndex("by_user_id", (q) => q.eq("userID", args.userID))
      .filter((q) => q.eq(q.field("timestamp"), args.timestamp))
      .first();
    
    if (entry) {
      await ctx.db.delete(entry._id);
      return entry._id;
    }
    return null;
  },
});