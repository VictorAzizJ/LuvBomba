const BLOCKED_TERMS = [
  "kill yourself",
  "i will find you",
  "i know where you live",
  "racial slur",
];

export function moderateContent(content: string) {
  const normalized = content.toLowerCase();
  const found = BLOCKED_TERMS.find((term) => normalized.includes(term));
  if (found) {
    throw new Error("Message violates safety policy.");
  }
}

export function sanitizeContent(content: string) {
  const trimmed = content.trim();
  if (trimmed.length < 5) {
    throw new Error("Message must be at least 5 characters.");
  }
  if (trimmed.length > 800) {
    throw new Error("Message cannot exceed 800 characters.");
  }
  return trimmed;
}

export function validateRecipient(input: string, deliveryMethod: "sms" | "email") {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Recipient is required.");
  }

  if (deliveryMethod === "sms") {
    if (!/^\+\d{8,15}$/.test(trimmed)) {
      throw new Error("SMS recipient must be E.164 format.");
    }
    return trimmed;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    throw new Error("Invalid email recipient.");
  }
  return trimmed;
}

export function validateTimezone(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Timezone is required.");
  }

  try {
    Intl.DateTimeFormat("en-US", { timeZone: trimmed });
  } catch {
    throw new Error("Timezone is invalid.");
  }

  return trimmed;
}

export function validateScheduledTime(scheduledTime: number) {
  if (!Number.isFinite(scheduledTime)) {
    throw new Error("Schedule time is invalid.");
  }

  const now = Date.now();
  if (scheduledTime < now) {
    throw new Error("Schedule time must be in the future.");
  }
}

export function validateSenderAlias(input: string | undefined, isAnonymous: boolean) {
  const trimmed = input?.trim();
  if (!isAnonymous && !trimmed) {
    throw new Error("Alias is required when anonymous mode is off.");
  }

  if (trimmed && trimmed.length > 80) {
    throw new Error("Alias cannot exceed 80 characters.");
  }

  return trimmed;
}
