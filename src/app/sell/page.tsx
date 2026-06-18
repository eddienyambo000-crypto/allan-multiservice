import type { Metadata } from "next";
import SellForm from "@/components/SellForm";
import Reveal from "@/components/Reveal";
import { IconCheck, IconShield, IconStar } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sell Your House, Land or Car in Kigali",
  description:
    "List your property, land, or car with Allan Multiservice Group. We photograph, price, verify, and market it to ready buyers across Kigali — free to list.",
  alternates: { canonical: "/sell" },
};

const BENEFITS = [
  { t: "We do the work", b: "Professional photos, fair pricing, and verification — handled by our team, not you." },
  { t: "Real, ready buyers", b: "Your listing goes in front of serious buyers already searching on Allan." },
  { t: "Free to list", b: "No upfront cost. We only earn a commission when your item actually sells." },
  { t: "Verified = trusted", b: "Our 'verified' badge makes buyers act faster and offer with confidence." },
];

export default function SellPage() {
  return (
    <div className="relative overflow-hidden pt-28 pb-24 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 40% at 100% 0%, var(--color-pink-soft) 0%, transparent 55%), radial-gradient(45% 35% at 0% 5%, var(--color-sky-soft) 0%, transparent 55%)",
        }}
      />
      <div className="container-x grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-pink)]" /> Sell with Allan
            </span>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-6 text-[clamp(2.2rem,5.5vw,4rem)] font-bold leading-[1.05]">
              Got something to sell? <span className="text-gradient">We move it.</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 max-w-md text-lg text-[var(--color-ink-soft)]">
              List your house, plot, or car with Allan and reach buyers who are ready
              now. And our promise: if we don&apos;t bring you a genuine buyer inquiry,
              we feature your listing free until we do.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <div key={b.t} className="flex gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-4 shadow-[var(--shadow-soft)]">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--color-sky-soft)] text-[var(--color-sky)]">
                    <IconCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{b.t}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-muted)]">{b.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--color-muted)]">
              <span className="inline-flex items-center gap-1.5"><IconShield className="h-4 w-4 text-[var(--color-sky)]" /> Verified marketplace</span>
              <span className="inline-flex items-center gap-1.5"><IconStar className="h-4 w-4 text-[var(--color-sky)]" /> Trusted across Kigali</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:sticky lg:top-24">
          <SellForm />
        </Reveal>
      </div>
    </div>
  );
}
