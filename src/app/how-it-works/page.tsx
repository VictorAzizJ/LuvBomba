import Link from "next/link";
import { RetroButton } from "@/components/RetroButton";
import { RetroCard } from "@/components/RetroCard";
import { RetroLayout } from "@/components/RetroLayout";

export default function HowItWorksPage() {
  return (
    <RetroLayout>
      <RetroCard title="How LuvBomba Works">
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-xl">
          <li>Compose your message, choose SMS or email, then pick delivery time.</li>
          <li>Pay with Stripe Checkout to schedule delivery.</li>
          <li>When time arrives, we deliver through Twilio or Resend.</li>
          <li>Every message includes a one-click opt-out link.</li>
          <li>We remove sensitive content after the retention window.</li>
        </ol>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/compose">
            <RetroButton>Start composing</RetroButton>
          </Link>
          <Link href="/">
            <RetroButton className="bg-mint">Back home</RetroButton>
          </Link>
        </div>
      </RetroCard>
    </RetroLayout>
  );
}
