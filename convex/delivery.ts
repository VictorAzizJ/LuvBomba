import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const updateMessageStatus = internalMutation({
  args: {
    messageId: v.id("messages"),
    status: v.union(
      v.literal("pending_payment"),
      v.literal("scheduled"),
      v.literal("delivering"),
      v.literal("delivered"),
      v.literal("failed"),
      v.literal("opted_out"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, { status: args.status });
  },
});

export const markDelivered = internalMutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      status: "delivered",
      deliveredAt: Date.now(),
    });
  },
});
