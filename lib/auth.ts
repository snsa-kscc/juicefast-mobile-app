import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: "file:./auth.db", // SQLite database for development
  },
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
