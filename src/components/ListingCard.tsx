import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/lib/types";
import { VERTICAL_BY_DB } from "@/lib/site";
import { specChips, STATUS_LABEL } from "@/lib/format";
import { DEFAULT_USD_RATE } from "@/lib/money";
import { cld } from "@/lib/img";
import { IconPin, IconVideo } from "@/components/icons";
import FavoriteButton from "@/components/FavoriteButton";
import PriceTag from "@/components/PriceTag";

const badgeStyle: Record<string, string> = {
  property: "bg-[var(--color-sky)] text-white",
  rental: "bg-[var(--color-ink)] text-white",
  land: "bg-[#1FA971] text-white",
  car: "bg-[var(--color-pink)] text-white",
};

export default function ListingCard({ listing, usdRate = DEFAULT_USD_RATE }: { listing: Listing; usdRate?: number }) {
  const meta = VERTICAL_BY_DB[listing.vertical];
  const href = `${meta.href}/${listing.slug}`;
  const chips = specChips(listing);
  const sold = listing.status !== "available";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-[color-mix(in_srgb,var(--color-sky)_45%,transparent)] hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface)]">
        <Link href={href} className="block h-full w-full" aria-label={listing.title}>
          {listing.images[0] ? (
            <Image
              src={cld(listing.images[0], 800)}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-[var(--color-muted)]">No image</div>
          )}
        </Link>
        <span
          className={`pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 font-[family-name:var(--font-mono)] text-[0.62rem] font-medium uppercase tracking-wider ${badgeStyle[listing.vertical]}`}
        >
          {listing.listing_type === "rent" ? "For Rent" : meta.short === "Land" ? "Land" : "For Sale"}
        </span>
        {listing.video_url && (
          <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[0.6rem] font-semibold text-white backdrop-blur">
            <IconVideo className="h-3 w-3" /> Video
          </span>
        )}
        <FavoriteButton slug={listing.slug} className="absolute right-3 top-3" />
        {sold && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/55 font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-widest text-white">
            {STATUS_LABEL[listing.status]}
          </div>
        )}
      </div>

      <Link href={href} className="flex flex-1 flex-col p-5">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-snug text-[var(--color-ink)]">
          {listing.title}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
          <IconPin className="h-3.5 w-3.5 text-[var(--color-sky)]" />
          {listing.location}, {listing.district}
        </p>

        <div className="mt-3">
          <PriceTag listing={listing} rate={usdRate} />
        </div>

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[var(--color-line)] pt-4 text-xs text-[var(--color-ink-soft)]">
            {chips.map((c) => (
              <span key={c.label} className="flex items-center gap-1">
                <span className="text-[var(--color-muted)]">{c.label}:</span>
                <span className="font-semibold">{c.value}</span>
              </span>
            ))}
          </div>
        )}
      </Link>
    </div>
  );
}
