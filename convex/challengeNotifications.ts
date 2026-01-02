import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all users who have started the challenge with their push tokens
// Returns both participant details and statistics in a single query
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

    // Process participants sequentially to avoid overwhelming the database
    // and to ensure accurate data fetching even with large datasets
    const participantsWithTokens = [];
    let withPushTokensCount = 0;
    let withoutPushTokensCount = 0;

    for (const participant of challengeParticipants) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_user_id", (q) => q.eq("userId", participant.userId))
        .first();

      const hasPushToken = !!user?.pushToken;

      if (hasPushToken) {
        withPushTokensCount++;
      } else {
        withoutPushTokensCount++;
      }

      participantsWithTokens.push({
        userId: participant.userId,
        name: user?.name || `User ${participant.userId.slice(-6)}`,
        pushToken: user?.pushToken,
        startedAt: participant.startedAt,
        hasPushToken,
      });
    }

    return {
      participants: participantsWithTokens,
      stats: {
        total: challengeParticipants.length,
        withPushTokens: withPushTokensCount,
        withoutPushTokens: withoutPushTokensCount,
      },
    };
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
