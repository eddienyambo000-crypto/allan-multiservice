import { getBrowserSupabase } from "./supabase";
import { DB, BUCKET } from "./site";
import { cloudinaryConfigured, uploadToCloudinary } from "./cloudinary";
import type { Listing, SiteSettings, Testimonial } from "./types";

function client() {
  const sb = getBrowserSupabase();
  if (!sb) throw new Error("Supabase is not configured. Add env vars to enable the admin panel.");
  return sb;
}

/** Ask the server to refresh public caches so changes appear on the site now.
 *  Sends the admin's access token so the endpoint can reject anonymous callers. */
export async function triggerRevalidate(): Promise<void> {
  try {
    const sb = getBrowserSupabase();
    const token = sb ? (await sb.auth.getSession()).data.session?.access_token : null;
    await fetch("/api/revalidate", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch {
    /* non-fatal — time-based cache will catch up anyway */
  }
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);
}

/* ── Listings ── */
export async function adminListAll(): Promise<Listing[]> {
  // Includes soft-deleted rows (admin RLS allows it) so the Trash works.
  const { data, error } = await client().from(DB.listings).select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Listing[];
}

/** Ensure the slug is unique by appending -2, -3, … if needed. */
async function uniqueSlug(base: string, currentId?: string): Promise<string> {
  const sb = client();
  const slug = base || "listing";
  for (let n = 1; n < 50; n++) {
    const candidate = n === 1 ? slug : `${slug}-${n}`;
    const { data, error } = await sb.from(DB.listings).select("id").eq("slug", candidate).maybeSingle();
    if (error) throw error;
    if (!data || data.id === currentId) return candidate;
  }
  return `${slug}-${Date.now()}`;
}

export async function adminUpsert(listing: Partial<Listing>): Promise<void> {
  const payload = { ...listing, updated_at: new Date().toISOString() };
  if (payload.slug) payload.slug = await uniqueSlug(payload.slug, payload.id);
  const { error } = await client().from(DB.listings).upsert(payload, { onConflict: "id" });
  if (error) throw error;
}

/** Soft delete — moves to Trash (recoverable), not gone forever. */
export async function adminDelete(id: string): Promise<void> {
  const { error } = await client().from(DB.listings).update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

export async function adminRestore(id: string): Promise<void> {
  const { error } = await client().from(DB.listings).update({ deleted_at: null }).eq("id", id);
  if (error) throw error;
}

/** Permanent delete — only from Trash, with confirmation in the UI. */
export async function adminHardDelete(id: string): Promise<void> {
  const { error } = await client().from(DB.listings).delete().eq("id", id);
  if (error) throw error;
}

/**
 * Upload an image/video and return its public URL.
 * Prefers Cloudinary (free ~25 GB + CDN) when configured; otherwise falls
 * back to the Supabase Storage bucket — so it works either way.
 */
export async function adminUploadImage(file: File, bucket: string = BUCKET.media): Promise<string> {
  if (cloudinaryConfigured) return uploadToCloudinary(file);
  const sb = client();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw error;
  return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/* ── Settings ── */
export async function adminGetSettings(): Promise<Partial<SiteSettings>> {
  const { data, error } = await client().from(DB.settings).select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return (data ?? {}) as Partial<SiteSettings>;
}

export async function adminSaveSettings(patch: Partial<SiteSettings>): Promise<void> {
  const { error } = await client().from(DB.settings).upsert({ id: 1, ...patch, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/* ── Leads (inquiries + alerts) ── */
export interface LeadRow {
  id: string;
  created_at: string;
  handled: boolean;
  kind: "inquiry" | "video_tour" | "concierge" | "alert";
  // inquiry
  name?: string;
  phone?: string;
  email?: string | null;
  message?: string | null;
  listing_title?: string | null;
  // alert
  channel?: string;
  contact?: string;
  vertical?: string | null;
  location?: string | null;
  max_price?: number | null;
}

export async function adminLeads(): Promise<LeadRow[]> {
  const sb = client();
  const [inq, alerts] = await Promise.all([
    sb.from(DB.inquiries).select("*").order("created_at", { ascending: false }),
    sb.from(DB.alerts).select("*").order("created_at", { ascending: false }),
  ]);
  if (inq.error) throw inq.error;
  if (alerts.error) throw alerts.error;
  const a: LeadRow[] = (inq.data ?? []).map((r) => ({ ...r, kind: (r.kind ?? "inquiry") as LeadRow["kind"] }));
  const b: LeadRow[] = (alerts.data ?? []).map((r) => ({ ...r, kind: "alert" as const }));
  return [...a, ...b].sort((x, y) => +new Date(y.created_at) - +new Date(x.created_at));
}

export async function adminMarkLead(kind: LeadRow["kind"], id: string, handled: boolean): Promise<void> {
  const table = kind === "alert" ? DB.alerts : DB.inquiries;
  const { error } = await client().from(table).update({ handled }).eq("id", id);
  if (error) throw error;
}

/* ── Testimonials ── */
export async function adminTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await client().from(DB.testimonials).select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

export async function adminSetTestimonialApproved(id: string, approved: boolean): Promise<void> {
  const { error } = await client().from(DB.testimonials).update({ approved }).eq("id", id);
  if (error) throw error;
}

export async function adminDeleteTestimonial(id: string): Promise<void> {
  const { error } = await client().from(DB.testimonials).delete().eq("id", id);
  if (error) throw error;
}

export async function adminAddTestimonial(t: { name: string; role?: string; quote: string; rating?: number }): Promise<void> {
  const { error } = await client().from(DB.testimonials).insert({
    name: t.name, role: t.role || null, quote: t.quote, rating: t.rating ?? 5, approved: true,
  });
  if (error) throw error;
}
