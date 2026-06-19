import type { Metadata } from "next";
import { getListings } from "@/lib/listings";
import { getSettings, usdRate } from "@/lib/settings";
import SavedClient from "@/components/SavedClient";

export const metadata: Metadata = {
  title: "Your Saved Listings",
  description: "Your shortlisted property, land and cars on Allan Multiservice Group.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/saved" },
};

export default async function SavedPage() {
  const [listings, settings] = await Promise.all([getListings(), getSettings()]);
  return (
    <div className="container-x pt-28 pb-20 sm:pt-32">
      <header className="mb-8 max-w-2xl">
        <p className="eyebrow">Your shortlist</p>
        <h1 className="mt-2 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight">Saved listings</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          Everything you&apos;ve hearted, in one place — compare, share with family abroad, or send to us to move on.
        </p>
      </header>
      <SavedClient listings={listings} rate={usdRate(settings)} />
    </div>
  );
}
