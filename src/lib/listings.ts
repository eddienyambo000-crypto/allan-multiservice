import { getSupabase } from "./supabase";
import { SEED_LISTINGS } from "./seed";
import type { Listing, ListingFilters, Vertical } from "./types";

const TABLE = "listings";

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

/** List listings matching filters. Falls back to seed data when DB is absent or errors. */
export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      let query = sb.from(TABLE).select("*");
      if (filters.vertical) query = query.eq("vertical", filters.vertical);
      if (filters.type) query = query.eq("listing_type", filters.type);
      if (filters.location) query = query.ilike("location", filters.location);
      if (filters.minPrice != null) query = query.gte("price", filters.minPrice);
      if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice);
      if (filters.bedrooms != null) query = query.gte("bedrooms", filters.bedrooms);
      if (filters.make) query = query.ilike("make", filters.make);
      if (filters.q) query = query.or(`title.ilike.%${filters.q}%,location.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
      if (filters.sort === "price_asc") query = query.order("price", { ascending: true });
      else if (filters.sort === "price_desc") query = query.order("price", { ascending: false });
      else query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length) return data as Listing[];
      // empty DB → show seed so the site never looks broken in demo
    } catch {
      // fall through to seed
    }
  }
  return applyFilters(SEED_LISTINGS, filters);
}

export async function getFeatured(limit = 6): Promise<Listing[]> {
  const all = await getListings({ sort: "newest" });
  const featured = all.filter((l) => l.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from(TABLE).select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (data) return data as Listing;
    } catch {
      /* fall through */
    }
  }
  return SEED_LISTINGS.find((l) => l.slug === slug) ?? null;
}

export async function getRelated(listing: Listing, limit = 3): Promise<Listing[]> {
  const same = await getListings({ vertical: listing.vertical });
  return same.filter((l) => l.slug !== listing.slug).slice(0, limit);
}

export async function getAllSlugs(): Promise<{ slug: string; vertical: Vertical; created_at: string }[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from(TABLE).select("slug,vertical,created_at");
      if (error) throw error;
      if (data && data.length) return data as { slug: string; vertical: Vertical; created_at: string }[];
    } catch {
      /* fall through */
    }
  }
  return SEED_LISTINGS.map((l) => ({ slug: l.slug, vertical: l.vertical, created_at: l.created_at }));
}

export async function getCounts(): Promise<Record<Vertical, number>> {
  const all = await getListings();
  return all.reduce(
    (acc, l) => {
      acc[l.vertical] = (acc[l.vertical] ?? 0) + 1;
      return acc;
    },
    { property: 0, land: 0, car: 0, rental: 0 } as Record<Vertical, number>
  );
}
