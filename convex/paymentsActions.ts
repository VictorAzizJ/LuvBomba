"use node";

import Stripe from "stripe";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { FLAT_PRICING_CENTS } from "./lib/constants";

function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(secret, { apiVersion: "2026-01-28.clover" });
}

export const createCheckoutSession: any = action({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args): Promise<string> => {
    const message = await ctx.runQuery(internal.messages.getMessage, { messageId: args.messageId });
    if (!message) throw new Error("Message not found.");
    if (message.status !== "pending_payment") throw new Error("Message already processed.");

    const stripe = getStripe();
    const amount = FLAT_PRICING_CENTS[message.deliveryMethod as keyof typeof FLAT_PRICING_CENTS];
    const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${baseUrl}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/compose?checkout=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amount,
            product_data: {
              name: `LuvBomba ${message.deliveryMethod.toUpperCase()} message`,
            },
          },
        },
      ],
      metadata: {
        messageId: args.messageId,
      },
    });

    if (!session.id || !session.url) throw new Error("Unable to create Stripe session.");

    const paymentId = await ctx.runMutation(internal.payments.createPendingPayment, {
      stripeSessionId: session.id,
      amount,
      currency: "usd",
      messageId: args.messageId,
    });

    await ctx.runMutation(internal.payments.attachPaymentToMessage, {
      messageId: args.messageId,
      paymentId,
    });

    return session.url;
  },
});
