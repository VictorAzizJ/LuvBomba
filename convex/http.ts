import Stripe from "stripe";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { httpRouter } from "convex/server";

function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(secret, {
    apiVersion: "2026-01-28.clover",
  });
}

export const stripeWebhook = httpAction(async (ctx, request) => {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return new Response("Missing Stripe signature or secret.", { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.id) {
      await ctx.runMutation(internal.payments.updatePaymentStatus, {
        stripeSessionId: session.id,
        status: "completed",
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      });
    }
  }
  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.id) {
      await ctx.runMutation(internal.payments.updatePaymentStatus, {
        stripeSessionId: session.id,
        status: "failed",
        failedMessageStatus: "failed",
      });
    }
  }
  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.id) {
      await ctx.runMutation(internal.payments.updatePaymentStatus, {
        stripeSessionId: session.id,
        status: "failed",
        failedMessageStatus: "cancelled",
      });
    }
  }

  return new Response("ok", { status: 200 });
});

const http = httpRouter();
http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: stripeWebhook,
});

export default http;
