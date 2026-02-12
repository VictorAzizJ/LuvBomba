import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    content: v.string(),
    deliveryMethod: v.union(v.literal("sms"), v.literal("email")),
    recipient: v.string(),
    recipientForDelivery: v.optional(v.string()),
    scheduledTime: v.number(),
    timezone: v.string(),
    senderAlias: v.optional(v.string()),
    isAnonymous: v.boolean(),
    status: v.union(
      v.literal("pending_payment"),
      v.literal("scheduled"),
      v.literal("delivering"),
      v.literal("delivered"),
      v.literal("failed"),
      v.literal("opted_out"),
      v.literal("cancelled"),
    ),
    paymentId: v.optional(v.id("payments")),
    scheduledFunctionId: v.optional(v.string()),
    recurrence: v.optional(
      v.union(v.literal("once"), v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
    ),
    messageType: v.optional(v.union(v.literal("freetext"), v.literal("prompted"))),
    promptId: v.optional(v.string()),
    deliveredAt: v.optional(v.number()),
    contentDeletedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_paymentId", ["paymentId"]),

  payments: defineTable({
    stripeSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    messageId: v.id("messages"),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("refunded")),
    bundleId: v.optional(v.string()),
    creditsGranted: v.optional(v.number()),
  })
    .index("by_stripeSessionId", ["stripeSessionId"])
    .index("by_messageId", ["messageId"]),

  optOuts: defineTable({
    recipientHash: v.string(),
    deliveryMethod: v.union(v.literal("sms"), v.literal("email")),
  })
    .index("by_recipientHash", ["recipientHash"])
    .index("by_recipientHash_deliveryMethod", ["recipientHash", "deliveryMethod"]),

  rateLimits: defineTable({
    senderFingerprint: v.string(),
    messageCount: v.number(),
    windowStart: v.number(),
  }).index("by_fingerprint", ["senderFingerprint"]),
});
