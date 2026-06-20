import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FEATURED_LOCATIONS, locationFromSlug } from "@/lib/locations";
import { getListings } from "@/lib/listings";
import LocationLanding from "@/components/LocationLanding";

export const revalidate = 600;
export const dynamicParams = true;

export function generateStaticParams() {
  return FEATURED_LOCATIONS.map((l) => ({ place: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ place: string }> }): Promise<Metadata> {
  const { place } = await params;
  const loc = locationFromSlug(place);
  if (!loc) return { title: "Location not found" };
  // Don't let empty location pages get indexed (avoids doorway-page penalty).
  const count = (await getListings({ vertical: "property", location: loc.name })).length;
  return {
    title: `Houses & Property for Sale in ${loc.name}, Rwanda`,
    description: `Verified houses, villas and apartments for sale in ${loc.name} (${loc.region}). Real prices in RWF & USD, clear titles — Allan Multiservice Group.`,
    alternates: { canonical: `/properties/location/${loc.slug}` },
    robots: count > 0 ? undefined : { index: false, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ place: string }> }) {
  const { place } = await params;
  const loc = locationFromSlug(place);
  if (!loc) notFound();
  return (
    <LocationLanding
      vertical="property"
      location={loc}
      heading={`Property for sale in ${loc.name}`}
      intro={`Browse verified houses and apartments for sale in ${loc.name}, ${loc.region}. Every listing inspected, prices shown in RWF and USD. Allan Multiservice Group.`}
    />
  );
}
