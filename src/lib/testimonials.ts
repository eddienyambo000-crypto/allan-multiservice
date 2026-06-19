import { unstable_cache } from "next/cache";
import { getSupabase } from "./supabase";
import { DB } from "./site";
import type { Testimonial } from "./types";

/** Public: approved reviews for the homepage. Cached; empty when none/no DB. */
export const getApprovedTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    const sb = getSupabase();
    if (!sb) return [];
    try {
      const { data, error } = await sb
        .from(DB.testimonials)
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(9);
      if (error) throw error;
      return (data ?? []) as Testimonial[];
    } catch {
      return [];
    }
  },
  ["testimonials"],
  { revalidate: 120, tags: ["testimonials", "listings"] }
);

/** Public: submit a review (stored unapproved until the owner approves it). */
export async function submitTestimonial(input: { name: string; role?: string; quote: string; rating?: number }) {
  const sb = getSupabase();
  if (!sb) return { ok: true, stored: false };
  try {
    const { error } = await sb.from(DB.testimonials).insert({
      name: input.name,
      role: input.role || null,
      quote: input.quote,
      rating: input.rating ?? 5,
      approved: false,
    });
    if (error) throw error;
    return { ok: true, stored: true };
  } catch {
    return { ok: false, stored: false };
  }
}
