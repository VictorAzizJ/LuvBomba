"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RetroButton } from "@/components/RetroButton";
import { RetroCard } from "@/components/RetroCard";
import { RetroLayout } from "@/components/RetroLayout";

type CheckoutStatusResponse = {
  exists: boolean;
  paymentStatus: "pending" | "completed" | "failed" | "refunded" | null;
  messageStatus:
    | "pending_payment"
    | "scheduled"
    | "delivering"
    | "delivered"
    | "failed"
    | "opted_out"
    | "cancelled"
    | null;
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<CheckoutStatusResponse | null>(null);
  const [error, setError] = useState<string>("");

  const canConfirm = useMemo(() => {
    if (!status) return false;
    if (status.paymentStatus !== "completed") return false;
    return status.messageStatus === "scheduled" || status.messageStatus === "delivering" || status.messageStatus === "delivered";
  }, [status]);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing Stripe session id. Please try checkout again.");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      if (cancelled) return;
      attempts += 1;

      try {
        const response = await fetch(`/api/checkout?session_id=${encodeURIComponent(sessionId)}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          let backendError = "Unable to verify payment status.";
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
        const data = (await response.json()) as CheckoutStatusResponse;
        if (cancelled) return;
        setStatus(data);

        if (
          data.paymentStatus === "completed" &&
          (data.messageStatus === "scheduled" || data.messageStatus === "delivering" || data.messageStatus === "delivered")
        ) {
          router.replace("/confirmation");
          return;
        }

        if (data.paymentStatus === "failed" || data.messageStatus === "cancelled" || data.messageStatus === "failed") {
          setError("Payment was not completed. Please try again.");
          return;
        }

        if (attempts >= 20) {
          setError("Still waiting for payment confirmation. Refresh this page in a moment.");
          return;
        }

        window.setTimeout(poll, 1500);
      } catch (pollError) {
        if (cancelled) return;
        setError(pollError instanceof Error ? pollError.message : "Unable to verify payment status.");
      }
    };

    void poll();

    return () => {
      cancelled = true;
    };
  }, [router, sessionId]);

  if (!sessionId) {
    return (
      <RetroLayout>
        <RetroCard title="Checkout">
          <p className="mt-2 text-xl">Missing checkout session. Return to compose and try again.</p>
          <div className="mt-4">
            <Link href="/compose">
              <RetroButton className="bg-mint">Back to compose</RetroButton>
            </Link>
          </div>
        </RetroCard>
      </RetroLayout>
    );
  }

  return (
    <RetroLayout>
      <RetroCard title="Confirming payment">
        <p className="mt-2 text-xl">
          We are verifying your Stripe payment and preparing delivery.
        </p>
        {error ? (
          <p className="mt-3 text-lg text-red-700">{error}</p>
        ) : (
          <p className="mt-3 text-lg">
            Status: {status?.paymentStatus ?? "pending"} / Message:{" "}
            {status?.messageStatus ?? "pending_payment"}
          </p>
        )}
        <div className="mt-4 flex gap-3">
          <Link href="/compose">
            <RetroButton className="bg-mint">Back to compose</RetroButton>
          </Link>
          {!canConfirm && (
            <RetroButton type="button" onClick={() => window.location.reload()}>
              Refresh status
            </RetroButton>
          )}
        </div>
      </RetroCard>
    </RetroLayout>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <RetroLayout>
          <RetroCard title="Confirming payment">
            <p className="mt-2 text-xl">Loading checkout status...</p>
          </RetroCard>
        </RetroLayout>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
