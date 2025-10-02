import { mutation, query } from "./_generated/server";

export const protectedMutation = mutation({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    return { ctx, userId: identity.subject };
  },
});

export const protectedQuery = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    return { ctx, userId: identity.subject };
  },
});

export const withUser = (
  handler: (ctx: any, args: any, userId: string) => any,
) => {
  return async (ctx: any, args: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    return handler(ctx, args, identity.subject);
  };
};
