"use client";

import { useFavorite } from "@/lib/favorites";
import { IconHeart } from "@/components/icons";

export default function FavoriteButton({
  slug,
  className = "",
  size = "sm",
}: {
  slug: string;
  className?: string;
  size?: "sm" | "lg";
}) {
  const { fav, toggle } = useFavorite(slug);
  const dim = size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const icon = size === "lg" ? "h-5 w-5" : "h-[18px] w-[18px]";

  return (
    <button
      type="button"
      aria-label={fav ? "Remove from saved" : "Save listing"}
      aria-pressed={fav}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      className={`grid ${dim} place-items-center rounded-full border backdrop-blur transition-[transform,background,color] duration-200 hover:scale-105 active:scale-95 ${
        fav
          ? "border-[var(--color-pink)] bg-[var(--color-pink)] text-white"
          : "border-white/60 bg-white/85 text-[var(--color-ink)]"
      } ${className}`}
    >
      <IconHeart className={icon} {...(fav ? { fill: "currentColor" } : {})} />
    </button>
  );
}
