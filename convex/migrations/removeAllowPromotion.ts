import { internalMutation } from "../_generated/server";

export const removeAllowPromotionField = internalMutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query("userProfile").collect();
    
    let updated = 0;
    for (const profile of profiles) {
      // @ts-ignore - accessing field that's not in schema
      if (profile.allow_promotion !== undefined) {
        // Remove the allow_promotion field by patching without it
        const { allow_promotion, ...rest } = profile as any;
        await ctx.db.replace(profile._id, rest);
        updated++;
      }
    }
    
    console.log(`Removed allow_promotion field from ${updated} user profiles`);
    return { updated };
  },
});
