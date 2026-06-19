import Link from "next/link";
import { getListings } from "@/lib/listings";
import { getSettings, getRate } from "@/lib/settings";
import { parseFilters, type RawParams } from "@/lib/params";
import { VERTICAL_BY_DB } from "@/lib/site";
import { FEATURED_LOCATIONS } from "@/lib/locations";
import type { Vertical } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import FilterBar from "@/components/FilterBar";
import Reveal from "@/components/Reveal";
import BuyerConciergeForm from "@/components/BuyerConciergeForm";
import { IconArrow } from "@/components/icons";

export default async function ListingsIndex({
  vertical,
  searchParams,
  heading,
  intro,
}: {
  vertical: Vertical;
  searchParams: RawParams;
  heading: string;
  intro: string;
}) {
  const filters = parseFilters(vertical, searchParams);
  const [listings, settings] = await Promise.all([getListings(filters), getSettings()]);
  const rate = await getRate(settings);
  const meta = VERTICAL_BY_DB[vertical];
  const popular = FEATURED_LOCATIONS.slice(0, 10);

  return (
    <div className="container-x pt-28 pb-20 sm:pt-32">
      <nav className="mb-5 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
        <Link href="/" className="hover:text-[var(--color-sky)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-ink-soft)]">{meta.short}</span>
      </nav>

      <header className="mb-8 max-w-2xl">
        <p className="eyebrow">{meta.short} across Rwanda</p>
        <h1 className="mt-2 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight">{heading}</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">{intro}</p>
      </header>

      <FilterBar vertical={vertical} />

      <p className="mb-5 text-sm text-[var(--color-muted)]">
        {listings.length} {listings.length === 1 ? "listing" : "listings"} found · prices in RWF &amp; USD
      </p>

      {listings.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l, i) => (
            <Reveal key={l.id} delay={(i % 3) * 60} as="article">
              <ListingCard listing={l} usdRate={rate} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="grid items-center gap-6 rounded-[var(--radius-card)] border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-ink)]">No matches right now — let&apos;s fix that.</h2>
            <p className="mt-2 max-w-md text-sm text-[var(--color-muted)]">
              Most of the market isn&apos;t online yet. Tell us exactly what you want and we&apos;ll hunt it
              down for you — free.
            </p>
          </div>
          <BuyerConciergeForm />
        </div>
      )}

      {/* Popular searches — internal links for SEO */}
      <div className="mt-14 border-t border-[var(--color-line)] pt-8">
        <p className="eyebrow mb-3">Popular searches</p>
        <div className="flex flex-wrap gap-2">
          {popular.map((l) => (
            <Link
              key={l.slug}
              href={`${meta.href}/location/${l.slug}`}
              className="rounded-full border border-[var(--color-line)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
            >
              {meta.short} in {l.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Alerts band */}
      <Reveal className="mt-12">
        <div className="flex flex-col items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-sky-tint)] px-6 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">Want {meta.short.toLowerCase()} like these the moment they drop?</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Get free new-listing alerts on WhatsApp or email.</p>
          </div>
          <Link href="/#alerts" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-pink)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-pink)] transition-transform duration-200 hover:-translate-y-0.5">
            Get alerts <IconArrow className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
