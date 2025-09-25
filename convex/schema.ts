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
});

