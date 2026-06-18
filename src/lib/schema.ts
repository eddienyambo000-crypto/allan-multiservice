import { SITE } from "./site";
import type { Listing } from "./types";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent", "LocalBusiness"],
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    image: `${SITE.url}/og.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kigali Nyarugenge",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    areaServed: "Rwanda",
    knowsLanguage: ["en", "rw", "fr"],
    sameAs: [SITE.instagram],
  };
}

export function listingSchema(l: Listing) {
  const url = `${SITE.url}/${verticalPath(l.vertical)}/${l.slug}`;
  const base = {
    name: l.title,
    description: l.description,
    image: l.images,
    url,
    offers: {
      "@type": "Offer",
      price: l.price,
      priceCurrency: l.currency,
      availability: l.status === "available"
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
    },
  };

  if (l.vertical === "car") {
    return {
      "@context": "https://schema.org",
      "@type": "Car",
      ...base,
      brand: l.make,
      model: l.model,
      vehicleModelDate: l.year,
      mileageFromOdometer: l.mileage_km
        ? { "@type": "QuantitativeValue", value: l.mileage_km, unitCode: "KMT" }
        : undefined,
      vehicleTransmission: l.transmission,
      fuelType: l.fuel_type,
      bodyType: l.body_type,
    };
  }

  // property / rental / land
  return {
    "@context": "https://schema.org",
    "@type": l.vertical === "land" ? "Product" : "RealEstateListing",
    ...base,
    numberOfBedrooms: l.bedrooms ?? undefined,
    numberOfBathroomsTotal: l.bathrooms ?? undefined,
    floorSize: l.area_sqm
      ? { "@type": "QuantitativeValue", value: l.area_sqm, unitCode: "MTK" }
      : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: l.location,
      addressRegion: l.district,
      addressCountry: "RW",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

function verticalPath(v: Listing["vertical"]): string {
  return v === "property" ? "properties" : v === "rental" ? "rentals" : v === "land" ? "land" : "cars";
}
