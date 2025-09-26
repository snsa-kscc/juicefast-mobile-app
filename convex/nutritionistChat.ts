import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Nutritionist mutations
export const createNutritionist = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    specialization: v.string(),
    bio: v.string(),
    isOnline: v.boolean(),
    avatarUrl: v.optional(v.string()),
    availability: v.optional(v.object({
      timezone: v.string(),
      workingHours: v.array(v.object({
        day: v.string(),
        startTime: v.string(),
        endTime: v.string()
      }))
    }))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Check if user is authorized to create nutritionist
    // In production, add proper authorization logic here

    return await ctx.db.insert("nutritionists", {
      ...args
    });
  }
});

export const updateNutritionistStatus = mutation({
  args: {
    clerkId: v.string(),
    isOnline: v.boolean()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Check if user is the nutritionist or authorized admin
    const nutritionist = await ctx.db
      .query("nutritionists")
      .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
      .first();

    if (!nutritionist) throw new Error("Nutritionist not found");

    await ctx.db.patch(nutritionist._id, { isOnline: args.isOnline });
    return nutritionist._id;
  }
});

// Chat session mutations
export const createChatSession = mutation({
  args: {
    nutritionistId: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const nutritionist = await ctx.db
      .query("nutritionists")
      .filter(q => q.eq(q.field("clerkId"), args.nutritionistId))
      .first();

    if (!nutritionist) throw new Error("Nutritionist not found");
    if (!nutritionist.isOnline) throw new Error("Nutritionist is offline");

    const sessionId = await ctx.db.insert("chatSessions", {
      userId: identity.subject,
      nutritionistId: args.nutritionistId,
      status: "active",
      startedAt: Date.now(),
      lastMessageAt: Date.now()
    });

    return sessionId;
  }
});

export const endChatSession = mutation({
  args: {
    sessionId: v.id("chatSessions")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    // Verify user is part of this session
    if (session.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.sessionId, {
      status: "ended",
      endedAt: Date.now()
    });

    return args.sessionId;
  }
});

// Message mutations
export const sendMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.status !== "active") throw new Error("Session is not active");

    // Verify user is part of this session
    const isNutritionist = session.nutritionistId === identity.subject;
    const isUser = session.userId === identity.subject;

    if (!isNutritionist && !isUser) {
      throw new Error("Unauthorized");
    }

    const messageId = await ctx.db.insert("chatMessages", {
      sessionId: args.sessionId,
      senderId: identity.subject,
      senderType: isNutritionist ? "nutritionist" : "user",
      content: args.content,
      timestamp: Date.now(),
      isRead: false
    });

    // Update session last message time
    await ctx.db.patch(args.sessionId, { lastMessageAt: Date.now() });

    return messageId;
  }
});

export const markMessagesAsRead = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    senderType: v.union(v.literal("user"), v.literal("nutritionist"))
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
      .withIndex("by_session", q => q.eq("sessionId", args.sessionId))
      .filter(q => q.and(
        q.eq(q.field("senderType"), args.senderType),
        q.eq(q.field("isRead"), false)
      ))
      .collect();

    for (const message of messages) {
      await ctx.db.patch(message._id, { isRead: true });
    }

    return messages.length;
  }
});

// Nutritionist queries
export const getNutritionists = query({
  handler: async (ctx) => {
    const nutritionists = await ctx.db
      .query("nutritionists")
      .order("desc")
      .collect();

    return nutritionists.map(n => ({
      id: n.clerkId,
      name: n.name,
      specialization: n.specialization,
      bio: n.bio,
      isOnline: n.isOnline,
      avatarUrl: n.avatarUrl,
      availability: n.availability
    }));
  }
});

export const getOnlineNutritionists = query({
  handler: async (ctx) => {
    const nutritionists = await ctx.db
      .query("nutritionists")
      .withIndex("by_online_status", q => q.eq("isOnline", true))
      .collect();

    return nutritionists.map(n => ({
      id: n.clerkId,
      name: n.name,
      specialization: n.specialization,
      bio: n.bio,
      isOnline: n.isOnline,
      avatarUrl: n.avatarUrl,
      availability: n.availability
    }));
  }
});

// User chat queries
export const getUserSessions = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_user", q => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return await Promise.all(
      sessions.map(async (session) => {
        const nutritionist = await ctx.db
          .query("nutritionists")
          .withIndex("by_clerk_id", q => q.eq("clerkId", session.nutritionistId))
          .first();

        const lastMessage = await ctx.db
          .query("chatMessages")
          .withIndex("by_session", q => q.eq("sessionId", session._id))
          .order("desc")
          .first();

        return {
          id: session._id,
          nutritionistId: session.nutritionistId,
          status: session.status,
          startedAt: session.startedAt,
          endedAt: session.endedAt,
          lastMessageAt: session.lastMessageAt,
          nutritionist: nutritionist ? {
            name: nutritionist.name,
            specialization: nutritionist.specialization,
            isOnline: nutritionist.isOnline,
            avatarUrl: nutritionist.avatarUrl
          } : null,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            senderType: lastMessage.senderType,
            timestamp: lastMessage.timestamp,
            isRead: lastMessage.isRead
          } : null
        };
      })
    );
  }
});

export const getMessages = query({
  args: {
    sessionId: v.id("chatSessions")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    // Verify user is part of this session
    if (session.userId !== identity.subject && session.nutritionistId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_session", q => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();

    return messages.map(m => ({
      id: m._id,
      sessionId: m.sessionId,
      senderId: m.senderId,
      senderType: m.senderType,
      content: m.content,
      timestamp: m.timestamp,
      isRead: m.isRead
    }));
  }
});

// Nutritionist-specific queries
export const getNutritionistSessions = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_nutritionist", q => q.eq("nutritionistId", identity.subject))
      .order("desc")
      .collect();

    return await Promise.all(
      sessions.map(async (session) => {
        const lastMessage = await ctx.db
          .query("chatMessages")
          .withIndex("by_session", q => q.eq("sessionId", session._id))
          .order("desc")
          .first();

        const unreadCount = await ctx.db
          .query("chatMessages")
          .withIndex("by_session", q => q.eq("sessionId", session._id))
          .filter(q => q.and(
            q.eq(q.field("senderType"), "user"),
            q.eq(q.field("isRead"), false)
          ))
          .collect();

        return {
          id: session._id,
          userId: session.userId,
          status: session.status,
          startedAt: session.startedAt,
          endedAt: session.endedAt,
          lastMessageAt: session.lastMessageAt,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            senderType: lastMessage.senderType,
            timestamp: lastMessage.timestamp,
            isRead: lastMessage.isRead
          } : null,
          unreadCount: unreadCount.length
        };
      })
    );
  }
});

export const getActiveSessionsForNutritionist = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_nutritionist", q => q.eq("nutritionistId", identity.subject))
      .filter(q => q.eq(q.field("status"), "active"))
      .order("desc")
      .collect();

    return await Promise.all(
      sessions.map(async (session) => {
        const lastMessage = await ctx.db
          .query("chatMessages")
          .withIndex("by_session", q => q.eq("sessionId", session._id))
          .order("desc")
          .first();

        return {
          id: session._id,
          userId: session.userId,
          startedAt: session.startedAt,
          lastMessageAt: session.lastMessageAt,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            timestamp: lastMessage.timestamp
          } : null
        };
      })
    );
  }
});