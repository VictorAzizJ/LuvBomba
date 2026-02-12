import { MessageForm } from "@/components/MessageForm";
import { RetroCard } from "@/components/RetroCard";
import { RetroLayout } from "@/components/RetroLayout";

export default function ComposePage() {
  return (
    <RetroLayout>
      <RetroCard title="Compose LoveBomb">
        <p className="mb-4 text-xl">Send a message that arrives softly, later.</p>
        <MessageForm />
      </RetroCard>
    </RetroLayout>
  );
}
