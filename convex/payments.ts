import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const getCheckoutStatus = query({
  args: {
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_stripeSessionId", (q) => q.eq("stripeSessionId", args.stripeSessionId))
      .first();

    if (!payment) {
      return {
        exists: false,
        paymentStatus: null,
        messageStatus: null,
      };
    }

    const message = await ctx.db.get(payment.messageId);

    return {
      exists: true,
      paymentStatus: payment.status,
      messageStatus: message?.status ?? null,
    };
  },
});

export const createPendingPayment = internalMutation({
  args: {
    stripeSessionId: v.string(),
    amount: v.number(),
    currency: v.string(),
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("payments", {
      stripeSessionId: args.stripeSessionId,
      amount: args.amount,
      currency: args.currency,
      messageId: args.messageId,
      status: "pending",
    });
  },
});

export const attachPaymentToMessage = internalMutation({
  args: {
    messageId: v.id("messages"),
    paymentId: v.id("payments"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, { paymentId: args.paymentId });
  },
});

export const completePaymentAndSchedule = internalMutation({
  args: {
    stripeSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_stripeSessionId", (q) => q.eq("stripeSessionId", args.stripeSessionId))
      .first();
    if (!payment) throw new Error("Payment not found.");
    if (payment.status === "completed") return;

    await ctx.db.patch(payment._id, {
      status: "completed",
      stripePaymentIntentId: args.stripePaymentIntentId,
    });

    const message = await ctx.db.get(payment.messageId);
    if (!message) throw new Error("Message not found.");
    const delayMs = Math.max(message.scheduledTime - Date.now(), 0);
    const scheduledFunctionId = await ctx.scheduler.runAfter(delayMs, internal.deliveryActions.deliverMessage, {
      messageId: message._id,
    });

    await ctx.runMutation(internal.messages.markScheduled, {
      messageId: message._id,
      scheduledFunctionId: String(scheduledFunctionId),
    });
  },
});

export const updatePaymentStatus = internalMutation({
  args: {
    stripeSessionId: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("refunded")),
    stripePaymentIntentId: v.optional(v.string()),
    failedMessageStatus: v.optional(v.union(v.literal("failed"), v.literal("cancelled"))),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_stripeSessionId", (q) => q.eq("stripeSessionId", args.stripeSessionId))
      .first();

    if (!payment) {
      return;
    }

    const nextStatus = args.status;
    const shouldSetIntent = typeof args.stripePaymentIntentId === "string";

    if (payment.status !== nextStatus || shouldSetIntent) {
      await ctx.db.patch(payment._id, {
        status: nextStatus,
        stripePaymentIntentId: args.stripePaymentIntentId ?? payment.stripePaymentIntentId,
      });
    }

    const message = await ctx.db.get(payment.messageId);
    if (!message) {
      return;
    }

    if (nextStatus === "completed") {
      if (message.status !== "pending_payment") {
        return;
      }

      const delayMs = Math.max(message.scheduledTime - Date.now(), 0);
      const scheduledFunctionId = await ctx.scheduler.runAfter(delayMs, internal.deliveryActions.deliverMessage, {
        messageId: message._id,
      });

      await ctx.runMutation(internal.messages.markScheduled, {
        messageId: message._id,
        scheduledFunctionId: String(scheduledFunctionId),
      });
      return;
    }

    if (
      (nextStatus === "failed" || nextStatus === "refunded") &&
      message.status === "pending_payment"
    ) {
      await ctx.db.patch(message._id, {
        status: args.failedMessageStatus ?? "failed",
      });
    }
  },
});
