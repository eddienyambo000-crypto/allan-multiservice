import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListingBySlug, getAllSlugs } from "@/lib/listings";
import { listingMetadata } from "@/lib/detail-meta";
import ListingDetail from "@/components/ListingDetail";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.filter((s) => s.vertical === "land").map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return listingMetadata(await getListingBySlug(slug), "land");
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing || listing.vertical !== "land") notFound();
  return <ListingDetail listing={listing} />;
}
