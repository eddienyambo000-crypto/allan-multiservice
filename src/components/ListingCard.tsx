import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/lib/types";
import { VERTICAL_BY_DB } from "@/lib/site";
import { specChips, STATUS_LABEL } from "@/lib/format";
import { IconPin } from "@/components/icons";

const badgeStyle: Record<string, string> = {
  property: "bg-[var(--color-sky)] text-white",
  rental: "bg-[var(--color-ink)] text-white",
  land: "bg-[#1FA971] text-white",
  car: "bg-[var(--color-pink)] text-white",
};

export default function ListingCard({ listing }: { listing: Listing }) {
  const meta = VERTICAL_BY_DB[listing.vertical];
  const href = `${meta.href}/${listing.slug}`;
  const chips = specChips(listing);
  const sold = listing.status !== "available";

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-[color-mix(in_srgb,var(--color-sky)_45%,transparent)] hover:shadow-[var(--shadow-lift)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-sky)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface)]">
        {listing.images[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-[var(--color-muted)]">No image</div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 font-[family-name:var(--font-mono)] text-[0.62rem] font-medium uppercase tracking-wider ${badgeStyle[listing.vertical]}`}
        >
          {listing.listing_type === "rent" ? "For Rent" : meta.short === "Land" ? "Land" : "For Sale"}
        </span>
        {sold && (
          <div className="absolute inset-0 grid place-items-center bg-black/55 font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-widest text-white">
            {STATUS_LABEL[listing.status]}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-snug text-[var(--color-ink)]">
          {listing.title}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
          <IconPin className="h-3.5 w-3.5 text-[var(--color-sky)]" />
          {listing.location}, {listing.district}
        </p>

        <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-sky)]">
          {listing.price_label}
        </p>

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
      </div>
    </Link>
  );
}
