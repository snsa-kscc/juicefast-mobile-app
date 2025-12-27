import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all users who have started the challenge with their push tokens
export const getChallengeParticipants = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get all users who have started the challenge
    const challengeParticipants = await ctx.db
      .query("challengeProgress")
      .filter((q) => q.eq(q.field("hasStartedChallenge"), true))
      .collect();

    // Get user details and push tokens for each participant
    const participantsWithTokens = await Promise.all(
      challengeParticipants.map(async (participant) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_user_id", (q) => q.eq("userId", participant.userId))
          .first();

        return {
          userId: participant.userId,
          name: user?.name || `User ${participant.userId.slice(-6)}`,
          pushToken: user?.pushToken,
          startedAt: participant.startedAt,
          hasPushToken: !!user?.pushToken,
        };
      })
    );

    return participantsWithTokens;
  },
});

export const storeChallengeMessages = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    totalRecipients: v.number(),
    successCount: v.number(),
    failureCount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const now = Date.now();

    // Save the message to challengeMessages table
    const messageId = await ctx.db.insert("challengeMessages", {
      title: args.title,
      message: args.message,
      sentBy: userId,
      totalRecipients: args.totalRecipients,
      successCount: args.successCount,
      failureCount: args.failureCount,
      createdAt: now,
      sentAt: now,
    });

    return { messageId };
  },
});

export const getChallengeParticipantsCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const participants = await ctx.db
      .query("challengeProgress")
      .filter((q) => q.eq(q.field("hasStartedChallenge"), true))
      .collect();

    const participantsWithTokens = await Promise.all(
      participants.map(async (participant) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_user_id", (q) => q.eq("userId", participant.userId))
          .first();
        return !!user?.pushToken;
      })
    );

    return {
      total: participants.length,
      withPushTokens: participantsWithTokens.filter(Boolean).length,
      withoutPushTokens: participantsWithTokens.filter((has) => !has).length,
    };
  },
});

// Get all sent challenge messages
export const getChallengeMessages = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const messages = await ctx.db
      .query("challengeMessages")
      .order("desc")
      .collect();

    return messages;
  },
});
