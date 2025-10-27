import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update a note for a specific date (one note per day)
export const upsert = mutation({
  args: {
    content: v.string(),
    date: v.string(), // Format: YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Check if a note already exists for this date
    const existingNote = await ctx.db
      .query("noteEntry")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userID", identity.subject).eq("date", args.date)
      )
      .first();

    if (existingNote) {
      // Update existing note
      await ctx.db.patch(existingNote._id, {
        content: args.content,
        timestamp: Date.now(),
      });
      return existingNote._id;
    } else {
      // Create new note
      return await ctx.db.insert("noteEntry", {
        userID: identity.subject,
        content: args.content,
        date: args.date,
        timestamp: Date.now(),
      });
    }
  },
});

// Get note for a specific date
export const getByDate = query({
  args: {
    date: v.string(), // Format: YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const note = await ctx.db
      .query("noteEntry")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userID", identity.subject).eq("date", args.date)
      )
      .first();

    return note;
  },
});

// Get all notes for a user within a date range
export const getByDateRange = query({
  args: {
    startDate: v.string(), // Format: YYYY-MM-DD
    endDate: v.string(), // Format: YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const notes = await ctx.db
      .query("noteEntry")
      .withIndex("by_user_id", (q) => q.eq("userID", identity.subject))
      .collect();

    // Filter by date range
    return notes.filter(
      (note) => note.date >= args.startDate && note.date <= args.endDate
    );
  },
});

// Delete a note by date
export const deleteByDate = mutation({
  args: {
    date: v.string(), // Format: YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const note = await ctx.db
      .query("noteEntry")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userID", identity.subject).eq("date", args.date)
      )
      .first();

    if (note) {
      await ctx.db.delete(note._id);
      return note._id;
    }
    return null;
  },
});

// Server-side function for API routes
export const getByDateForServer = query({
  args: {
    userId: v.string(),
    date: v.string(), // Format: YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const note = await ctx.db
      .query("noteEntry")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userID", args.userId).eq("date", args.date)
      )
      .first();

    return note;
  },
});
