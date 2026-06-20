"use client";

import { useState } from "react";
import type { Listing } from "@/lib/types";
import ListingCard from "@/components/ListingCard";

const PAGE = 12;

/** Renders listings in pages of 12 with a "Load more" button so we never
 *  paint hundreds of cards/images at once. */
export default function ListingGrid({ listings, usdRate }: { listings: Listing[]; usdRate: number }) {
  const [visible, setVisible] = useState(PAGE);
  const shown = listings.slice(0, visible);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((l) => (
          <ListingCard key={l.id} listing={l} usdRate={usdRate} />
        ))}
      </div>
      {visible < listings.length && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setVisible((v) => v + PAGE)}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sky)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-sky)] transition-colors hover:bg-[var(--color-sky)] hover:text-white"
          >
            Load more ({listings.length - visible} more)
          </button>
        </div>
      )}
    </>
  );
}
