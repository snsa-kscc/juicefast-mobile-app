/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as mealEntry from "../mealEntry.js";
import type * as migrations_removeAllowPromotion from "../migrations/removeAllowPromotion.js";
import type * as mindfulnessEntry from "../mindfulnessEntry.js";
import type * as noteEntry from "../noteEntry.js";
import type * as nutritionistChat from "../nutritionistChat.js";
import type * as sleepEntry from "../sleepEntry.js";
import type * as stepEntry from "../stepEntry.js";
import type * as userProfile from "../userProfile.js";
import type * as users from "../users.js";
import type * as util from "../util.js";
import type * as waterIntake from "../waterIntake.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  mealEntry: typeof mealEntry;
  "migrations/removeAllowPromotion": typeof migrations_removeAllowPromotion;
  mindfulnessEntry: typeof mindfulnessEntry;
  noteEntry: typeof noteEntry;
  nutritionistChat: typeof nutritionistChat;
  sleepEntry: typeof sleepEntry;
  stepEntry: typeof stepEntry;
  userProfile: typeof userProfile;
  users: typeof users;
  util: typeof util;
  waterIntake: typeof waterIntake;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
