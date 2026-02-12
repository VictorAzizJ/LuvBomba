import Link from "next/link";
import { HeartAnimation } from "@/components/HeartAnimation";
import { RetroButton } from "@/components/RetroButton";
import { RetroCard } from "@/components/RetroCard";
import { RetroLayout } from "@/components/RetroLayout";

export default function HomePage() {
  return (
    <RetroLayout>
      <RetroCard title="Welcome" className="relative overflow-hidden">
        <HeartAnimation />
        <h2 className="font-retro text-base md:text-lg">LuvBomba</h2>
        <p className="mt-3 text-2xl leading-tight md:text-3xl">
          Anonymous or semi-anonymous messages, delivered right on time.
        </p>
        <p className="mt-3 text-xl">
          Pay once. No inbox account needed for recipients. One-click opt out in
          every message.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/compose">
            <RetroButton>Compose a Message</RetroButton>
          </Link>
          <Link href="/how-it-works">
            <RetroButton className="bg-mint">How it works</RetroButton>
          </Link>
        </div>
      </RetroCard>
    </RetroLayout>
  );
}
