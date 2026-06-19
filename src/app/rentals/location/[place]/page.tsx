import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FEATURED_LOCATIONS, locationFromSlug } from "@/lib/locations";
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
  return {
    title: `Houses & Apartments for Rent in ${loc.name}, Rwanda`,
    description: `Verified houses and apartments for rent in ${loc.name} (${loc.region}) — furnished and unfurnished, every budget. Allan Multiservice Group.`,
    alternates: { canonical: `/rentals/location/${loc.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ place: string }> }) {
  const { place } = await params;
  const loc = locationFromSlug(place);
  if (!loc) notFound();
  return (
    <LocationLanding
      vertical="rental"
      location={loc}
      heading={`Houses for rent in ${loc.name}`}
      intro={`Move-in-ready rentals in ${loc.name}, ${loc.region} — furnished or not, every price range. Verified and available now. Allan Multiservice Group.`}
    />
  );
}
