/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as mealEntry from "../mealEntry.js";
import type * as mindfulnessEntry from "../mindfulnessEntry.js";
import type * as nutritionistChat from "../nutritionistChat.js";
import type * as sleepEntry from "../sleepEntry.js";
import type * as stepEntry from "../stepEntry.js";
import type * as userProfile from "../userProfile.js";
import type * as util from "../util.js";
import type * as waterIntake from "../waterIntake.js";

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
  mindfulnessEntry: typeof mindfulnessEntry;
  nutritionistChat: typeof nutritionistChat;
  sleepEntry: typeof sleepEntry;
  stepEntry: typeof stepEntry;
  userProfile: typeof userProfile;
  util: typeof util;
  waterIntake: typeof waterIntake;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
