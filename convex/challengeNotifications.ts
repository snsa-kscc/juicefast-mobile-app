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

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Send push notification to all challenge participants
export const sendNotificationToChallengeParticipants = mutation({
  args: {
    title: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const now = Date.now();

    // Get all challenge participants
    const challengeParticipants = await ctx.db
      .query("challengeProgress")
      .filter((q) => q.eq(q.field("hasStartedChallenge"), true))
      .collect();

    // Get users with their push tokens
    const participantsWithTokens = await Promise.all(
      challengeParticipants.map(async (participant) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_user_id", (q) => q.eq("userId", participant.userId))
          .first();
        return { participant, user };
      })
    );

    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    // Filter participants based on push tokens
    const recipients = participantsWithTokens.filter(
      ({ user }) => user?.pushToken
    );

    // Send notifications in batches of 500 to stay under the 600/sec limit
    const batchSize = 500;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      // Send all notifications in the current batch concurrently
      const batchPromises = batch.map(async ({ participant, user }) => {
        if (user?.pushToken) {
          try {
            // Use the existing push notification API
            const response = await fetch(
              "https://exp.host/--/api/v2/push/send",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  to: user.pushToken,
                  sound: "default",
                  title: args.title,
                  body: args.message,
                  data: { type: "challenge_notification" },
                  priority: "high",
                  channelId: "default",
                }),
              }
            );

            const result = await response.json();

            if (response.ok && result.data?.status === "ok") {
              successCount++;
            } else {
              failureCount++;
              errors.push(
                `Failed for user ${user.name || user.userId}: ${result.message || "Unknown error"}`
              );
            }
          } catch (error) {
            failureCount++;
            errors.push(
              `Error for user ${user.name || user.userId}: ${error instanceof Error ? error.message : "Unknown error"}`
            );
          }
        } else {
          failureCount++;
          errors.push(`No push token for user ${participant.userId}`);
        }
      });

      // Wait for the current batch to complete
      await Promise.all(batchPromises);

      // If there are more batches, wait 1 second before continuing
      if (i + batchSize < recipients.length) {
        await delay(1000);
      }
    }

    // Save the message to challengeMessages table
    const messageId = await ctx.db.insert("challengeMessages", {
      title: args.title,
      message: args.message,
      sentBy: userId,
      totalRecipients: challengeParticipants.length,
      successCount,
      failureCount,
      createdAt: now,
      sentAt: now,
    });

    return {
      messageId,
      totalParticipants: challengeParticipants.length,
      successCount,
      failureCount,
      errors,
    };
  },
});

// Get count of challenge participants
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

    // Get sender info for each message
    const messagesWithSender = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db
          .query("users")
          .withIndex("by_user_id", (q) => q.eq("userId", message.sentBy))
          .first();

        return {
          ...message,
          senderName: sender?.name || "Unknown",
        };
      })
    );

    return messagesWithSender;
  },
});

// Delete a challenge message
export const deleteChallengeMessage = mutation({
  args: { messageId: v.id("challengeMessages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get the message to verify ownership
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Check if the user is the sender
    if (message.sentBy !== identity.subject) {
      throw new Error("You can only delete your own messages");
    }

    await ctx.db.delete(args.messageId);
    return true;
  },
});
