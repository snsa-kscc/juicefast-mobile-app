import { pgTable, text, timestamp, boolean, integer, json, pgEnum, date, real } from "drizzle-orm/pg-core";

// User tables (existing)
export const user = pgTable("jf-user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("jf-session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("jf-account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("jf-verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Nutritionist chat enums
export const sessionStatusEnum = pgEnum("jf-session_status", ["pending", "active", "ended"]);
export const senderTypeEnum = pgEnum("jf-sender_type", ["user", "nutritionist"]);
export const notificationTypeEnum = pgEnum("jf-notification_type", ["new_message", "session_ended"]);

// Nutritionist tables
export const nutritionistProfile = pgTable("jf-nutritionist_profile", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  specialties: json("specialties").$type<string[]>().notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photo_url"),
  available: boolean("available").default(true),
  nextAvailableSlot: timestamp("next_available_slot"),
  workingHours: json("working_hours"),
  averageResponseTime: integer("average_response_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chatSession = pgTable("jf-chat_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  nutritionistId: text("nutritionist_id")
    .notNull()
    .references(() => nutritionistProfile.id, { onDelete: "cascade" }),
  status: sessionStatusEnum("status").notNull().default("active"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
  endedBy: senderTypeEnum("ended_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chatMessage = pgTable("jf-chat_message", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => chatSession.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  sender: senderTypeEnum("sender").notNull(),
  senderId: text("sender_id").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatNotification = pgTable("jf-chat_notification", {
  id: text("id").primaryKey(),
  recipientId: text("recipient_id").notNull(),
  recipientType: senderTypeEnum("recipient_type").notNull(),
  sessionId: text("session_id").references(() => chatSession.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ======== HEALTH TRACKING TABLES ========

// User profile for health tracking
export const userProfile = pgTable("jf-user-profile", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  height: real("height"), // in cm
  weight: real("weight"), // in kg
  age: integer("age"),
  gender: text("gender"),
  activityLevel: text("activity_level"),
  referralCode: text("referral_code"),
  referredBy: text("referred_by"),
  referralCount: integer("referral_count").default(0),
  referrals: json("referrals").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Daily health metrics
export const dailyHealthMetrics = pgTable("jf-daily-health-metrics", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  totalScore: real("total_score"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Meal tracking
export const mealEntry = pgTable("jf-meal-entry", {
  id: text("id").primaryKey(),
  metricsId: text("metrics_id")
    .notNull()
    .references(() => dailyHealthMetrics.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  calories: real("calories").notNull(),
  protein: real("protein").notNull(),
  carbs: real("carbs").notNull(),
  fat: real("fat").notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Water intake tracking
export const waterIntake = pgTable("jf-water-intake", {
  id: text("id").primaryKey(),
  metricsId: text("metrics_id")
    .notNull()
    .references(() => dailyHealthMetrics.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(), // in ml
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Step tracking
export const stepEntry = pgTable("jf-step-entry", {
  id: text("id").primaryKey(),
  metricsId: text("metrics_id")
    .notNull()
    .references(() => dailyHealthMetrics.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  count: integer("count").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Sleep tracking
export const sleepEntry = pgTable("jf-sleep-entry", {
  id: text("id").primaryKey(),
  metricsId: text("metrics_id")
    .notNull()
    .references(() => dailyHealthMetrics.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  hoursSlept: real("hours_slept").notNull(),
  quality: integer("quality").notNull(), // 1-10 scale
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Mindfulness tracking
export const mindfulnessEntry = pgTable("jf-mindfulness-entry", {
  id: text("id").primaryKey(),
  metricsId: text("metrics_id")
    .notNull()
    .references(() => dailyHealthMetrics.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  minutes: integer("minutes").notNull(),
  activity: text("activity").notNull(), // meditation, breathing, etc.
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
