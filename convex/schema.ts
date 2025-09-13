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
    .index("by_user_id", ["userID"])
});