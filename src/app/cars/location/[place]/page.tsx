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
    title: `Cars for Sale in ${loc.name}, Rwanda`,
    description: `Inspected cars for sale in ${loc.name} (${loc.region}) — make, model, year and mileage upfront, prices in RWF & USD. Allan Multiservice Group.`,
    alternates: { canonical: `/cars/location/${loc.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ place: string }> }) {
  const { place } = await params;
  const loc = locationFromSlug(place);
  if (!loc) notFound();
  return (
    <LocationLanding
      vertical="car"
      location={loc}
      heading={`Cars for sale in ${loc.name}`}
      intro={`Locally inspected vehicles for sale around ${loc.name}, ${loc.region} — full details upfront, prices in RWF and USD. Allan Multiservice Group.`}
    />
  );
}
