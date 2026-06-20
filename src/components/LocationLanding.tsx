import Link from "next/link";
import { getListings } from "@/lib/listings";
import { getSettings, getRate } from "@/lib/settings";
import { VERTICAL_BY_DB, SITE } from "@/lib/site";
import { FEATURED_LOCATIONS, type RwLocation } from "@/lib/locations";
import type { Vertical } from "@/lib/types";
import ListingGrid from "@/components/ListingGrid";
import BuyerConciergeForm from "@/components/BuyerConciergeForm";
import { IconArrow, IconPin } from "@/components/icons";

export default async function LocationLanding({
  vertical,
  location,
  heading,
  intro,
}: {
  vertical: Vertical;
  location: RwLocation;
  heading: string;
  intro: string;
}) {
  const [listings, settings] = await Promise.all([
    getListings({ vertical, location: location.name }),
    getSettings(),
  ]);
  const rate = await getRate(settings);
  const meta = VERTICAL_BY_DB[vertical];
  const others = FEATURED_LOCATIONS.filter((l) => l.slug !== location.slug).slice(0, 12);

  return (
    <div className="container-x pt-28 pb-20 sm:pt-32">
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-muted)]">
        <Link href="/" className="hover:text-[var(--color-sky)]">Home</Link>
        <span>/</span>
        <Link href={meta.href} className="hover:text-[var(--color-sky)]">{meta.short}</Link>
        <span>/</span>
        <span className="text-[var(--color-ink-soft)]">{location.name}</span>
      </nav>

      <header className="mb-8 max-w-2xl">
        <p className="eyebrow inline-flex items-center gap-1.5"><IconPin className="h-3.5 w-3.5" /> {location.region}</p>
        <h1 className="mt-2 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight">{heading}</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">{intro}</p>
      </header>

      {listings.length > 0 ? (
        <ListingGrid listings={listings} usdRate={rate} />
      ) : (
        <div className="grid items-center gap-6 rounded-[var(--radius-card)] border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-ink)]">Looking in {location.name}? We&apos;ll find it.</h2>
            <p className="mt-2 max-w-md text-sm text-[var(--color-muted)]">
              We don&apos;t have a live {meta.short.toLowerCase()} listing in {location.name} this minute — but we get new ones every week and can hunt yours down. Tell us what you want.
            </p>
          </div>
          <BuyerConciergeForm />
        </div>
      )}

      <div className="mt-12">
        <Link href={meta.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-sky)] hover:text-[var(--color-sky-hover)]">
          See all {meta.short.toLowerCase()} across Rwanda <IconArrow className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 border-t border-[var(--color-line)] pt-8">
        <p className="eyebrow mb-3">Other locations</p>
        <div className="flex flex-wrap gap-2">
          {others.map((l) => (
            <Link
              key={l.slug}
              href={`${meta.href}/location/${l.slug}`}
              className="rounded-full border border-[var(--color-line)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
            >
              {meta.short} in {l.name}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-xs text-[var(--color-muted)]">{SITE.name} covers all of Rwanda — Kigali, {others.slice(0, 5).map((l) => l.name).join(", ")} and more.</p>
      </div>
    </div>
  );
}
