// ============================================================
// Central site config — single source of truth for brand,
// contact, and the 4 marketplace verticals.
// ============================================================

export const SITE = {
  name: "Allan Multiservice Group",
  shortName: "Allan",
  tagline: "Rwanda's first verified marketplace for homes, land & cars.",
  description:
    "Buy, rent, and sell verified property, land, and cars in Kigali, Rwanda — all in one trusted marketplace. No ghost listings. Allan Multiservice Group.",
  url: "https://allan-multiservice.vercel.app",
  // Owner contact
  phone: "+250783677275",
  phoneDisplay: "0783 677 275",
  whatsapp: "250783677275",
  email: "info@allanmultiservice.rw",
  location: "Kigali, Rwanda",
  address: "Kigali Nyarugenge, Rwanda",
  instagram: "https://www.instagram.com/",
  builtByUrl: "https://eddie-portfolio-gamma.vercel.app",
} as const;

export type VerticalKey = "properties" | "land" | "cars" | "rentals";

export interface VerticalMeta {
  key: VerticalKey;
  /** DB enum value on listings.vertical */
  vertical: "property" | "land" | "car" | "rental";
  label: string;
  short: string;
  /** route base, e.g. /properties */
  href: string;
  blurb: string;
  /** Hormozi-style outcome line */
  outcome: string;
}

export const VERTICALS: VerticalMeta[] = [
  {
    key: "properties",
    vertical: "property",
    label: "Properties for Sale",
    short: "Properties",
    href: "/properties",
    blurb: "Houses, villas & apartments — verified and ready to view.",
    outcome: "Own a home in Kigali's best neighbourhoods.",
  },
  {
    key: "rentals",
    vertical: "rental",
    label: "Houses for Rent",
    short: "Rentals",
    href: "/rentals",
    blurb: "Move-in-ready rentals across the city, every price range.",
    outcome: "Find your next place — no agent runaround.",
  },
  {
    key: "land",
    vertical: "land",
    label: "Land & Plots",
    short: "Land",
    href: "/land",
    blurb: "Titled plots with clear papers and fast transfer.",
    outcome: "Secure land you can actually build on.",
  },
  {
    key: "cars",
    vertical: "car",
    label: "Cars for Sale",
    short: "Cars",
    href: "/cars",
    blurb: "Inspected vehicles — make, model, mileage, all upfront.",
    outcome: "Drive away in a car that won't surprise you.",
  },
];

export const VERTICAL_BY_DB: Record<string, VerticalMeta> = Object.fromEntries(
  VERTICALS.map((v) => [v.vertical, v])
);
export const VERTICAL_BY_KEY: Record<VerticalKey, VerticalMeta> = Object.fromEntries(
  VERTICALS.map((v) => [v.key, v])
) as Record<VerticalKey, VerticalMeta>;

/** Kigali areas used for filters + programmatic SEO landing pages. */
export const KIGALI_AREAS = [
  "Kiyovu",
  "Kimihurura",
  "Nyarutarama",
  "Kacyiru",
  "Gisozi",
  "Remera",
  "Kanombe",
  "Kibagabaga",
  "Gacuriro",
  "Nyamirambo",
  "Kicukiro",
  "CBD",
];

/** Build a pre-filled WhatsApp deep link. */
export function waLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
