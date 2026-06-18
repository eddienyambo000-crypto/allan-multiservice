import type { Metadata } from "next";
import ListingsIndex from "@/components/ListingsIndex";
import type { RawParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Cars for Sale in Kigali, Rwanda",
  description:
    "Inspected cars for sale in Kigali — make, model, year, and mileage all upfront. No surprises. Allan Multiservice Group.",
  alternates: { canonical: "/cars" },
};

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  return (
    <ListingsIndex
      vertical="car"
      searchParams={await searchParams}
      heading="Cars for sale in Kigali"
      intro="Locally inspected vehicles with full details upfront — make, model, year, mileage, and condition. Drive away with confidence."
    />
  );
}
