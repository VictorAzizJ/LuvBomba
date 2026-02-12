import { ConvexHttpClient } from "convex/browser";

export function getConvexServerClient() {
  const url = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("Missing CONVEX_URL / NEXT_PUBLIC_CONVEX_URL");
  }
  return new ConvexHttpClient(url);
}
