import { getBrowserSupabase } from "./supabase";
import type { Listing } from "./types";

const BUCKET = "listings";

function client() {
  const sb = getBrowserSupabase();
  if (!sb) throw new Error("Supabase is not configured. Add env vars to enable the admin panel.");
  return sb;
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

export async function adminListAll(): Promise<Listing[]> {
  const { data, error } = await client().from("listings").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Listing[];
}

export async function adminUpsert(listing: Partial<Listing>): Promise<void> {
  const { error } = await client().from("listings").upsert(listing, { onConflict: "id" });
  if (error) throw error;
}

export async function adminDelete(id: string): Promise<void> {
  const { error } = await client().from("listings").delete().eq("id", id);
  if (error) throw error;
}

/** Upload an image to Storage; returns its public URL. */
export async function adminUploadImage(file: File): Promise<string> {
  const sb = client();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export interface LeadRow {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  handled: boolean;
  // inquiry
  message?: string | null;
  listing_title?: string | null;
  email?: string | null;
  // seller
  vertical?: string;
  asset_title?: string;
  details?: string | null;
  kind: "inquiry" | "seller";
}

export async function adminLeads(): Promise<LeadRow[]> {
  const sb = client();
  const [inq, sell] = await Promise.all([
    sb.from("inquiries").select("*").order("created_at", { ascending: false }),
    sb.from("seller_leads").select("*").order("created_at", { ascending: false }),
  ]);
  if (inq.error) throw inq.error;
  if (sell.error) throw sell.error;
  const a: LeadRow[] = (inq.data ?? []).map((r) => ({ ...r, kind: "inquiry" as const }));
  const b: LeadRow[] = (sell.data ?? []).map((r) => ({ ...r, kind: "seller" as const }));
  return [...a, ...b].sort((x, y) => +new Date(y.created_at) - +new Date(x.created_at));
}

export async function adminMarkLead(kind: "inquiry" | "seller", id: string, handled: boolean): Promise<void> {
  const table = kind === "inquiry" ? "inquiries" : "seller_leads";
  const { error } = await client().from(table).update({ handled }).eq("id", id);
  if (error) throw error;
}
