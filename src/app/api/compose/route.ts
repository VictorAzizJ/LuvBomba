import { NextRequest, NextResponse } from "next/server";
import { getConvexServerClient } from "@/lib/convex";

function getSenderFingerprint(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return "unknown";
  const [first] = forwarded.split(",");
  return first?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const convex = getConvexServerClient() as any;

    const messageId = await convex.mutation("messages:createMessage" as never, {
      content: body.content,
      deliveryMethod: body.deliveryMethod,
      recipient: body.recipient,
      scheduledTime: new Date(body.scheduledAt).getTime(),
      timezone: body.timezone,
      senderAlias: body.senderAlias ?? undefined,
      isAnonymous: Boolean(body.isAnonymous),
      senderFingerprint: getSenderFingerprint(request),
    });

    const checkoutUrl = await convex.action("paymentsActions:createCheckoutSession" as never, {
      messageId,
    });

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create message and checkout session.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
