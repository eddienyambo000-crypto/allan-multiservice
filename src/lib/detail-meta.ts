import type { Metadata } from "next";
import type { Listing, Vertical } from "./types";
import { VERTICAL_BY_DB } from "./site";

export function listingMetadata(listing: Listing | null, vertical: Vertical): Metadata {
  if (!listing) return { title: "Listing not found" };
  const meta = VERTICAL_BY_DB[vertical];
  const path = `${meta.href}/${listing.slug}`;
  const title = `${listing.title} — ${listing.price_label}`;
  const description = listing.description.slice(0, 155);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title,
      description,
      images: listing.images.length ? [{ url: listing.images[0] }] : undefined,
    },
  };
}
