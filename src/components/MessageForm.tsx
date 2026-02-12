"use client";

import { FormEvent, useMemo, useState } from "react";
import { DeliveryMethod, DeliveryMethodPicker } from "./DeliveryMethodPicker";
import { RetroButton } from "./RetroButton";
import { RetroInput, RetroTextarea } from "./RetroInput";
import { SchedulePicker } from "./SchedulePicker";
import { formatDateTime } from "@/lib/utils";

type SubmitState = "idle" | "loading";
type FormStep = "compose" | "preview";

function validateRecipient(
  input: string,
  deliveryMethod: DeliveryMethod,
): string | null {
  if (deliveryMethod === "sms" && !/^\+\d{8,15}$/.test(input)) {
    return "Phone number must use E.164 format (example: +15555555555).";
  }

  if (
    deliveryMethod === "email" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
  ) {
    return "Please enter a valid email address.";
  }

  return null;
}

export function MessageForm() {
  const [step, setStep] = useState<FormStep>("compose");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("sms");
  const [recipient, setRecipient] = useState("");
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );
  const [senderAlias, setSenderAlias] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const sanitizedRecipient = recipient.trim();
  const sanitizedContent = content.trim();
  const sanitizedTimezone = timezone.trim();
  const sanitizedAlias = senderAlias.trim();

  const preview = useMemo(
    () => ({
      method: deliveryMethod,
      recipient: sanitizedRecipient,
      sendAt:
        scheduledAt && sanitizedTimezone
          ? `${formatDateTime(scheduledAt)} (${sanitizedTimezone})`
          : formatDateTime(scheduledAt),
      signature: isAnonymous
        ? "Anonymous"
        : sanitizedAlias || "Someone thinking of you",
      content: sanitizedContent,
    }),
    [
      deliveryMethod,
      sanitizedRecipient,
      scheduledAt,
      sanitizedTimezone,
      isAnonymous,
      sanitizedAlias,
      sanitizedContent,
    ],
  );

  function validateForm() {
    if (!sanitizedRecipient) {
      setErrorMessage("Recipient is required.");
      return false;
    }

    const recipientError = validateRecipient(sanitizedRecipient, deliveryMethod);
    if (recipientError) {
      setErrorMessage(recipientError);
      return false;
    }

    if (sanitizedContent.length < 5) {
      setErrorMessage("Message must be at least 5 characters.");
      return false;
    }

    if (sanitizedContent.length > 800) {
      setErrorMessage("Message cannot exceed 800 characters.");
      return false;
    }

    if (!scheduledAt) {
      setErrorMessage("Please pick a schedule time.");
      return false;
    }

    if (Number.isNaN(new Date(scheduledAt).getTime())) {
      setErrorMessage("Schedule time is invalid.");
      return false;
    }

    if (!sanitizedTimezone) {
      setErrorMessage("Timezone is required.");
      return false;
    }

    if (!isAnonymous && !sanitizedAlias) {
      setErrorMessage("Alias is required when anonymous mode is off.");
      return false;
    }

    setErrorMessage("");
    return true;
  }

  function handlePreview() {
    if (!validateForm()) return;
    setStep("preview");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (step !== "preview") {
      handlePreview();
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmitState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryMethod,
          recipient: sanitizedRecipient,
          content: sanitizedContent,
          scheduledAt,
          timezone: sanitizedTimezone,
          senderAlias: isAnonymous ? null : sanitizedAlias,
          isAnonymous,
        }),
      });

      if (!response.ok) {
        let backendError = "Unable to create checkout session.";
        try {
          const payload = (await response.json()) as { error?: string };
          if (payload.error) {
            backendError = payload.error;
          }
        } catch {
          // Ignore non-JSON failures and keep fallback message.
        }
        throw new Error(backendError);
      }

      const data = (await response.json()) as { checkoutUrl?: string };
      if (!data.checkoutUrl) {
        throw new Error("Checkout URL missing.");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      setStep("compose");
      setErrorMessage(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setSubmitState("idle");
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 text-sm md:text-base">
        <span
          className={step === "compose" ? "font-retro text-ink" : "text-ink/60"}
        >
          1. Compose
        </span>
        <span aria-hidden="true">-&gt;</span>
        <span
          className={step === "preview" ? "font-retro text-ink" : "text-ink/60"}
        >
          2. Preview
        </span>
      </div>

      {step === "compose" && (
        <>
          <div className="grid gap-2">
            <p className="font-retro text-[10px] uppercase tracking-wider">
              Delivery
            </p>
            <DeliveryMethodPicker
              value={deliveryMethod}
              onChange={(nextMethod) => {
                setDeliveryMethod(nextMethod);
                setErrorMessage("");
              }}
            />
          </div>

          <label className="text-lg">
            <span className="mb-1 block">
              Recipient {deliveryMethod === "sms" ? "Phone Number" : "Email"}
            </span>
            <RetroInput
              required
              type={deliveryMethod === "sms" ? "tel" : "email"}
              placeholder={
                deliveryMethod === "sms" ? "+15555555555" : "friend@example.com"
              }
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
            />
          </label>

          <label className="text-lg">
            <span className="mb-1 block">Message</span>
            <RetroTextarea
              required
              minLength={5}
              maxLength={800}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="h-32"
            />
            <p className="mt-1 text-base text-ink/70">{content.length}/800</p>
          </label>

          <SchedulePicker
            value={scheduledAt}
            timezone={timezone}
            onChange={setScheduledAt}
            onTimezoneChange={setTimezone}
          />

          <label className="flex items-center gap-2 text-lg">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(event) => setIsAnonymous(event.target.checked)}
              className="size-4 accent-bubblegum"
            />
            Send anonymously
          </label>

          {!isAnonymous && (
            <label className="text-lg">
              <span className="mb-1 block">Alias</span>
              <RetroInput
                required
                placeholder="from someone thinking of you"
                value={senderAlias}
                onChange={(event) => setSenderAlias(event.target.value)}
              />
            </label>
          )}

          <RetroButton
            type="button"
            onClick={handlePreview}
            disabled={submitState === "loading"}
          >
            Continue to preview
          </RetroButton>
        </>
      )}

      {step === "preview" && (
        <>
          <section className="rounded-sm border-[3px] border-ink bg-white p-3 text-lg">
            <p className="font-retro text-[10px] uppercase tracking-wider">
              Preview
            </p>
            <p>
              <strong>Method:</strong> {preview.method}
            </p>
            <p>
              <strong>Recipient:</strong> {preview.recipient || "—"}
            </p>
            <p>
              <strong>Scheduled:</strong> {preview.sendAt || "—"}
            </p>
            <p>
              <strong>From:</strong> {preview.signature}
            </p>
            <p className="mt-2 whitespace-pre-wrap rounded bg-lavender/30 p-2">
              {preview.content || "—"}
            </p>
          </section>

          <div className="flex flex-wrap gap-3">
            <RetroButton
              type="button"
              className="bg-lavender"
              disabled={submitState === "loading"}
              onClick={() => setStep("compose")}
            >
              Back to edit
            </RetroButton>
            <RetroButton type="submit" disabled={submitState === "loading"}>
              {submitState === "loading"
                ? "Opening checkout..."
                : "Continue to checkout"}
            </RetroButton>
          </div>
        </>
      )}

      {errorMessage && <p className="text-lg text-red-700">{errorMessage}</p>}
    </form>
  );
}
