import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrUpdate = mutation({
  args: {
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    age: v.optional(v.number()),
    gender: v.optional(v.string()),
    activityLevel: v.optional(v.string()),
    referralCode: v.string(),
    referredBy: v.optional(v.string()),
    referralCount: v.optional(v.number()),
    allow_promotion: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const existingProfile = await ctx.db
      .query("userProfile")
      .withIndex("by_user_id", (q) => q.eq("userID", userId))
      .first();

    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existingProfile._id;
    } else {
      // Create new profile
      return await ctx.db.insert("userProfile", {
        ...args,
        userID: userId,
        referralCount: args.referralCount || 0,
        updatedAt: Date.now(),
      });
    }
  },
});

export const getByUserId = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("userProfile")
      .withIndex("by_user_id", (q) => q.eq("userID", identity.subject))
      .first();
  },
});

export const getByReferralCode = query({
  args: { referralCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfile")
      .withIndex("by_referral_code", (q) =>
        q.eq("referralCode", args.referralCode)
      )
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
  args: { referralCode: v.string() },
  handler: async (ctx, args) => {
    const referrerProfile = await ctx.db
      .query("userProfile")
      .withIndex("by_referral_code", (q) =>
        q.eq("referralCode", args.referralCode)
      )
      .first();

    if (referrerProfile) {
      await ctx.db.patch(referrerProfile._id, {
        referralCount: (referrerProfile.referralCount || 0) + 1,
        updatedAt: Date.now(),
      });
      return referrerProfile._id;
    }
    return null;
  },
});
