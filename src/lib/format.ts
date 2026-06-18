import type { Listing } from "./types";

export function formatPrice(l: Pick<Listing, "price_label">): string {
  return l.price_label;
}

/** Short spec chips shown on cards + detail headers, per vertical. */
export function specChips(l: Listing): { label: string; value: string }[] {
  switch (l.vertical) {
    case "property":
    case "rental":
      return [
        l.bedrooms != null ? { label: "Beds", value: String(l.bedrooms) } : null,
        l.bathrooms != null ? { label: "Baths", value: String(l.bathrooms) } : null,
        l.area_sqm != null ? { label: "Area", value: `${l.area_sqm} m²` } : null,
      ].filter(Boolean) as { label: string; value: string }[];
    case "land":
      return [
        l.area_sqm != null ? { label: "Area", value: `${l.area_sqm.toLocaleString()} m²` } : null,
        l.zoning ? { label: "Zoning", value: l.zoning } : null,
        l.title_status ? { label: "Title", value: l.title_status } : null,
      ].filter(Boolean) as { label: string; value: string }[];
    case "car":
      return [
        l.year != null ? { label: "Year", value: String(l.year) } : null,
        l.mileage_km != null ? { label: "Mileage", value: `${l.mileage_km.toLocaleString()} km` } : null,
        l.transmission ? { label: "Gearbox", value: l.transmission } : null,
        l.fuel_type ? { label: "Fuel", value: l.fuel_type } : null,
      ].filter(Boolean) as { label: string; value: string }[];
  }
}

export const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  sold: "Sold",
  rented: "Rented",
  reserved: "Reserved",
};
