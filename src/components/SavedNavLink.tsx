"use client";

import Link from "next/link";
import { useFavoriteCount } from "@/lib/favorites";
import { IconHeart } from "@/components/icons";

/** Heart icon + saved-count badge linking to /saved. */
export default function SavedNavLink({ label = false }: { label?: boolean }) {
  const count = useFavoriteCount();
  return (
    <Link
      href="/saved"
      aria-label={`Saved listings${count ? ` (${count})` : ""}`}
      className="relative inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-pink)]"
    >
      <span className="relative">
        <IconHeart className="h-5 w-5" {...(count ? { fill: "currentColor" } : {})} />
        {count > 0 && (
          <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--color-pink)] px-1 text-[0.6rem] font-bold text-white">
            {count}
          </span>
        )}
      </span>
      {label && "Saved"}
    </Link>
  );
}
