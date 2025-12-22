import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const enrollInChallenge = mutation({
  args: {
    orderNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const now = Date.now();

    // Check if order number already exists
    const existingOrder = await ctx.db
      .query("challengeOrders")
      .withIndex("by_order_number", (q) =>
        q.eq("orderNumber", args.orderNumber)
      )
      .first();

    if (existingOrder) {
      throw new Error("Order number already exists");
    }

    // Check if user already has challenge progress
    const existingProgress = await ctx.db
      .query("challengeProgress")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    // Create the order
    await ctx.db.insert("challengeOrders", {
      userId,
      orderNumber: args.orderNumber,
      createdAt: now,
      updatedAt: now,
    });

    // Create or update challenge progress
    if (existingProgress) {
      // Update existing progress
      await ctx.db.patch(existingProgress._id, {
        hasStartedChallenge: true,
        updatedAt: now,
      });
      return existingProgress._id;
    } else {
      // Create new challenge progress
      const progressId = await ctx.db.insert("challengeProgress", {
        userId,
        hasStartedChallenge: true,
        hasClearedEntryModal: false,
        beforePhotoUrl: undefined,
        afterPhotoUrl: undefined,
        startedAt: now,
        updatedAt: now,
      });

      return progressId;
    }
  },
});

export const createOrder = mutation({
  args: {
    orderNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const now = Date.now();

    // Check if order number already exists
    const existingOrder = await ctx.db
      .query("challengeOrders")
      .withIndex("by_order_number", (q) =>
        q.eq("orderNumber", args.orderNumber)
      )
      .first();

    if (existingOrder) {
      throw new Error("Order number already exists");
    }

    // Create the order
    const orderId = await ctx.db.insert("challengeOrders", {
      userId,
      orderNumber: args.orderNumber,
      createdAt: now,
      updatedAt: now,
    });

    return orderId;
  },
});

export const getOrdersByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;
    const orders = await ctx.db
      .query("challengeOrders")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    return orders;
  },
});

export const getOrderByNumber = query({
  args: {
    orderNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("challengeOrders")
      .withIndex("by_order_number", (q) =>
        q.eq("orderNumber", args.orderNumber)
      )
      .first();

    return order;
  },
});
