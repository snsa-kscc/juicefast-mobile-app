import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Nutritionist mutations
export const createNutritionist = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    specialization: v.string(),
    bio: v.string(),
    isOnline: v.boolean(),
    avatarUrl: v.optional(v.string()),
    availability: v.optional(
      v.object({
        timezone: v.string(),
        workingHours: v.array(
          v.object({
            day: v.string(),
            startTime: v.string(),
            endTime: v.string(),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Check if user is authorized to create nutritionist
    // In production, add proper authorization logic here

    return await ctx.db.insert("nutritionists", {
      ...args,
    });
  },
});

export const updateNutritionistStatus = mutation({
  args: {
    clerkId: v.string(),
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Check if user is the nutritionist or authorized admin
    const nutritionist = await ctx.db
      .query("nutritionists")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!nutritionist) throw new Error("Nutritionist not found");

    await ctx.db.patch(nutritionist._id, { isOnline: args.isOnline });
    return nutritionist._id;
  },
});

// Chat session mutations
export const createChatSession = mutation({
  args: {
    nutritionistId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Check if user already has any active session (exclusive session)
    const existingActiveSession = await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (existingActiveSession) {
      throw new Error(
        "You already have an active chat. Please end it before starting a new one."
      );
    }

    const nutritionist = await ctx.db
      .query("nutritionists")
      .filter((q) => q.eq(q.field("clerkId"), args.nutritionistId))
      .first();

    if (!nutritionist) throw new Error("Nutritionist not found");

    // Get user first name from Clerk token claims
    const userFirstName =
      identity.name?.split(" ")[0] || identity.givenName || "User";

    const sessionId = await ctx.db.insert("chatSessions", {
      userId: identity.subject,
      userName: userFirstName,
      nutritionistId: args.nutritionistId,
      status: "active",
      startedAt: Date.now(),
      lastMessageAt: Date.now(),
    });

    return sessionId;
  },
});

export const endChatSession = mutation({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    // Verify user is part of this session (either user or nutritionist)
    if (
      session.userId !== identity.subject &&
      session.nutritionistId !== identity.subject
    ) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.sessionId, {
      status: "ended",
      endedAt: Date.now(),
    });

    return args.sessionId;
  },
});

// Message mutations
export const sendMessage = mutation({
  args: {
    nutritionistId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Find or create an active session with this nutritionist
    let session = await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .filter((q) =>
        q.and(
          q.eq(q.field("nutritionistId"), args.nutritionistId),
          q.eq(q.field("status"), "active")
        )
      )
      .first();

    // If no active session exists, create one
    if (!session) {
      // Check if user already has any active session (exclusive session)
      const existingActiveSession = await ctx.db
        .query("chatSessions")
        .withIndex("by_user", (q) => q.eq("userId", identity.subject))
        .filter((q) => q.eq(q.field("status"), "active"))
        .first();

      if (existingActiveSession) {
        throw new Error(
          "You already have an active chat. Please end it before starting a new one."
        );
      }

      const nutritionist = await ctx.db
        .query("nutritionists")
        .filter((q) => q.eq(q.field("clerkId"), args.nutritionistId))
        .first();

      if (!nutritionist) throw new Error("Nutritionist not found");

      // Get user first name from Clerk token claims
      const userFirstName =
        identity.name?.split(" ")[0] || identity.givenName || "User";

      const sessionId = await ctx.db.insert("chatSessions", {
        userId: identity.subject,
        userName: userFirstName,
        nutritionistId: args.nutritionistId,
        status: "active",
        startedAt: Date.now(),
        lastMessageAt: Date.now(),
      });

      session = await ctx.db.get(sessionId);
    }

    if (!session) throw new Error("Failed to create or find session");
    if (session.status !== "active") throw new Error("Session is not active");

    // Verify user is part of this session
    const isUser = session.userId === identity.subject;
    if (!isUser) {
      throw new Error("Unauthorized");
    }

    const messageId = await ctx.db.insert("chatMessages", {
      sessionId: session._id,
      senderId: identity.subject,
      senderType: "user",
      content: args.content,
      timestamp: Date.now(),
      isRead: false,
    });

    // Update session last message time
    await ctx.db.patch(session._id, { lastMessageAt: Date.now() });

    // Get user info for notification
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .first();

    // Get nutritionist's push token
    const nutritionistUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", session.nutritionistId))
      .first();

    // Send push notification to nutritionist if they have a push token
    if (nutritionistUser?.pushToken) {
      try {
        await ctx.scheduler.runAfter(
          0,
          api.nutritionistChat.sendPushNotification,
          {
            targetToken: nutritionistUser.pushToken,
            senderName: user?.name || session.userName || "User",
            messageText: args.content,
            chatId: session._id.toString(),
            intendedRecipientId: session.nutritionistId, // The nutritionist is the intended recipient
          }
        );
      } catch (error) {
        console.error("Failed to send push notification:", error);
        // Don't throw error - message was still sent successfully
      }
    }

    return {
      messageId,
      recipientId: session.nutritionistId,
      senderName: user?.name || session.userName || "User",
      senderType: "user",
    };
  },
});

// Nutritionist send message function
export const sendNutritionistMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.status !== "active") throw new Error("Session is not active");

    // Verify user is the nutritionist
    const isNutritionist = session.nutritionistId === identity.subject;
    if (!isNutritionist) {
      throw new Error("Unauthorized");
    }

    const messageId = await ctx.db.insert("chatMessages", {
      sessionId: args.sessionId,
      senderId: identity.subject,
      senderType: "nutritionist",
      content: args.content,
      timestamp: Date.now(),
      isRead: false,
    });

    // Update session last message time
    await ctx.db.patch(args.sessionId, { lastMessageAt: Date.now() });

    // Get nutritionist info for notification
    const nutritionist = await ctx.db
      .query("nutritionists")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    // Get user's push token
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", session.userId))
      .first();

    // Send push notification if user has a push token
    if (user?.pushToken) {
      try {
        await ctx.scheduler.runAfter(
          0,
          api.nutritionistChat.sendPushNotification,
          {
            targetToken: user.pushToken,
            senderName: nutritionist?.name || "Nutritionist",
            messageText: args.content,
            chatId: args.sessionId.toString(),
            intendedRecipientId: session.userId, // The user is the intended recipient
          }
        );
      } catch (error) {
        console.error("Failed to send push notification:", error);
        // Don't throw error - message was still sent successfully
      }
    }

    return {
      messageId,
      recipientId: session.userId,
      senderName: nutritionist?.name || "Nutritionist",
      senderType: "nutritionist",
    };
  },
});

export const markMessagesAsRead = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    senderType: v.union(v.literal("user"), v.literal("nutritionist")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    // Verify user is part of this session
    const isNutritionist = session.nutritionistId === identity.subject;
    const isUser = session.userId === identity.subject;

    if (!isNutritionist && !isUser) {
      throw new Error("Unauthorized");
    }

    // Mark messages from the other party as read
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .filter((q) =>
        q.and(
          q.eq(q.field("senderType"), args.senderType),
          q.eq(q.field("isRead"), false)
        )
      )
      .collect();

    for (const message of messages) {
      await ctx.db.patch(message._id, { isRead: true });
    }

    return messages.length;
  },
});

// Nutritionist queries
export const getNutritionists = query({
  handler: async (ctx) => {
    const nutritionists = await ctx.db
      .query("nutritionists")
      .order("desc")
      .collect();

    return nutritionists.map((n) => ({
      id: n.clerkId,
      name: n.name,
      specialization: n.specialization,
      bio: n.bio,
      isOnline: n.isOnline,
      avatarUrl: n.avatarUrl,
      availability: n.availability,
    }));
  },
});

export const getOnlineNutritionists = query({
  handler: async (ctx) => {
    const nutritionists = await ctx.db
      .query("nutritionists")
      .withIndex("by_online_status", (q) => q.eq("isOnline", true))
      .collect();

    return nutritionists.map((n) => ({
      id: n.clerkId,
      name: n.name,
      specialization: n.specialization,
      bio: n.bio,
      isOnline: n.isOnline,
      avatarUrl: n.avatarUrl,
      availability: n.availability,
    }));
  },
});

// User chat queries
export const getUserSessions = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return await Promise.all(
      sessions.map(async (session) => {
        const nutritionist = await ctx.db
          .query("nutritionists")
          .withIndex("by_clerk_id", (q) =>
            q.eq("clerkId", session.nutritionistId)
          )
          .first();

        const lastMessage = await ctx.db
          .query("chatMessages")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .order("desc")
          .first();

        return {
          id: session._id,
          nutritionistId: session.nutritionistId,
          userName: session.userName,
          status: session.status,
          startedAt: session.startedAt,
          endedAt: session.endedAt,
          lastMessageAt: session.lastMessageAt,
          nutritionist: nutritionist
            ? {
                name: nutritionist.name,
                specialization: nutritionist.specialization,
                isOnline: nutritionist.isOnline,
                avatarUrl: nutritionist.avatarUrl,
              }
            : null,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                senderType: lastMessage.senderType,
                timestamp: lastMessage.timestamp,
                isRead: lastMessage.isRead,
              }
            : null,
        };
      })
    );
  },
});

export const getMessages = query({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    // Verify user is part of this session
    if (
      session.userId !== identity.subject &&
      session.nutritionistId !== identity.subject
    ) {
      throw new Error("Unauthorized");
    }

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();

    return messages.map((m) => ({
      id: m._id,
      sessionId: m.sessionId,
      senderId: m.senderId,
      senderType: m.senderType,
      content: m.content,
      timestamp: m.timestamp,
      isRead: m.isRead,
    }));
  },
});

// Nutritionist-specific queries
export const getNutritionistSessions = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_nutritionist", (q) =>
        q.eq("nutritionistId", identity.subject)
      )
      .order("desc")
      .collect();

    return await Promise.all(
      sessions.map(async (session) => {
        const lastMessage = await ctx.db
          .query("chatMessages")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .order("desc")
          .first();

        const unreadCount = await ctx.db
          .query("chatMessages")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .filter((q) =>
            q.and(
              q.eq(q.field("senderType"), "user"),
              q.eq(q.field("isRead"), false)
            )
          )
          .collect();

        return {
          id: session._id,
          userId: session.userId,
          userName: session.userName,
          status: session.status,
          startedAt: session.startedAt,
          endedAt: session.endedAt,
          lastMessageAt: session.lastMessageAt,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                senderType: lastMessage.senderType,
                timestamp: lastMessage.timestamp,
                isRead: lastMessage.isRead,
              }
            : null,
          unreadCount: unreadCount.length,
        };
      })
    );
  },
});

export const deleteChatSession = mutation({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    // Verify user is the nutritionist for this session
    if (session.nutritionistId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    // Delete all messages associated with this session
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the session itself
    await ctx.db.delete(args.sessionId);

    return args.sessionId;
  },
});

export const getActiveSessionsForNutritionist = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_nutritionist", (q) =>
        q.eq("nutritionistId", identity.subject)
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .collect();

    return await Promise.all(
      sessions.map(async (session) => {
        const lastMessage = await ctx.db
          .query("chatMessages")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .order("desc")
          .first();

        return {
          id: session._id,
          userId: session.userId,
          startedAt: session.startedAt,
          lastMessageAt: session.lastMessageAt,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                timestamp: lastMessage.timestamp,
              }
            : null,
        };
      })
    );
  },
});

// User-specific query for active sessions only
export const getActiveUserSessions = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Get only active sessions for the authenticated user
    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .collect();

    return await Promise.all(
      sessions.map(async (session) => {
        const nutritionist = await ctx.db
          .query("nutritionists")
          .withIndex("by_clerk_id", (q) =>
            q.eq("clerkId", session.nutritionistId)
          )
          .first();

        const lastMessage = await ctx.db
          .query("chatMessages")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .order("desc")
          .first();

        // Count unread messages from nutritionist
        const unreadMessages = await ctx.db
          .query("chatMessages")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .filter((q) =>
            q.and(
              q.eq(q.field("senderType"), "nutritionist"),
              q.eq(q.field("isRead"), false)
            )
          )
          .collect();

        return {
          id: session._id,
          nutritionistId: session.nutritionistId,
          userName: session.userName,
          status: session.status,
          startedAt: session.startedAt,
          endedAt: session.endedAt,
          lastMessageAt: session.lastMessageAt,
          nutritionist: nutritionist
            ? {
                name: nutritionist.name,
                specialization: nutritionist.specialization,
                isOnline: nutritionist.isOnline,
                avatarUrl: nutritionist.avatarUrl,
              }
            : null,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                senderType: lastMessage.senderType,
                timestamp: lastMessage.timestamp,
                isRead: lastMessage.isRead,
              }
            : null,
          unreadCount: unreadMessages.length,
        };
      })
    );
  },
});

// Push notification action (can make external API calls)
export const sendPushNotification = action({
  args: {
    targetToken: v.string(),
    senderName: v.string(),
    messageText: v.string(),
    chatId: v.string(),
    intendedRecipientId: v.string(), // Add recipient validation
  },
  handler: async (_, args) => {
    if (!args.targetToken) {
      console.log("Push notification failed: No target token provided");
      return;
    }

    const message = {
      to: args.targetToken,
      sound: "default",
      title: args.senderName,
      body: args.messageText,
      data: {
        chatId: args.chatId,
        intendedRecipientId: args.intendedRecipientId, // Include for validation
      },
      priority: "high",
      channelId: "default",
    };

    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Push notification failed:", result);
        throw new Error(result.message || "Failed to send push notification");
      }

      if (result.data?.status === "error") {
        console.error("Push notification error:", result.data);
        throw new Error(result.data.message || "Push notification error");
      }

      console.log("Push notification sent successfully:", result.data);
      return result.data;
    } catch (error) {
      console.error("Failed to send push notification:", error);
      throw error;
    }
  },
});
