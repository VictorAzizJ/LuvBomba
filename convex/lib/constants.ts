export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
export const RATE_LIMIT_MAX_MESSAGES = 10;

function parseRetentionHours(value: string | undefined) {
  if (!value) return 48;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 48;
  return parsed;
}

export const MESSAGE_RETENTION_HOURS = parseRetentionHours(process.env.MESSAGE_RETENTION_HOURS);

export const FLAT_PRICING_CENTS = {
  sms: 150,
  email: 50,
} as const;
