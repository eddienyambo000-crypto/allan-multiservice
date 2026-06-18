import type { Metadata } from "next";
import ListingsIndex from "@/components/ListingsIndex";
import type { RawParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Land & Plots for Sale in Kigali, Rwanda",
  description:
    "Titled plots and land for sale in Kigali and beyond — clear papers, fast transfer, residential and commercial. Allan Multiservice Group.",
  alternates: { canonical: "/land" },
};

export default async function LandPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  return (
    <ListingsIndex
      vertical="land"
      searchParams={await searchParams}
      heading="Land & plots for sale"
      intro="Titled plots with clear papers and fast transfer — residential, commercial, and estate land across Kigali."
    />
  );
}
