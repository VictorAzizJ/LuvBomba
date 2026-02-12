import { v } from "convex/values";
import { mutation, internalMutation, internalQuery } from "./_generated/server";
import { MESSAGE_RETENTION_HOURS, RATE_LIMIT_MAX_MESSAGES, RATE_LIMIT_WINDOW_MS } from "./lib/constants";
import { hashRecipient } from "./lib/privacy";
import {
  moderateContent,
  sanitizeContent,
  validateRecipient,
  validateScheduledTime,
  validateSenderAlias,
  validateTimezone,
} from "./lib/validation";

export const createMessage = mutation({
  args: {
    content: v.string(),
    deliveryMethod: v.union(v.literal("sms"), v.literal("email")),
    recipient: v.string(),
    scheduledTime: v.number(),
    timezone: v.string(),
    senderAlias: v.optional(v.string()),
    isAnonymous: v.boolean(),
    senderFingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    const content = sanitizeContent(args.content);
    moderateContent(content);
    const recipient = validateRecipient(args.recipient, args.deliveryMethod);
    const timezone = validateTimezone(args.timezone);
    const senderAlias = validateSenderAlias(args.senderAlias, args.isAnonymous);
    validateScheduledTime(args.scheduledTime);

    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    const existing = await ctx.db
      .query("rateLimits")
      .withIndex("by_fingerprint", (q) => q.eq("senderFingerprint", args.senderFingerprint))
      .first();

    if (!existing || existing.windowStart < windowStart) {
      if (existing) {
        await ctx.db.patch(existing._id, {
          messageCount: 1,
          windowStart: now,
        });
      } else {
        await ctx.db.insert("rateLimits", {
          senderFingerprint: args.senderFingerprint,
          messageCount: 1,
          windowStart: now,
        });
      }
    } else if (existing.messageCount >= RATE_LIMIT_MAX_MESSAGES) {
      throw new Error("Rate limit exceeded. Please try again later.");
    } else {
      await ctx.db.patch(existing._id, {
        messageCount: existing.messageCount + 1,
      });
    }

    const recipientHash = await hashRecipient(recipient);
    const optedOut = await ctx.db
      .query("optOuts")
      .withIndex("by_recipientHash_deliveryMethod", (q) =>
        q.eq("recipientHash", recipientHash).eq("deliveryMethod", args.deliveryMethod),
      )
      .first();

    if (optedOut) {
      throw new Error("Recipient has opted out.");
    }

    return ctx.db.insert("messages", {
      content,
      deliveryMethod: args.deliveryMethod,
      recipient: recipientHash,
      recipientForDelivery: recipient,
      scheduledTime: args.scheduledTime,
      timezone,
      senderAlias,
      isAnonymous: args.isAnonymous,
      status: "pending_payment",
      recurrence: "once",
      messageType: "freetext",
      contentDeletedAt: now + MESSAGE_RETENTION_HOURS * 60 * 60 * 1000,
    });
  },
});

export const getMessage = internalQuery({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.messageId);
  },
});

export const markScheduled = internalMutation({
  args: {
    messageId: v.id("messages"),
    scheduledFunctionId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      status: "scheduled",
      scheduledFunctionId: args.scheduledFunctionId,
    });
  },
});
