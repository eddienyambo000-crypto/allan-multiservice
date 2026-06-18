import Link from "next/link";
import { getFeatured, getCounts } from "@/lib/listings";
import { VERTICALS, SITE, waLink, type VerticalKey } from "@/lib/site";
import ListingCard from "@/components/ListingCard";
import HeroSearch from "@/components/HeroSearch";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { organizationSchema } from "@/lib/schema";
import {
  IconHome, IconKey, IconMap, IconCar, IconShield, IconCheck,
  IconArrow, IconStar, IconWhatsApp,
} from "@/components/icons";

const VERT_ICON: Record<VerticalKey, React.FC<{ className?: string }>> = {
  properties: IconHome,
  rentals: IconKey,
  land: IconMap,
  cars: IconCar,
};

export default async function Home() {
  const [featured, counts] = await Promise.all([getFeatured(6), getCounts()]);

  return (
    <>
      <JsonLd data={organizationSchema()} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 15% 0%, var(--color-sky-soft) 0%, transparent 60%), radial-gradient(50% 45% at 100% 10%, var(--color-pink-soft) 0%, transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(70% 60% at 50% 0%, #000 0%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(70% 60% at 50% 0%, #000 0%, transparent 75%)",
          }}
        />

        <div className="container-x text-center">
          <Reveal>
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-pink)]" />
              Rwanda&apos;s first verified marketplace
            </span>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mx-auto mt-6 max-w-4xl text-balance text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[1.02] text-[var(--color-ink)]">
              Homes, land &amp; cars.
              <br />
              <span className="text-gradient">One trusted place.</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-[var(--color-ink-soft)] sm:text-lg">
              Buy, rent, and sell across Kigali — every listing physically verified.
              No ghost listings, no runaround. Just real deals from {SITE.shortName}.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-10">
              <HeroSearch />
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--color-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <IconShield className="h-4 w-4 text-[var(--color-sky)]" /> Verified listings
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconCheck className="h-4 w-4 text-[var(--color-sky)]" /> Clear titles &amp; papers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconStar className="h-4 w-4 text-[var(--color-sky)]" /> Kinyarwanda · English · French
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="container-x py-8">
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
      <section className="container-x py-16">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Handpicked</p>
            <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-bold">Featured listings</h2>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-sky)] hover:text-[var(--color-sky-hover)]"
          >
            View all <IconArrow className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((l, i) => (
            <Reveal key={l.id} delay={(i % 3) * 70} as="article">
              <ListingCard listing={l} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHY ALLAN / RISK REVERSAL ── */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-surface)] py-20">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Why Allan</p>
            <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-bold">
              The marketplace that removes the risk
            </h2>
            <p className="mt-4 text-[var(--color-ink-soft)]">
              Most listings in Rwanda are guesswork — wrong prices, fake photos, missing
              papers. We fixed that.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 60} as="article">
                <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-sky-soft)] text-[var(--color-sky)]">
                    <IconCheck className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-[var(--color-ink)]">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="container-x py-20">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow">Simple</p>
          <h2 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-bold">How it works</h2>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80} as="article" className="relative">
              <span className="font-[family-name:var(--font-display)] text-5xl font-bold text-[var(--color-sky-soft)]">
                0{i + 1}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-[var(--color-ink)]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SELLER CTA (Hormozi offer) ── */}
      <section className="container-x py-10">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[28px] px-7 py-14 text-center sm:px-14"
            style={{
              background:
                "linear-gradient(115deg, var(--color-sky) 0%, #1466C9 45%, var(--color-pink) 130%)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative">
              <p className="font-[family-name:var(--font-mono)] text-[0.7rem] uppercase tracking-[0.18em] text-white/80">
                For sellers &amp; owners
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl text-balance text-[clamp(1.9rem,4.5vw,3.2rem)] font-bold leading-tight text-white">
                Got a house, plot, or car to sell? We move it.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-white/85">
                List with Allan and reach serious, ready buyers across Kigali. We
                photograph, price, verify, and market it for you — and if we don&apos;t bring
                you a genuine buyer inquiry, we feature it free.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                >
                  List your item <IconArrow className="h-4 w-4" />
                </Link>
                <a
                  href={waLink(`Hi ${SITE.shortName}, I'd like to list something for sale.`)}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <IconWhatsApp className="h-4 w-4" /> WhatsApp us
                </a>
              </div>
            </div>
          </div>
        </Reveal>
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
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-sky)] transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="container-x pb-24">
        <Reveal className="flex flex-col items-center gap-5 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-14 text-center">
          <h2 className="max-w-xl text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold">
            Found something — or want us to find it?
          </h2>
          <p className="max-w-md text-[var(--color-ink-soft)]">
            Talk to the {SITE.shortName} team. We reply to every message, usually within the hour.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sky)] px-7 py-3.5 text-sm font-semibold text-white transition-[transform,background] duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-sky-hover)]"
            >
              Contact us <IconArrow className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-sky)]"
            >
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
  { title: "Papers in order", body: "Titles, ownership, and car logbooks checked upfront — so transfers are fast and clean." },
  { title: "Local experts, 3 languages", body: "We negotiate and guide in Kinyarwanda, English, and French — from first viewing to keys in hand." },
];

const STEPS = [
  { title: "Search & filter", body: "Pick a category, set your area and budget. Share the exact search with one link." },
  { title: "Inquire in one tap", body: "Message us on WhatsApp straight from any listing — pre-filled, no forms to dig through." },
  { title: "We close it with you", body: "Viewings, negotiation, paperwork, transfer. We stay with you until it's done." },
];

const FAQ = [
  { q: "Are the listings real and available?", a: "Yes. Every listing is physically verified by our team and removed the moment it's sold or rented. No ghost listings." },
  { q: "Do you charge buyers to view listings?", a: "No. Browsing and inquiring is free. We're paid on successful deals, so our interest is getting you the right one." },
  { q: "Can I sell my house, land, or car through Allan?", a: "Absolutely — that's a big part of what we do. Head to 'Sell with Allan', tell us what you have, and we handle photos, pricing, verification, and marketing." },
  { q: "Which areas do you cover?", a: "All of Kigali — Kiyovu, Kimihurura, Nyarutarama, Kacyiru, Kicukiro, Gisozi, Remera and more — plus select listings beyond the city." },
  { q: "How fast do you respond?", a: "We reply to WhatsApp and form inquiries fast — usually within the hour during the day." },
];
