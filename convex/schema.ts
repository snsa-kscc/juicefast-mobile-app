import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  stepEntry: defineTable({
    userId: v.string(),
    count: v.number(), // steps in this entry
    timestamp: v.number(), // UTC timestamp when recorded
  }).index("by_user_id", ["userId"]),

  waterIntake: defineTable({
    userID: v.string(),
    amount: v.number(),
    timestamp: v.number(),
  }).index("by_user_id", ["userID"]),

  mindfulnessEntry: defineTable({
    userID: v.string(),
    minutes: v.number(),
    activity: v.string(),
    timestamp: v.number(),
  }).index("by_user_id", ["userID"]),

  sleepEntry: defineTable({
    userID: v.string(),
    hoursSlept: v.number(),
    quality: v.number(),
    startTime: v.number(),
    endTime: v.number(),
    timestamp: v.number(),
  }).index("by_user_id", ["userID"]),

  mealEntry: defineTable({
    userID: v.string(),
    name: v.string(),
    description: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    meal_type: v.string(),
    timestamp: v.number(),
  }).index("by_user_id", ["userID"]),

  noteEntry: defineTable({
    userID: v.string(),
    content: v.string(),
    date: v.string(), // Format: YYYY-MM-DD for easy daily lookup
    timestamp: v.number(), // When note was last updated
  })
    .index("by_user_id", ["userID"])
    .index("by_user_and_date", ["userID", "date"]),

  userProfile: defineTable({
    userID: v.string(),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    age: v.optional(v.number()),
    gender: v.optional(v.string()),
    activityLevel: v.optional(v.string()),
    referralCode: v.string(),
    referredBy: v.optional(v.string()),
    referralCount: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userID"])
    .index("by_referral_code", ["referralCode"])
    .index("by_referred_by", ["referredBy"]),

  // Push tokens for notifications
  users: defineTable({
    userId: v.string(),
    pushToken: v.optional(v.string()),
    role: v.optional(v.union(v.literal("user"), v.literal("nutritionist"))),
    name: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  // Nutritionist chat tables
  nutritionists: defineTable({
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
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_online_status", ["isOnline"]),

  chatSessions: defineTable({
    userId: v.string(),
    userName: v.string(),
    nutritionistId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("ended"),
      v.literal("pending")
    ),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    lastMessageAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_nutritionist", ["nutritionistId"])
    .index("by_status", ["status"]),

  chatMessages: defineTable({
    sessionId: v.id("chatSessions"),
    senderId: v.string(),
    senderType: v.union(v.literal("user"), v.literal("nutritionist")),
    content: v.string(),
    timestamp: v.number(),
    isRead: v.boolean(),
  })
    .index("by_session", ["sessionId"])
    .index("by_sender", ["senderId"]),

  // Challenge feature tables
  challengeProgress: defineTable({
    userId: v.string(), // Clerk user ID
    hasStartedChallenge: v.boolean(),
    hasClearedEntryModal: v.boolean(),
    beforePhotoUrl: v.optional(v.string()), // Stored in Convex storage
    afterPhotoUrl: v.optional(v.string()), // Stored in Convex storage
    startedAt: v.number(), // UTC timestamp when challenge started
    updatedAt: v.number(), // Last update timestamp
    completedHabits: v.optional(v.array(v.number())), // Array of completed habit IDs (1-21)
  }).index("by_user_id", ["userId"]),

  challengeOrders: defineTable({
    userId: v.string(), // Clerk user ID
    orderNumber: v.string(), // Unique order identifier
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_order_number", ["orderNumber"]),

  // Challenge messages sent to participants
  challengeMessages: defineTable({
    title: v.string(), // Message title
    message: v.string(), // Message content
    sentBy: v.string(), // Clerk user ID of who sent it
    totalRecipients: v.number(), // Total number of participants
    successCount: v.number(), // Number of successful deliveries
    failureCount: v.number(), // Number of failed deliveries
    createdAt: v.number(), // When message was created
    sentAt: v.number(), // When message was sent
  }).index("by_sent_by", ["sentBy"]),
});
