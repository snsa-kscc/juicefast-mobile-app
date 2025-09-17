import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrUpdate = mutation({
  args: {
    userID: v.string(),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    age: v.optional(v.number()),
    gender: v.optional(v.string()),
    activityLevel: v.optional(v.string()),
    referralCode: v.string(),
    referredBy: v.optional(v.string()),
    referralCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existingProfile = await ctx.db
      .query("userProfile")
      .withIndex("by_user_id", (q) => q.eq("userID", args.userID))
      .first();

    if (existingProfile) {
      // Update existing profile
      const { userID, ...updateData } = args;
      await ctx.db.patch(existingProfile._id, {
        ...updateData,
        updatedAt: Date.now(),
      });
      return existingProfile._id;
    } else {
      // Create new profile
      return await ctx.db.insert("userProfile", {
        ...args,
        referralCount: args.referralCount || 0,
        updatedAt: Date.now(),
      });
    }
  },
});

export const getByUserId = query({
  args: { userID: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfile")
      .withIndex("by_user_id", (q) => q.eq("userID", args.userID))
      .first();
  },
});

export const getByReferralCode = query({
  args: { referralCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfile")
      .withIndex("by_referral_code", (q) => q.eq("referralCode", args.referralCode))
      .first();
  },
});

export const getByReferredBy = query({
  args: { referredBy: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfile")
      .withIndex("by_referred_by", (q) => q.eq("referredBy", args.referredBy))
      .collect();
  },
});

export const incrementReferralCount = mutation({
  args: { userID: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfile")
      .withIndex("by_user_id", (q) => q.eq("userID", args.userID))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, {
        referralCount: (profile.referralCount || 0) + 1,
        updatedAt: Date.now(),
      });
      return profile._id;
    }
    return null;
  },
});