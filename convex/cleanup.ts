import { internalMutation } from "./_generated/server";

export const deleteExpiredSensitiveData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const delivered = await ctx.db
      .query("messages")
      .withIndex("by_status", (q) => q.eq("status", "delivered"))
      .collect();

    let cleaned = 0;
    for (const message of delivered) {
      if (!message.contentDeletedAt || message.contentDeletedAt > now) continue;
      await ctx.db.patch(message._id, {
        content: "[deleted]",
        recipientForDelivery: undefined,
      });
      cleaned += 1;
    }

    return { cleaned };
  },
});
