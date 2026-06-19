// ============================================================
// Rwanda location graph — powers filters + programmatic SEO
// landing pages (e.g. /properties/location/kamonyi).
// `featured` locations are prebuilt at build time; the rest
// render on-demand via ISR (dynamicParams).
// ============================================================

export type LocationKind = "kigali-area" | "district" | "town";

export interface RwLocation {
  slug: string;
  name: string;
  kind: LocationKind;
  /** broader area shown in copy, e.g. "Gasabo, Kigali" */
  region: string;
  featured?: boolean;
}

export const LOCATIONS: RwLocation[] = [
  // ── Kigali neighbourhoods (highest search volume) ──
  { slug: "kiyovu", name: "Kiyovu", kind: "kigali-area", region: "Nyarugenge, Kigali", featured: true },
  { slug: "kimihurura", name: "Kimihurura", kind: "kigali-area", region: "Gasabo, Kigali", featured: true },
  { slug: "nyarutarama", name: "Nyarutarama", kind: "kigali-area", region: "Gasabo, Kigali", featured: true },
  { slug: "kacyiru", name: "Kacyiru", kind: "kigali-area", region: "Gasabo, Kigali", featured: true },
  { slug: "gisozi", name: "Gisozi", kind: "kigali-area", region: "Gasabo, Kigali", featured: true },
  { slug: "remera", name: "Remera", kind: "kigali-area", region: "Gasabo, Kigali", featured: true },
  { slug: "kibagabaga", name: "Kibagabaga", kind: "kigali-area", region: "Gasabo, Kigali", featured: true },
  { slug: "gacuriro", name: "Gacuriro", kind: "kigali-area", region: "Gasabo, Kigali", featured: true },
  { slug: "kanombe", name: "Kanombe", kind: "kigali-area", region: "Kicukiro, Kigali", featured: true },
  { slug: "nyamirambo", name: "Nyamirambo", kind: "kigali-area", region: "Nyarugenge, Kigali", featured: true },
  { slug: "kicukiro", name: "Kicukiro", kind: "kigali-area", region: "Kicukiro, Kigali", featured: true },
  { slug: "cbd", name: "CBD", kind: "kigali-area", region: "Nyarugenge, Kigali", featured: true },
  { slug: "kabeza", name: "Kabeza", kind: "kigali-area", region: "Kicukiro, Kigali" },
  { slug: "rebero", name: "Rebero", kind: "kigali-area", region: "Kicukiro, Kigali" },
  { slug: "kinyinya", name: "Kinyinya", kind: "kigali-area", region: "Gasabo, Kigali" },
  { slug: "kabuga", name: "Kabuga", kind: "kigali-area", region: "Gasabo, Kigali" },
  { slug: "masaka", name: "Masaka", kind: "kigali-area", region: "Kicukiro, Kigali" },
  { slug: "gikondo", name: "Gikondo", kind: "kigali-area", region: "Kicukiro, Kigali" },
  { slug: "rusororo", name: "Rusororo", kind: "kigali-area", region: "Gasabo, Kigali" },

  // ── Districts / towns nationwide ──
  { slug: "kamonyi", name: "Kamonyi", kind: "district", region: "Southern Province", featured: true },
  { slug: "bugesera", name: "Bugesera", kind: "district", region: "Eastern Province", featured: true },
  { slug: "nyamata", name: "Nyamata", kind: "town", region: "Bugesera, Eastern", featured: true },
  { slug: "rwamagana", name: "Rwamagana", kind: "district", region: "Eastern Province", featured: true },
  { slug: "musanze", name: "Musanze", kind: "district", region: "Northern Province", featured: true },
  { slug: "rubavu", name: "Rubavu", kind: "district", region: "Western Province", featured: true },
  { slug: "gisenyi", name: "Gisenyi", kind: "town", region: "Rubavu, Western", featured: true },
  { slug: "huye", name: "Huye", kind: "district", region: "Southern Province", featured: true },
  { slug: "muhanga", name: "Muhanga", kind: "district", region: "Southern Province", featured: true },
  { slug: "nyagatare", name: "Nyagatare", kind: "district", region: "Eastern Province", featured: true },
  { slug: "nyanza", name: "Nyanza", kind: "district", region: "Southern Province" },
  { slug: "ruhango", name: "Ruhango", kind: "district", region: "Southern Province" },
  { slug: "karongi", name: "Karongi", kind: "district", region: "Western Province" },
  { slug: "rusizi", name: "Rusizi", kind: "district", region: "Western Province" },
  { slug: "rubona", name: "Rubona", kind: "town", region: "Eastern Province" },
  { slug: "kayonza", name: "Kayonza", kind: "district", region: "Eastern Province" },
  { slug: "ngoma", name: "Ngoma", kind: "district", region: "Eastern Province" },
  { slug: "gicumbi", name: "Gicumbi", kind: "district", region: "Northern Province" },
  { slug: "rulindo", name: "Rulindo", kind: "district", region: "Northern Province" },
  { slug: "gakenke", name: "Gakenke", kind: "district", region: "Northern Province" },
  { slug: "nyamagabe", name: "Nyamagabe", kind: "district", region: "Southern Province" },
  { slug: "gatsibo", name: "Gatsibo", kind: "district", region: "Eastern Province" },
  { slug: "kirehe", name: "Kirehe", kind: "district", region: "Eastern Province" },
  { slug: "nyabihu", name: "Nyabihu", kind: "district", region: "Western Province" },
  { slug: "rutsiro", name: "Rutsiro", kind: "district", region: "Western Province" },
  { slug: "nyamasheke", name: "Nyamasheke", kind: "district", region: "Western Province" },
];

export const LOCATION_BY_SLUG: Record<string, RwLocation> = Object.fromEntries(
  LOCATIONS.map((l) => [l.slug, l])
);

export const FEATURED_LOCATIONS = LOCATIONS.filter((l) => l.featured);

/** Areas used in filter dropdowns — Kigali areas first, then key districts/towns. */
export const FILTER_LOCATIONS = LOCATIONS.map((l) => l.name);

export function locationSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

export function locationFromSlug(slug: string): RwLocation | null {
  return LOCATION_BY_SLUG[slug.toLowerCase()] ?? null;
}
