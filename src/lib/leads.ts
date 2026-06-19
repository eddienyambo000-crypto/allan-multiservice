import { getSupabase } from "./supabase";
import { DB } from "./site";
import type { Inquiry, Alert } from "./types";

export interface LeadResult {
  ok: boolean;
  /** true when stored in DB; false means caller should fall back to WhatsApp */
  stored: boolean;
}

export async function submitInquiry(data: Inquiry): Promise<LeadResult> {
  const sb = getSupabase();
  if (!sb) return { ok: true, stored: false };
  try {
    const { error } = await sb.from(DB.inquiries).insert({
      kind: data.kind ?? "inquiry",
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      message: data.message || null,
      listing_id: data.listing_id || null,
      listing_title: data.listing_title || null,
    });
    if (error) throw error;
    return { ok: true, stored: true };
  } catch {
    return { ok: false, stored: false };
  }
}

export async function submitAlert(data: Alert): Promise<LeadResult> {
  const sb = getSupabase();
  if (!sb) return { ok: true, stored: false };
  try {
    const { error } = await sb.from(DB.alerts).insert({
      channel: data.channel,
      contact: data.contact,
      vertical: data.vertical || null,
      location: data.location || null,
      max_price: data.max_price || null,
    });
    if (error) throw error;
    return { ok: true, stored: true };
  } catch {
    return { ok: false, stored: false };
  }
}
