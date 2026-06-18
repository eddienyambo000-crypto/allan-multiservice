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

  // land
  zoning?: string | null;
  title_status?: string | null;

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

export interface Inquiry {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  listing_id?: string | null;
  listing_title?: string | null;
}

export interface SellerLead {
  vertical: Vertical;
  name: string;
  phone: string;
  asset_title: string;
  details?: string;
}
