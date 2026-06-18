import type { Metadata } from "next";
import ListingsIndex from "@/components/ListingsIndex";
import type { RawParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Houses & Property for Sale in Kigali, Rwanda",
  description:
    "Browse verified houses, villas, and apartments for sale in Kigali. Real prices, real photos, clear titles — from Allan Multiservice Group.",
  alternates: { canonical: "/properties" },
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  return (
    <ListingsIndex
      vertical="property"
      searchParams={await searchParams}
      heading="Property for sale in Kigali"
      intro="Verified houses, villas, and apartments across Kigali's best neighbourhoods — every listing inspected, every price real."
    />
  );
}
