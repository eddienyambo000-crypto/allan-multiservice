"use client";

import Link from "next/link";
import { useFavorites, useRecent } from "@/lib/favorites";
import type { Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import { IconHeart, IconArrow } from "@/components/icons";

/**
 * Renders the buyer's shortlist + recently-viewed from localStorage.
 * Receives the full listing set from the server and filters client-side.
 */
export default function SavedClient({ listings, rate }: { listings: Listing[]; rate: number }) {
  const { slugs, ready } = useFavorites();
  const recentSlugs = useRecent();
  const bySlug = new Map(listings.map((l) => [l.slug, l]));

  const saved = slugs.map((s) => bySlug.get(s)).filter(Boolean) as Listing[];
  const recent = recentSlugs
    .map((s) => bySlug.get(s))
    .filter((l): l is Listing => Boolean(l) && !slugs.includes(l!.slug))
    .slice(0, 6);

  if (!ready) {
    return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-[var(--radius-card)] bg-[var(--color-surface)]" />)}</div>;
  }

  return (
    <>
      {saved.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((l) => <ListingCard key={l.id} listing={l} usdRate={rate} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-pink-soft)] text-[var(--color-pink)]"><IconHeart className="h-7 w-7" /></span>
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">No saved listings yet</h2>
          <p className="max-w-sm text-sm text-[var(--color-muted)]">Tap the heart on any listing to shortlist it here — handy when you&apos;re comparing options or sharing with family abroad.</p>
          <Link href="/properties" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sky)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
            Browse listings <IconArrow className="h-4 w-4" />
          </Link>
        </div>
      )}

      {recent.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-[var(--color-ink)]">Recently viewed</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((l) => <ListingCard key={l.id} listing={l} usdRate={rate} />)}
          </div>
        </section>
      )}
    </>
  );
}
