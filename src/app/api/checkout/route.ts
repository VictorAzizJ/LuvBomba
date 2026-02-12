import { NextRequest, NextResponse } from "next/server";
import { getConvexServerClient } from "@/lib/convex";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
    }

    const convex = getConvexServerClient() as any;
    const status = await convex.query("payments:getCheckoutStatus", {
      stripeSessionId: sessionId,
    });

    return NextResponse.json(status);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch checkout status.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
