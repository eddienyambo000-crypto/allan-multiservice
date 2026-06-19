"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FILTER_LOCATIONS } from "@/lib/locations";
import type { Vertical } from "@/lib/types";
import { IconSearch, IconClose } from "@/components/icons";

const CAR_MAKES = ["Toyota", "Mercedes-Benz", "Suzuki", "Nissan", "Honda", "Hyundai", "Land Rover", "Volkswagen"];

const PRICE_SALE = [
  { v: "50000000", l: "50M" },
  { v: "100000000", l: "100M" },
  { v: "200000000", l: "200M" },
  { v: "400000000", l: "400M" },
];
const PRICE_RENT = [
  { v: "300000", l: "300K /mo" },
  { v: "600000", l: "600K /mo" },
  { v: "1000000", l: "1M /mo" },
  { v: "2000000", l: "2M /mo" },
];
const PRICE_CAR = [
  { v: "10000000", l: "10M" },
  { v: "20000000", l: "20M" },
  { v: "35000000", l: "35M" },
  { v: "60000000", l: "60M" },
];

export default function FilterBar({ vertical }: { vertical: Vertical }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  const get = (k: string) => params.get(k) ?? "";
  const hasFilters = ["location", "minPrice", "maxPrice", "bedrooms", "make", "sort", "q"].some((k) => params.get(k));

  const priceOptions = vertical === "car" ? PRICE_CAR : vertical === "rental" ? PRICE_RENT : PRICE_SALE;
  const isResidential = vertical === "property" || vertical === "rental";

  return (
    <div className="sticky top-[68px] z-30 -mx-4 mb-8 border-y border-[var(--color-line)] bg-white/90 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-[var(--radius-card)] sm:border sm:px-4 sm:shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search */}
        <div className="relative flex min-w-0 flex-1 items-center sm:max-w-xs">
          <IconSearch className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--color-muted)]" />
          <input
            defaultValue={get("q")}
            onKeyDown={(e) => {
              if (e.key === "Enter") setParam("q", (e.target as HTMLInputElement).value.trim());
            }}
            onBlur={(e) => setParam("q", e.target.value.trim())}
            placeholder="Search…"
            className="w-full rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-sky)]"
          />
        </div>

        <Select label="Location" value={get("location")} onChange={(v) => setParam("location", v)}>
          <option value="">All areas</option>
          {FILTER_LOCATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
        </Select>

        {vertical === "car" && (
          <Select label="Make" value={get("make")} onChange={(v) => setParam("make", v)}>
            <option value="">Any make</option>
            {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
        )}

        <Select label="Max price" value={get("maxPrice")} onChange={(v) => setParam("maxPrice", v)}>
          <option value="">Any price</option>
          {priceOptions.map((p) => <option key={p.v} value={p.v}>Under RWF {p.l}</option>)}
        </Select>

        {isResidential && (
          <Select label="Beds" value={get("bedrooms")} onChange={(v) => setParam("bedrooms", v)}>
            <option value="">Any beds</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={String(n)}>{n}+ beds</option>)}
          </Select>
        )}

        <Select label="Sort" value={get("sort")} onChange={(v) => setParam("sort", v)}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </Select>

        {hasFilters && (
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--color-line)] px-3 py-2 text-xs font-semibold text-[var(--color-muted)] transition-colors hover:border-[var(--color-pink)] hover:text-[var(--color-pink)]"
          >
            <IconClose className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

function Select({
  label, value, onChange, children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative inline-flex items-center" aria-label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`cursor-pointer appearance-none rounded-full border py-2 pl-3.5 pr-8 text-sm font-medium outline-none transition-colors focus:border-[var(--color-sky)] ${
          value
            ? "border-[var(--color-sky)] bg-[var(--color-sky-soft)] text-[var(--color-sky-hover)]"
            : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink)]"
        }`}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 text-[var(--color-muted)]">▾</span>
    </label>
  );
}
