export type Vertical = "property" | "land" | "car" | "rental";
export type ListingType = "sale" | "rent";
export type ListingStatus = "available" | "sold" | "rented" | "reserved";

export interface Listing {
  id: string;
  slug: string;
  vertical: Vertical;
  listing_type: ListingType;
  title: string;
  price: number;
  price_label: string;
  currency: string;
  location: string;
  district: string;
  description: string;
  features: string[];
  images: string[];
  status: ListingStatus;
  featured: boolean;
  created_at: string;

  // property / rental
  bedrooms?: number | null;
  bathrooms?: number | null;
  area_sqm?: number | null;
  furnished?: boolean | null;

  // land / property
  zoning?: string | null;
  title_status?: string | null;
  tenure?: string | null; // Freehold | Leasehold (99yr)

  // media
  video_url?: string | null;

  // car
  make?: string | null;
  model?: string | null;
  year?: number | null;
  mileage_km?: number | null;
  transmission?: string | null;
  fuel_type?: string | null;
  condition?: string | null;
  body_type?: string | null;
}

export interface ListingFilters {
  vertical?: Vertical;
  type?: ListingType;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  make?: string;
  q?: string;
  sort?: "newest" | "price_asc" | "price_desc";
}

export type InquiryKind = "inquiry" | "video_tour" | "concierge";

export interface Inquiry {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  listing_id?: string | null;
  listing_title?: string | null;
  kind?: InquiryKind;
}

export interface Alert {
  channel: "whatsapp" | "email";
  contact: string;
  vertical?: Vertical | null;
  location?: string | null;
  max_price?: number | null;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  rating: number;
  approved: boolean;
  created_at: string;
}

export interface SiteSettings {
  logo_url: string | null;
  hero_media_type: "gradient" | "image" | "video";
  hero_media_url: string | null;
  hero_poster_url: string | null;
  hero_headline: string | null;
  hero_subtext: string | null;
  about_image_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  usd_rate: number | null;
  rdb_line: string | null;
}
