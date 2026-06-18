import { getSupabase } from "./supabase";
import type { Inquiry, SellerLead } from "./types";

export interface LeadResult {
  ok: boolean;
  /** true when stored in DB; false means caller should fall back to WhatsApp */
  stored: boolean;
}

export async function submitInquiry(data: Inquiry): Promise<LeadResult> {
  const sb = getSupabase();
  if (!sb) return { ok: true, stored: false };
  try {
    const { error } = await sb.from("inquiries").insert({
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

export async function submitSellerLead(data: SellerLead): Promise<LeadResult> {
  const sb = getSupabase();
  if (!sb) return { ok: true, stored: false };
  try {
    const { error } = await sb.from("seller_leads").insert({
      vertical: data.vertical,
      name: data.name,
      phone: data.phone,
      asset_title: data.asset_title,
      details: data.details || null,
    });
    if (error) throw error;
    return { ok: true, stored: true };
  } catch {
    return { ok: false, stored: false };
  }
}
