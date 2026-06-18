import Link from "next/link";
import { getListings } from "@/lib/listings";
import { VERTICAL_BY_DB, waLink, SITE, KIGALI_AREAS } from "@/lib/site";
import type { Vertical } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import Reveal from "@/components/Reveal";
import { IconWhatsApp, IconArrow, IconPin } from "@/components/icons";

/** Resolve a URL area slug (e.g. "kimihurura") back to its display name. */
export function areaFromSlug(slug: string): string | null {
  const norm = slug.toLowerCase();
  return KIGALI_AREAS.find((a) => a.toLowerCase().replace(/\s+/g, "-") === norm) ?? null;
}

export default async function LocationLanding({
  vertical,
  area,
  heading,
  intro,
}: {
  vertical: Vertical;
  area: string;
  heading: string;
  intro: string;
}) {
  const listings = await getListings({ vertical, location: area });
  const meta = VERTICAL_BY_DB[vertical];

  return (
    <div className="container-x pt-28 pb-20 sm:pt-32">
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-muted)]">
        <Link href="/" className="hover:text-[var(--color-sky)]">Home</Link>
        <span>/</span>
        <Link href={meta.href} className="hover:text-[var(--color-sky)]">{meta.short}</Link>
        <span>/</span>
        <span className="text-[var(--color-ink-soft)]">{area}</span>
      </nav>

      <header className="mb-8 max-w-2xl">
        <p className="eyebrow inline-flex items-center gap-1.5">
          <IconPin className="h-3.5 w-3.5" /> {area}, Kigali
        </p>
        <h1 className="mt-2 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight">{heading}</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">{intro}</p>
      </header>

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
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">
            Looking in {area}? We&apos;ll find it for you.
          </h2>
          <p className="max-w-md text-sm text-[var(--color-muted)]">
            We don&apos;t have a live {meta.short.toLowerCase()} listing in {area} this minute — but we get
            new ones every week. Tell us what you want and we&apos;ll alert you first.
          </p>
          <a
            href={waLink(`Hi ${SITE.shortName}, I'm looking for ${meta.short.toLowerCase()} in ${area}, Kigali.`)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            <IconWhatsApp className="h-4 w-4" /> Alert me about {area}
          </a>
        </div>
      )}

      <div className="mt-12">
        <Link href={meta.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-sky)] hover:text-[var(--color-sky-hover)]">
          See all {meta.short.toLowerCase()} across Kigali <IconArrow className="h-4 w-4" />
        </Link>
      </div>

      {/* Nearby areas — internal links for SEO */}
      <div className="mt-12 border-t border-[var(--color-line)] pt-8">
        <p className="eyebrow mb-3">Other areas</p>
        <div className="flex flex-wrap gap-2">
          {KIGALI_AREAS.filter((a) => a !== area).map((a) => (
            <Link
              key={a}
              href={`${meta.href}/kigali/${a.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-full border border-[var(--color-line)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
            >
              {meta.short} in {a}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
