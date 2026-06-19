import Link from "next/link";
import { getFeatured, getCounts } from "@/lib/listings";
import { getSettings, usdRate } from "@/lib/settings";
import { VERTICALS, SITE, type VerticalKey } from "@/lib/site";
import ListingCard from "@/components/ListingCard";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import AlertsForm from "@/components/AlertsForm";
import BuyerConciergeForm from "@/components/BuyerConciergeForm";
import { organizationSchema } from "@/lib/schema";
import {
  IconHome, IconKey, IconMap, IconCar, IconCheck,
  IconArrow, IconGlobe, IconStar,
} from "@/components/icons";

// Regenerate at most once a minute so new listings/settings surface even
// without an explicit revalidation ping.
export const revalidate = 60;

const VERT_ICON: Record<VerticalKey, React.FC<{ className?: string }>> = {
  properties: IconHome,
  rentals: IconKey,
  land: IconMap,
  cars: IconCar,
};

export default async function Home() {
  const [featured, counts, settings] = await Promise.all([getFeatured(6), getCounts(), getSettings()]);
  const rate = usdRate(settings);

  return (
    <>
      <JsonLd data={organizationSchema()} />

      <Hero settings={settings} />

      {/* ── CATEGORIES ── */}
      <section className="container-x -mt-10 relative z-10 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VERTICALS.map((v, i) => {
            const Icon = VERT_ICON[v.key];
            return (
              <Reveal key={v.key} delay={i * 60} as="article">
                <Link
                  href={v.href}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-[color-mix(in_srgb,var(--color-sky)_45%,transparent)] hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--color-sky-soft)] text-[var(--color-sky)] transition-colors group-hover:bg-[var(--color-sky)] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[var(--color-ink)]">{v.label}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-[var(--color-muted)]">{v.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-sky)]">
                    Browse {counts[v.vertical] ?? 0}+ listings
                    <IconArrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="container-x py-14">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Handpicked</p>
            <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-bold">Featured listings</h2>
          </div>
          <Link href="/properties" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-sky)] hover:text-[var(--color-sky-hover)]">
            View all <IconArrow className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((l, i) => (
            <Reveal key={l.id} delay={(i % 3) * 70} as="article">
              <ListingCard listing={l} usdRate={rate} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHY ALLAN / RISK REVERSAL ── */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Why Allan</p>
            <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-bold">The marketplace that removes the risk</h2>
            <p className="mt-4 text-[var(--color-ink-soft)]">
              Most listings in Rwanda are guesswork — wrong prices, fake photos, missing papers. We fixed that.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 60} as="article">
                <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-sky-soft)] text-[var(--color-sky)]"><IconCheck className="h-5 w-5" /></span>
                  <h3 className="mt-4 text-base font-semibold text-[var(--color-ink)]">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIASPORA BAND ── */}
      <section className="container-x py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-white shadow-[var(--shadow-soft)]">
            <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="eyebrow inline-flex items-center gap-1.5"><IconGlobe className="h-4 w-4" /> For the diaspora</p>
                <h2 className="mt-3 text-[clamp(1.7rem,3.5vw,2.6rem)] font-bold leading-tight">Buying from abroad? We make it simple.</h2>
                <p className="mt-4 max-w-md text-[var(--color-ink-soft)]">
                  Buy property, land, or a car in Rwanda without flying in. We handle Power-of-Attorney,
                  title verification on the RLMUA portal, video viewings, and the full transfer — with
                  prices shown in USD so you always know what you&apos;re paying.
                </p>
                <Link href="/diaspora" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-sky)] px-6 py-3.5 text-sm font-semibold text-white transition-[transform,background] duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-sky-hover)]">
                  See how it works <IconArrow className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-3">
                {DIASPORA_POINTS.map((p) => (
                  <div key={p} className="flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-sky-tint)] px-4 py-3 text-sm font-medium text-[var(--color-ink)]">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-sky)] text-white"><IconCheck className="h-4 w-4" /></span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── ALERTS (lead magnet) ── */}
      <section id="alerts" className="scroll-mt-24 border-y border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">Be first</p>
            <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight">Get new listings before everyone else.</h2>
            <p className="mt-4 max-w-md text-[var(--color-ink-soft)]">
              The best homes, plots, and cars go fast — often before they hit the public feed. Tell us what
              you want and we&apos;ll alert you the moment a match drops. Free, no spam.
            </p>
          </Reveal>
          <Reveal delay={100}><AlertsForm /></Reveal>
        </div>
      </section>

      {/* ── BUYER CONCIERGE ── */}
      <section className="container-x py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <p className="eyebrow">Can&apos;t find it?</p>
            <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight">Tell us what you want. <span className="text-gradient">We hunt it down — free.</span></h2>
            <p className="mt-4 max-w-md text-[var(--color-ink-soft)]">
              Not on the site yet? That&apos;s most of the market. Describe your dream home, plot, or car and
              our team works our network across Rwanda to find it — at no cost to you.
            </p>
            <ul className="mt-6 flex flex-col gap-2.5">
              {CONCIERGE_POINTS.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-[var(--color-ink-soft)]">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-sky-soft)] text-[var(--color-sky)]"><IconCheck className="h-3 w-3" /></span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}><BuyerConciergeForm /></Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <div className="container-x">
          <Reveal className="mb-10 text-center">
            <p className="eyebrow">Trusted by buyers</p>
            <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-bold">What people say</h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 70} as="article">
                <figure className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex gap-0.5 text-[var(--color-pink)]">
                    {Array.from({ length: 5 }).map((_, k) => <IconStar key={k} className="h-4 w-4" fill="currentColor" />)}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-ink-soft)]">“{t.quote}”</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-sky-soft)] font-semibold text-[var(--color-sky)]">{t.name[0]}</span>
                    <span>
                      <span className="block text-sm font-semibold text-[var(--color-ink)]">{t.name}</span>
                      <span className="block text-xs text-[var(--color-muted)]">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="container-x py-20">
        <Reveal className="mb-10 text-center">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-bold">Good to know</h2>
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

      {/* ── FINAL CTA ── */}
      <section className="container-x pb-24">
        <Reveal className="flex flex-col items-center gap-5 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-14 text-center">
          <h2 className="max-w-xl text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold">Ready to find your place in Rwanda?</h2>
          <p className="max-w-md text-[var(--color-ink-soft)]">Talk to the {SITE.shortName} team. We reply to every message, usually within the hour.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sky)] px-7 py-3.5 text-sm font-semibold text-white transition-[transform,background] duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-sky-hover)]">
              Contact us <IconArrow className="h-4 w-4" />
            </Link>
            <a href={`tel:${SITE.phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-sky)]">
              Call {SITE.phoneDisplay}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

const WHY = [
  { title: "Physically verified", body: "Our team visits and inspects every property, plot, and car before it goes live. What you see is what's there." },
  { title: "No ghost listings", body: "If it's on Allan, it's available and the price is real. We remove anything that sells or rents the same day." },
  { title: "Papers in order", body: "Titles, leasehold terms, and car logbooks checked upfront — so transfers are fast and clean." },
  { title: "Local experts, 3 languages", body: "We negotiate and guide in Kinyarwanda, English, and French — from first viewing to keys in hand." },
];

const CONCIERGE_POINTS = [
  "No fee — we're paid by sellers on a closed deal",
  "Real matches, not random links",
  "We negotiate and verify before you commit",
];

const DIASPORA_POINTS = [
  "Buy remotely with Power-of-Attorney",
  "Title verified on the RLMUA land portal",
  "Live video viewings before you commit",
  "Every price shown in RWF and USD",
];

const TESTIMONIALS = [
  { name: "Diane U.", role: "Bought a home in Kibagabaga", quote: "I was in Belgium the whole time. They sent videos, verified the title, and handled the transfer. I got the keys on my first trip back." },
  { name: "Jean-Paul N.", role: "Bought land in Bugesera", quote: "Clear papers, fair price, no games. The plot was exactly what the photos showed — rare in this market." },
  { name: "Aline K.", role: "Rented in Kimihurura", quote: "Found a furnished apartment in two days over WhatsApp. No agent runaround, no fake listings." },
];

const FAQ = [
  { q: "Are the listings real and available?", a: "Yes. Every listing is physically verified by our team and removed the moment it's sold or rented. No ghost listings." },
  { q: "Do you charge buyers anything?", a: "No. Browsing, inquiring, alerts, and our 'find it for me' concierge are all free. We're paid by sellers on a closed deal." },
  { q: "Can I buy from abroad?", a: "Absolutely. Through Power-of-Attorney you can buy property, land, or a car without flying in. We arrange video viewings, verify the title on the RLMUA portal, and handle the transfer. See our 'Buying from Abroad' guide." },
  { q: "Can foreigners own land in Rwanda?", a: "Foreigners typically hold long-term leasehold (up to 99 years) — secure, transferable, and mortgageable — while citizens can hold freehold. We show the tenure on every land and property listing." },
  { q: "Which areas do you cover?", a: "All of Rwanda — every Kigali neighbourhood plus districts and towns like Kamonyi, Musanze, Rubavu, Huye, Nyagatare and more." },
];
