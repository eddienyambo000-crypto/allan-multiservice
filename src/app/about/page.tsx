import type { Metadata } from "next";
import Link from "next/link";
import { SITE, VERTICALS } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { IconShield, IconCheck, IconStar, IconArrow } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Allan Multiservice Group",
  description:
    "Allan Multiservice Group is Rwanda's first verified marketplace for property, land, and cars — built to remove the risk from buying, renting, and selling in Kigali.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { icon: <IconShield className="h-5 w-5" />, t: "Verification first", b: "We inspect before we list. Every property, plot, and car is physically checked by our team." },
  { icon: <IconCheck className="h-5 w-5" />, t: "Honest pricing", b: "Real prices, no bait. What you see is what the deal actually is." },
  { icon: <IconStar className="h-5 w-5" />, t: "We stay till it's done", b: "From first viewing to transfer, we guide both sides through to the finish." },
];

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 sm:pt-32">
      <section className="container-x max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow">About us</p>
          <h1 className="mt-3 text-[clamp(2.2rem,5.5vw,3.8rem)] font-bold leading-[1.05]">
            One trusted place for Rwanda&apos;s biggest decisions.
          </h1>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-5 text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Buying a home, securing land, or choosing a car are some of the biggest
            decisions a family makes — yet in Rwanda they&apos;ve always meant guesswork,
            ghost listings, and wrong prices. {SITE.name} was built to change that:
            one verified marketplace where every listing is real, every price is honest,
            and every deal has someone in your corner.
          </p>
        </Reveal>
      </section>

      <section className="container-x mt-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 70} as="article">
              <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-sky-soft)] text-[var(--color-sky)]">{v.icon}</span>
                <h2 className="mt-4 text-lg font-semibold text-[var(--color-ink)]">{v.t}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">{v.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x mt-16">
        <Reveal>
          <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-center">
            <h2 className="text-xl font-bold text-[var(--color-ink)]">What we cover</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {VERTICALS.map((v) => (
                <Link
                  key={v.key}
                  href={v.href}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
                >
                  {v.label} <IconArrow className="h-4 w-4 text-[var(--color-sky)]" />
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
