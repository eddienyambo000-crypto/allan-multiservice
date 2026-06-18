import type { ListingFilters, Vertical } from "./types";

export type RawParams = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/** Parse URL search params into typed listing filters. */
export function parseFilters(vertical: Vertical, raw: RawParams): ListingFilters {
  const num = (k: string) => {
    const v = one(raw[k]);
    const n = v ? Number(v) : NaN;
    return Number.isFinite(n) ? n : undefined;
  };
  const sortRaw = one(raw.sort);
  const sort =
    sortRaw === "price_asc" || sortRaw === "price_desc" || sortRaw === "newest"
      ? sortRaw
      : undefined;

  return {
    vertical,
    location: one(raw.location) || undefined,
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    bedrooms: num("bedrooms"),
    make: one(raw.make) || undefined,
    q: one(raw.q) || undefined,
    sort,
  };
}
