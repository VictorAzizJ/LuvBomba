import Link from "next/link";
import { RetroButton } from "@/components/RetroButton";
import { RetroCard } from "@/components/RetroCard";
import { RetroLayout } from "@/components/RetroLayout";

export default function ConfirmationPage() {
  return (
    <RetroLayout>
      <RetroCard title="You are all set">
        <p className="mt-3 text-2xl">
          Your LoveBomb is queued for delivery after payment confirmation.
        </p>
        <ul className="mt-3 list-disc pl-5 text-xl">
          <li>We only keep minimal data to deliver the message.</li>
          <li>Recipients get a one-click opt-out link.</li>
          <li>Message content is deleted after the retention window.</li>
        </ul>
        <div className="mt-5">
          <Link href="/compose">
            <RetroButton>Send another</RetroButton>
          </Link>
        </div>
      </RetroCard>
    </RetroLayout>
  );
}
