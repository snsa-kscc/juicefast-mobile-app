import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL with Neon
    schema,
  }),
  baseURL: process.env.EXPO_PUBLIC_AUTH_URL || "http://localhost:8081",
  trustedOrigins: [
    "exp://localhost:8081", // Expo development
    "http://localhost:8081", // Web development
    // Add your production URLs here when deploying
  ],
  plugins: [expo()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
