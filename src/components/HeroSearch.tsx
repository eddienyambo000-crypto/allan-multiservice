"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { VERTICALS, type VerticalKey } from "@/lib/site";
import { FILTER_LOCATIONS } from "@/lib/locations";
import { IconSearch } from "@/components/icons";

export default function HeroSearch() {
  const router = useRouter();
  const [vertical, setVertical] = useState<VerticalKey>("properties");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const base = VERTICALS.find((v) => v.key === vertical)!.href;
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (maxPrice) params.set("maxPrice", maxPrice);
    const qs = params.toString();
    router.push(qs ? `${base}?${qs}` : base);
  }

  const isCars = vertical === "cars";

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white/95 p-3 shadow-[var(--shadow-lift)] backdrop-blur-md sm:flex-row sm:items-stretch sm:gap-0 sm:p-2"
    >
      <Field label="I want to">
        <select
          value={vertical}
          onChange={(e) => setVertical(e.target.value as VerticalKey)}
          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-[var(--color-ink)] outline-none"
        >
          {VERTICALS.map((v) => (
            <option key={v.key} value={v.key}>{v.label}</option>
          ))}
        </select>
      </Field>

      <Divider />

      <Field label={isCars ? "Where" : "Location"}>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-[var(--color-ink)] outline-none"
        >
          <option value="">{isCars ? "Anywhere in Rwanda" : "All locations"}</option>
          {FILTER_LOCATIONS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </Field>

      <Divider />

      <Field label="Max budget">
        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-[var(--color-ink)] outline-none"
        >
          <option value="">Any budget</option>
          {isCars ? (
            <>
              <option value="15000000">Under RWF 15M</option>
              <option value="30000000">Under RWF 30M</option>
              <option value="50000000">Under RWF 50M</option>
            </>
          ) : (
            <>
              <option value="1000000">Under RWF 1M / mo</option>
              <option value="50000000">Under RWF 50M</option>
              <option value="150000000">Under RWF 150M</option>
              <option value="300000000">Under RWF 300M</option>
            </>
          )}
        </select>
      </Field>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-[var(--color-sky)] px-6 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-[transform,background] duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-sky-hover)] active:translate-y-0 sm:m-1"
      >
        <IconSearch className="h-4 w-4" /> Search
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-1 cursor-pointer flex-col gap-0.5 px-4 py-2">
      <span className="font-[family-name:var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--color-sky)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function Divider() {
  return <span className="hidden w-px self-stretch bg-[var(--color-line)] sm:block" />;
}
