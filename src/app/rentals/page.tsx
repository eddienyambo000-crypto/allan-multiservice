import type { Metadata } from "next";
import ListingsIndex from "@/components/ListingsIndex";
import type { RawParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Houses & Apartments for Rent in Kigali, Rwanda",
  description:
    "Find verified houses and apartments for rent in Kigali — furnished and unfurnished, every budget. No agent runaround. Allan Multiservice Group.",
  alternates: { canonical: "/rentals" },
};

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  return (
    <ListingsIndex
      vertical="rental"
      searchParams={await searchParams}
      heading="Houses for rent in Kigali"
      intro="Move-in-ready rentals across the city — furnished or not, every price range. Verified and available now."
    />
  );
}
