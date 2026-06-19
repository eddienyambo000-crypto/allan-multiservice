import { unstable_cache } from "next/cache";
import { getSupabase } from "./supabase";
import { SEED_LISTINGS } from "./seed";
import { DB } from "./site";
import type { Listing, ListingFilters, Vertical } from "./types";

const TABLE = DB.listings;

/**
 * Fetch the full listing set once and cache it (revalidated every 5 min).
 * All queries below filter this cached array in-memory, so heavy traffic is
 * served from cache/CDN instead of hammering the database — scales to many
 * concurrent users. Falls back to seed data when the DB is absent/empty.
 */
const fetchAllCached = unstable_cache(
  async (): Promise<Listing[]> => {
    const sb = getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.from(TABLE).select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (data && data.length) return data as Listing[];
      } catch {
        /* fall through to seed */
      }
    }
    return SEED_LISTINGS;
  },
  ["all-listings"],
  { revalidate: 60, tags: ["listings"] }
);

function applyFilters(items: Listing[], f: ListingFilters): Listing[] {
  let out = items;
  if (f.vertical) out = out.filter((l) => l.vertical === f.vertical);
  if (f.type) out = out.filter((l) => l.listing_type === f.type);
  if (f.location) out = out.filter((l) => l.location.toLowerCase() === f.location!.toLowerCase());
  if (f.minPrice != null) out = out.filter((l) => l.price >= f.minPrice!);
  if (f.maxPrice != null) out = out.filter((l) => l.price <= f.maxPrice!);
  if (f.bedrooms != null) out = out.filter((l) => (l.bedrooms ?? 0) >= f.bedrooms!);
  if (f.make) out = out.filter((l) => (l.make ?? "").toLowerCase() === f.make!.toLowerCase());
  if (f.q) {
    const q = f.q.toLowerCase();
    out = out.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        (l.make ?? "").toLowerCase().includes(q)
    );
  }
  switch (f.sort) {
    case "price_asc": out = [...out].sort((a, b) => a.price - b.price); break;
    case "price_desc": out = [...out].sort((a, b) => b.price - a.price); break;
    default: out = [...out].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  }
  return out;
}

export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const all = await fetchAllCached();
  return applyFilters(all, filters);
}

export async function getFeatured(limit = 6): Promise<Listing[]> {
  const all = await fetchAllCached();
  const featured = all.filter((l) => l.featured && l.status === "available");
  const pool = featured.length ? featured : all;
  return [...pool].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, limit);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const all = await fetchAllCached();
  return all.find((l) => l.slug === slug) ?? null;
}

export async function getRelated(listing: Listing, limit = 3): Promise<Listing[]> {
  const all = await fetchAllCached();
  return all.filter((l) => l.vertical === listing.vertical && l.slug !== listing.slug).slice(0, limit);
}

export async function getAllSlugs(): Promise<{ slug: string; vertical: Vertical; created_at: string }[]> {
  const all = await fetchAllCached();
  return all.map((l) => ({ slug: l.slug, vertical: l.vertical, created_at: l.created_at }));
}

export async function getCounts(): Promise<Record<Vertical, number>> {
  const all = await fetchAllCached();
  return all.reduce(
    (acc, l) => {
      acc[l.vertical] = (acc[l.vertical] ?? 0) + 1;
      return acc;
    },
    { property: 0, land: 0, car: 0, rental: 0 } as Record<Vertical, number>
  );
}
