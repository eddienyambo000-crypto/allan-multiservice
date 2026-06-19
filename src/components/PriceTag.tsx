import type { Listing } from "@/lib/types";
import { compactUSD, formatUSD, DEFAULT_USD_RATE } from "@/lib/money";

/** RWF price (from the listing) with a USD equivalent for diaspora buyers. */
export default function PriceTag({
  listing,
  rate = DEFAULT_USD_RATE,
  size = "card",
}: {
  listing: Pick<Listing, "price" | "price_label" | "listing_type">;
  rate?: number;
  size?: "card" | "detail";
}) {
  const perMonth = listing.listing_type === "rent";
  const usd = size === "detail" ? formatUSD(listing.price, rate) : compactUSD(listing.price, rate);

  if (size === "detail") {
    return (
      <span className="inline-flex flex-wrap items-baseline gap-x-2">
        <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-sky)]">
          {listing.price_label}
        </span>
        <span className="text-sm font-medium text-[var(--color-muted)]">≈ {usd}{perMonth ? " /mo" : ""}</span>
      </span>
    );
  }

  return (
    <span className="flex flex-wrap items-baseline gap-x-1.5">
      <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-sky)]">
        {listing.price_label}
      </span>
      <span className="text-xs font-medium text-[var(--color-muted)]">≈ {usd}</span>
    </span>
  );
}
