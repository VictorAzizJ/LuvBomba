import { v } from "convex/values";
import { internalQuery, mutation } from "./_generated/server";
import { verifyOptOutToken } from "./lib/privacy";

export const optOutByToken = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const payload = await verifyOptOutToken(args.token);
    const existing = await ctx.db
      .query("optOuts")
      .withIndex("by_recipientHash_deliveryMethod", (q) =>
        q.eq("recipientHash", payload.recipientHash).eq("deliveryMethod", payload.method),
      )
      .first();

    if (!existing) {
      await ctx.db.insert("optOuts", {
        recipientHash: payload.recipientHash,
        deliveryMethod: payload.method,
      });
    }

    return { ok: true };
  },
});

export const isRecipientOptedOut = internalQuery({
  args: {
    recipientHash: v.string(),
    deliveryMethod: v.union(v.literal("sms"), v.literal("email")),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("optOuts")
      .withIndex("by_recipientHash_deliveryMethod", (q) =>
        q.eq("recipientHash", args.recipientHash).eq("deliveryMethod", args.deliveryMethod),
      )
      .first();
    return Boolean(record);
  },
});
