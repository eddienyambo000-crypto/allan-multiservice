import Link from "next/link";
import { getListings } from "@/lib/listings";
import { parseFilters, type RawParams } from "@/lib/params";
import { VERTICAL_BY_DB, waLink, SITE } from "@/lib/site";
import type { Vertical } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import FilterBar from "@/components/FilterBar";
import Reveal from "@/components/Reveal";
import { IconWhatsApp, IconArrow } from "@/components/icons";

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
  const listings = await getListings(filters);
  const meta = VERTICAL_BY_DB[vertical];

  return (
    <div className="container-x pt-28 pb-20 sm:pt-32">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
        <Link href="/" className="hover:text-[var(--color-sky)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-ink-soft)]">{meta.short}</span>
      </nav>

      <header className="mb-8 max-w-2xl">
        <p className="eyebrow">{meta.short} in Kigali</p>
        <h1 className="mt-2 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight">{heading}</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">{intro}</p>
      </header>

      <FilterBar vertical={vertical} />

      <p className="mb-5 text-sm text-[var(--color-muted)]">
        {listings.length} {listings.length === 1 ? "listing" : "listings"} found
      </p>

      {listings.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l, i) => (
            <Reveal key={l.id} delay={(i % 3) * 60} as="article">
              <ListingCard listing={l} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">No matches — yet</h2>
          <p className="max-w-md text-sm text-[var(--color-muted)]">
            Nothing fits those filters right now. Tell us exactly what you want and we&apos;ll
            hunt it down for you — we get new listings every week.
          </p>
          <a
            href={waLink(`Hi ${SITE.shortName}, I'm looking for ${meta.short.toLowerCase()} in Kigali. Can you help me find it?`)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            <IconWhatsApp className="h-4 w-4" /> Tell us what you need
          </a>
        </div>
      )}

      {/* Seller nudge */}
      <Reveal className="mt-16">
        <div className="flex flex-col items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-sky-tint)] px-6 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">
              Selling {meta.short === "Land" ? "land" : meta.short.toLowerCase()}? List it with Allan.
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              We photograph, price, verify, and put it in front of ready buyers.
            </p>
          </div>
          <Link
            href="/sell"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-pink)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-pink)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Sell with Allan <IconArrow className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
