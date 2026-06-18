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
    title: `Houses for Rent in ${area}, Kigali`,
    description: `Verified houses and apartments for rent in ${area}, Kigali — furnished and unfurnished, every budget. Allan Multiservice Group.`,
    alternates: { canonical: `/rentals/kigali/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ area: string }> }) {
  const { area: slug } = await params;
  const area = areaFromSlug(slug);
  if (!area) notFound();
  return (
    <LocationLanding
      vertical="rental"
      area={area}
      heading={`Houses for rent in ${area}`}
      intro={`Move-in-ready rentals in ${area}, Kigali — furnished or not, every price range. Verified and available now. Allan Multiservice Group.`}
    />
  );
}
