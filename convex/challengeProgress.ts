import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const startChallenge = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const now = Date.now();

    // Check if user already has challenge progress
    const existingProgress = await ctx.db
      .query("challengeProgress")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (existingProgress) {
      // Update existing progress
      await ctx.db.patch(existingProgress._id, {
        hasStartedChallenge: true,
        updatedAt: now,
      });
      return existingProgress._id;
    } else {
      // Create new challenge progress
      const progressId = await ctx.db.insert("challengeProgress", {
        userId,
        hasStartedChallenge: true,
        hasClearedEntryModal: false,
        beforePhotoUrl: undefined,
        afterPhotoUrl: undefined,
        startedAt: now,
        updatedAt: now,
      });
      return progressId;
    }
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateProgress = mutation({
  args: {
    hasClearedEntryModal: v.optional(v.boolean()),
    beforePhotoUrl: v.optional(v.string()),
    afterPhotoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const now = Date.now();

    // Find existing progress
    const existingProgress = await ctx.db
      .query("challengeProgress")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!existingProgress) {
      throw new Error(
        "Challenge progress not found. Please start the challenge first."
      );
    }

    // Update only the provided fields
    const updateData: any = { updatedAt: now };
    if (args.hasClearedEntryModal !== undefined) {
      updateData.hasClearedEntryModal = args.hasClearedEntryModal;
    }
    if (args.beforePhotoUrl !== undefined) {
      updateData.beforePhotoUrl = args.beforePhotoUrl;
    }
    if (args.afterPhotoUrl !== undefined) {
      updateData.afterPhotoUrl = args.afterPhotoUrl;
    }

    await ctx.db.patch(existingProgress._id, updateData);
    return existingProgress._id;
  },
});

export const getUserChallengeProgress = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const progress = await ctx.db
      .query("challengeProgress")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    return progress;
  },
});

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getChallengeProgressWithUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Get challenge progress
    const progress = await ctx.db
      .query("challengeProgress")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    // Get user details from users table
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    // Get user profile
    const userProfile = await ctx.db
      .query("userProfile")
      .withIndex("by_user_id", (q) => q.eq("userID", args.userId))
      .first();

    return {
      progress,
      user,
      userProfile,
    };
  },
});
