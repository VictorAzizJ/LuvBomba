const encoder = new TextEncoder();

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(input: string) {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", encoder.encode(input));
  return bytesToHex(new Uint8Array(digest));
}

async function hmacSha256Hex(secret: string, input: string) {
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await globalThis.crypto.subtle.sign("HMAC", key, encoder.encode(input));
  return bytesToHex(new Uint8Array(signature));
}

export async function hashRecipient(recipient: string) {
  return sha256Hex(recipient.trim().toLowerCase());
}

export async function signOptOutToken(payload: { recipientHash: string; method: "sms" | "email" }) {
  const secret = process.env.OPT_OUT_TOKEN_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET ?? "dev-secret";
  const raw = JSON.stringify(payload);
  const sig = await hmacSha256Hex(secret, raw);
  return `${encodeURIComponent(raw)}.${sig}`;
}

export async function verifyOptOutToken(token: string) {
  const secret = process.env.OPT_OUT_TOKEN_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET ?? "dev-secret";
  const separator = token.lastIndexOf(".");
  if (separator <= 0 || separator === token.length - 1) {
    throw new Error("Invalid token");
  }

  const encodedRaw = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const raw = decodeURIComponent(encodedRaw);
  const expected = await hmacSha256Hex(secret, raw);
  if (signature !== expected) {
    throw new Error("Invalid token");
  }

  return JSON.parse(raw) as { recipientHash: string; method: "sms" | "email" };
}
