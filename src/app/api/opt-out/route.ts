import { NextRequest, NextResponse } from "next/server";
import { getConvexServerClient } from "@/lib/convex";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const convex = getConvexServerClient() as any;

    await convex.mutation("optOut:optOutByToken", {
      token: body.token,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process opt-out request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
