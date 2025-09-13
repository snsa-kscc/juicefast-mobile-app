import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userID: v.string(),
    name: v.string(),
    description: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    meal_type: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("mealEntry", {
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
      .query("mealEntry")
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
      .query("mealEntry")
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