import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KIGALI_AREAS } from "@/lib/site";
import LocationLanding, { areaFromSlug } from "@/components/LocationLanding";

export const revalidate = 600;

export function generateStaticParams() {
  return KIGALI_AREAS.map((a) => ({ area: a.toLowerCase().replace(/\s+/g, "-") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area: slug } = await params;
  const area = areaFromSlug(slug);
  if (!area) return { title: "Area not found" };
  return {
    title: `Houses for Sale in ${area}, Kigali`,
    description: `Verified houses, villas, and apartments for sale in ${area}, Kigali. Real prices, real photos — from Allan Multiservice Group.`,
    alternates: { canonical: `/properties/kigali/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ area: string }> }) {
  const { area: slug } = await params;
  const area = areaFromSlug(slug);
  if (!area) notFound();
  return (
    <LocationLanding
      vertical="property"
      area={area}
      heading={`Houses for sale in ${area}`}
      intro={`Browse verified property for sale in ${area}, Kigali — inspected, priced fairly, and ready to view. Allan Multiservice Group.`}
    />
  );
}
