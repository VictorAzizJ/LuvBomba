"use node";

import { v } from "convex/values";
import twilio from "twilio";
import { Resend } from "resend";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { signOptOutToken } from "./lib/privacy";

function getBaseUrl() {
  return process.env.APP_BASE_URL ?? "http://localhost:3000";
}

export const deliverMessage = internalAction({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.runQuery(internal.messages.getMessage, {
      messageId: args.messageId,
    });
    if (!message) return;
    if (message.status !== "scheduled") return;

    await ctx.runMutation(internal.delivery.updateMessageStatus, {
      messageId: args.messageId,
      status: "delivering",
    });

    try {
      const optedOut = await ctx.runQuery(internal.optOut.isRecipientOptedOut, {
        recipientHash: message.recipient,
        deliveryMethod: message.deliveryMethod,
      });

      if (optedOut) {
        await ctx.runMutation(internal.delivery.updateMessageStatus, {
          messageId: args.messageId,
          status: "opted_out",
        });
        return;
      }

      if (!message.recipientForDelivery) throw new Error("Missing recipient for delivery.");

      const token = await signOptOutToken({
        recipientHash: message.recipient,
        method: message.deliveryMethod,
      });
      const optOutUrl = `${getBaseUrl()}/opt-out/${token}`;
      const sender = message.isAnonymous ? "Anonymous" : message.senderAlias || "Someone thinking of you";

      if (message.deliveryMethod === "sms") {
        await sendSms(message.recipientForDelivery, `${message.content}\n\nFrom: ${sender}\nOpt out: ${optOutUrl}`);
      } else {
        await sendEmail(message.recipientForDelivery, message.content, sender, optOutUrl);
      }

      await ctx.runMutation(internal.delivery.markDelivered, {
        messageId: args.messageId,
      });
    } catch {
      await ctx.runMutation(internal.delivery.updateMessageStatus, {
        messageId: args.messageId,
        status: "failed",
      });
    }
  },
});

async function sendSms(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!accountSid || !authToken || !from) {
    throw new Error("Missing Twilio env vars.");
  }

  const client = twilio(accountSid, authToken);
  await client.messages.create({ to, from, body });
}

async function sendEmail(to: string, content: string, senderAlias: string, optOutUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("Missing Resend env vars.");
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to,
    subject: "You received a LoveBomba message",
    text: `${content}\n\nFrom: ${senderAlias}\n\nOpt out: ${optOutUrl}`,
  });
}
