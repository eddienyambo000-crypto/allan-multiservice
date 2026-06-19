import { getSupabase } from "./supabase";
import { SITE, DB } from "./site";
import { DEFAULT_USD_RATE } from "./money";
import type { SiteSettings } from "./types";

export const DEFAULT_SETTINGS: SiteSettings = {
  logo_url: null,
  hero_media_type: "gradient",
  hero_media_url: null,
  hero_poster_url: null,
  hero_headline: "Find your place in Rwanda.",
  hero_subtext:
    "Verified homes, land and cars across Kigali and beyond — every listing inspected, every price real. No ghost listings.",
  about_image_url: null,
  phone: SITE.phone,
  whatsapp: SITE.whatsapp,
  email: SITE.email,
  usd_rate: DEFAULT_USD_RATE,
  rdb_line: "RDB-registered · Licensed agents · Verified listings",
};

/**
 * Read site settings (single row). Falls back to defaults when DB is absent
 * or the row is missing, so the site always renders.
 */
export async function getSettings(): Promise<SiteSettings> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from(DB.settings).select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      if (data) return { ...DEFAULT_SETTINGS, ...stripNulls(data as Partial<SiteSettings>) };
    } catch {
      /* fall through to defaults */
    }
  }
  return DEFAULT_SETTINGS;
}

/** Remove null/undefined so they don't overwrite sensible defaults. */
function stripNulls<T extends object>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined && v !== "") (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

export function usdRate(s: SiteSettings): number {
  return s.usd_rate && s.usd_rate > 0 ? s.usd_rate : DEFAULT_USD_RATE;
}

/**
 * The rate to actually use: live market rate when available, otherwise the
 * admin-set rate, otherwise the default. Keeps USD figures current automatically.
 */
export async function getRate(s: SiteSettings): Promise<number> {
  const { getLiveUsdRate } = await import("./fxrate");
  const live = await getLiveUsdRate();
  return live ?? usdRate(s);
}
