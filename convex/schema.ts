import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  stepEntry: defineTable({
    userId: v.string(),
    count: v.number(), // steps in this entry
    timestamp: v.number(), // UTC timestamp when recorded
  })
    .index("by_user_id", ["userId"]),
  
  waterIntake: defineTable({
    userID: v.string(),
    amount: v.number(),
    timestamp: v.number(),
  })
    .index("by_user_id", ["userID"]),

  mindfulnessEntry: defineTable({
    userID: v.string(),
    minutes: v.number(),
    activity: v.string(),
    timestamp: v.number(),
  })
    .index("by_user_id", ["userID"]),

  sleepEntry: defineTable({
    userID: v.string(),
    hoursSlept: v.number(),
    quality: v.number(),
    startTime: v.number(),
    endTime: v.number(),
    timestamp: v.number(),
  })
    .index("by_user_id", ["userID"]),

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
  })
    .index("by_user_id", ["userID"]),

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

  // Nutritionist chat tables
  nutritionists: defineTable({
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
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_online_status", ["isOnline"]),

  chatSessions: defineTable({
    userId: v.string(),
    userName: v.string(),
    nutritionistId: v.string(),
    status: v.union(v.literal("active"), v.literal("ended"), v.literal("pending")),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    lastMessageAt: v.number()
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
    isRead: v.boolean()
  })
    .index("by_session", ["sessionId"])
    .index("by_sender", ["senderId"]),
});

