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
    title: `Land & Plots for Sale in ${loc.name}, Rwanda`,
    description: `Titled plots and land for sale in ${loc.name} (${loc.region}) — clear papers, fast transfer, prices in RWF & USD. Allan Multiservice Group.`,
    alternates: { canonical: `/land/location/${loc.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ place: string }> }) {
  const { place } = await params;
  const loc = locationFromSlug(place);
  if (!loc) notFound();
  return (
    <LocationLanding
      vertical="land"
      location={loc}
      heading={`Land & plots for sale in ${loc.name}`}
      intro={`Titled plots and land for sale in ${loc.name}, ${loc.region} — clear papers and fast transfer. Prices in RWF and USD. Allan Multiservice Group.`}
    />
  );
}
