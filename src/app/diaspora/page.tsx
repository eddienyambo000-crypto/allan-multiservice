import type { Metadata } from "next";
import Link from "next/link";
import { getSettings, usdRate } from "@/lib/settings";
import { SITE, waLink } from "@/lib/site";
import Reveal from "@/components/Reveal";
import AlertsForm from "@/components/AlertsForm";
import TransferTaxCalculator from "@/components/TransferTaxCalculator";
import JsonLd from "@/components/JsonLd";
import { IconGlobe, IconVideo, IconDoc, IconShield, IconCheck, IconArrow, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Buying Property in Rwanda from Abroad — Diaspora Guide",
  description:
    "Buy property, land or a car in Rwanda from the diaspora — without flying in. Power-of-Attorney remote buying, RLMUA title verification, video viewings, transfer-tax calculator, USD pricing. Allan Multiservice Group.",
  alternates: { canonical: "/diaspora" },
};

const STEPS = [
  { icon: <IconVideo className="h-5 w-5" />, t: "1. Shortlist & video-view", b: "Browse verified listings and request live video tours, so you inspect every detail from wherever you are." },
  { icon: <IconShield className="h-5 w-5" />, t: "2. We verify the title", b: "We check the parcel on the RLMUA land portal — owner, zoning, size, and that it's free of any encumbrances." },
  { icon: <IconDoc className="h-5 w-5" />, t: "3. Power of Attorney", b: "Notarise a POA where you live (apostille / Rwandan embassy) so a trusted rep signs on your behalf." },
  { icon: <IconCheck className="h-5 w-5" />, t: "4. Notary & transfer", b: "Sale agreement, notary signing, balance paid, and the Land Registry transfers ownership — often within two weeks." },
];

const FAQ = [
  { q: "Can I buy without coming to Rwanda?", a: "Yes. With a Power of Attorney — notarised in your country and legalised (apostille or via the Rwandan embassy) — a trusted representative signs on your behalf. We coordinate the whole process and keep you updated." },
  { q: "Can foreigners own land in Rwanda?", a: "Citizens can hold freehold. Foreigners typically hold long-term leasehold up to 99 years — secure, transferable, and mortgageable. We show the tenure on every land and property listing." },
  { q: "How do I know a title is genuine?", a: "Always verify on the RLMUA land portal before any deposit: parcel number, registered owner, land-use zone, and absence of encumbrances. We do this verification for you and share the results." },
  { q: "What does transfer cost?", a: "Transfer tax is 0% on the first RWF 10,000,000, then 5% above that. Use the calculator on this page for an estimate; notary and registration fees may apply." },
  { q: "Which currency do I pay in?", a: "Prices are quoted in RWF with a USD equivalent shown everywhere so you always know the cost. We'll advise on the safest payment route for your situation." },
];

export default async function DiasporaPage() {
  const settings = await getSettings();
  const rate = usdRate(settings);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "radial-gradient(120% 120% at 0% 0%, #1AA0F0 0%, #0C8CE0 40%, #0A6FC0 72%, #064E8C 100%)" }} />
        <div className="container-x relative pt-32 pb-16 text-center sm:pt-40 sm:pb-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-white backdrop-blur">
              <IconGlobe className="h-3.5 w-3.5" /> For the Rwandan diaspora
            </span>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-[clamp(2.3rem,6vw,4.5rem)] font-bold leading-[1.04] text-white">
              Buy in Rwanda from anywhere in the world.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-white/85 sm:text-lg">
              Property, land, and cars — bought safely without flying in. We handle viewings, title checks,
              paperwork, and transfer, with every price shown in USD.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href={waLink(`Hi ${SITE.shortName}, I'm in the diaspora and want to buy in Rwanda.`)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] shadow-lg transition-transform hover:-translate-y-0.5">
                <IconWhatsApp className="h-4 w-4 text-[#25D366]" /> Talk to us
              </a>
              <Link href="/properties" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Browse listings <IconArrow className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Steps */}
      <section className="container-x py-20">
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow">How remote buying works</p>
          <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-bold">Four steps, fully handled.</h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 70} as="article">
              <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-sky-soft)] text-[var(--color-sky)]">{s.icon}</span>
                <h3 className="mt-4 text-base font-semibold text-[var(--color-ink)]">{s.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">{s.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Calculator + alerts */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <div className="container-x grid items-start gap-8 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Know your numbers</p>
            <h2 className="mt-2 text-[clamp(1.7rem,3.5vw,2.4rem)] font-bold">Estimate your transfer tax</h2>
            <p className="mt-3 max-w-md text-[var(--color-ink-soft)]">
              Rwanda charges 0% on the first RWF 10M and 5% above. Slide to your budget to see the tax and total — in RWF and USD.
            </p>
            <div className="mt-6"><TransferTaxCalculator rate={rate} /></div>
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow">Stay ahead</p>
            <h2 className="mt-2 text-[clamp(1.7rem,3.5vw,2.4rem)] font-bold">Get matched listings by WhatsApp or email</h2>
            <p className="mt-3 max-w-md text-[var(--color-ink-soft)]">
              Tell us what you&apos;re after and we&apos;ll send verified matches the moment they land — wherever you are in the world.
            </p>
            <div className="mt-6"><AlertsForm /></div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x py-20">
        <Reveal className="mb-10 text-center">
          <p className="eyebrow">Diaspora FAQ</p>
          <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-bold">Buying from abroad — answered</h2>
        </Reveal>
        <div className="mx-auto max-w-3xl divide-y divide-[var(--color-line)] rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-6 py-5 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between gap-4 text-left font-semibold text-[var(--color-ink)] marker:content-['']">
                {f.q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-sky)] transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
