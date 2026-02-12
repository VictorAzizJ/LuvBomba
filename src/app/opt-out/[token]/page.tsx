"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { RetroButton } from "@/components/RetroButton";
import { RetroCard } from "@/components/RetroCard";
import { RetroLayout } from "@/components/RetroLayout";

export default function OptOutPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function handleOptOut() {
    if (!token) {
      setStatus("error");
      return;
    }

    setStatus("saving");
    try {
      const response = await fetch("/api/opt-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) throw new Error("opt-out failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <RetroLayout>
      <RetroCard title="Opt Out">
        <p className="mt-2 text-xl">
          If you no longer want to receive LoveBomba messages at this
          destination, confirm below.
        </p>
        <div className="mt-4">
          <RetroButton
            onClick={handleOptOut}
            disabled={status === "saving" || status === "done"}
          >
            {status === "saving"
              ? "Saving..."
              : status === "done"
                ? "Opt-out confirmed"
                : "Confirm opt-out"}
          </RetroButton>
        </div>
        {status === "error" && (
          <p className="mt-3 text-lg text-coral-dark">
            We could not process this opt-out token. It may be invalid or expired.
          </p>
        )}
      </RetroCard>
    </RetroLayout>
  );
}
