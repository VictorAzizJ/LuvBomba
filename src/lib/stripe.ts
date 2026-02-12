import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeServerClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2026-01-28.clover",
    });
  }
  return stripeClient;
}
