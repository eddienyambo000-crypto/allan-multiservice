"use client";

import Link from "next/link";
import { useEffect } from "react";
import { VERTICALS, SITE, waLink, type VerticalKey } from "@/lib/site";
import {
  IconClose, IconArrow, IconHome, IconKey, IconMap, IconCar,
  IconPhone, IconWhatsApp, IconGlobe, IconBell,
} from "@/components/icons";

const VERT_ICON: Record<VerticalKey, React.FC<{ className?: string }>> = {
  properties: IconHome,
  rentals: IconKey,
  land: IconMap,
  cars: IconCar,
};

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] lg:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Solid panel — opaque, no bleed-through */}
      <div
        className={`absolute inset-0 flex flex-col bg-white transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-sky)] font-[family-name:var(--font-display)] text-base font-bold text-white">A</span>
            <span className="font-[family-name:var(--font-display)] text-[1.05rem] font-bold text-[var(--color-ink)]">
              ALLAN<span className="text-[var(--color-sky)]"> Multiservice</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--color-line)] text-[var(--color-ink)] transition-colors active:bg-[var(--color-surface)]"
          >
            <IconClose />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          {/* Category cards */}
          <p className="eyebrow mb-3 mt-2">Browse</p>
          <div className="grid grid-cols-2 gap-3">
            {VERTICALS.map((v) => {
              const Icon = VERT_ICON[v.key];
              return (
                <Link
                  key={v.key}
                  href={v.href}
                  onClick={onClose}
                  className="group flex flex-col gap-2 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition-colors active:border-[var(--color-sky)] active:bg-[var(--color-sky-soft)]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-sky)] text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[0.95rem] font-semibold leading-tight text-[var(--color-ink)]">{v.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Diaspora */}
          <Link
            href="/diaspora"
            onClick={onClose}
            className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-4 transition-colors active:bg-[var(--color-surface)]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-pink-soft)] text-[var(--color-pink)]"><IconGlobe className="h-5 w-5" /></span>
            <span className="flex-1">
              <span className="block text-[0.95rem] font-semibold text-[var(--color-ink)]">Buying from abroad?</span>
              <span className="block text-xs text-[var(--color-muted)]">Remote buying, title checks, USD pricing</span>
            </span>
            <IconArrow className="h-4 w-4 text-[var(--color-sky)]" />
          </Link>

          <div className="mt-4 flex flex-col gap-2 border-t border-[var(--color-line)] pt-4 text-[var(--color-ink-soft)]">
            <Link href="/about" onClick={onClose} className="flex items-center justify-between py-2 font-medium">About <IconArrow className="h-4 w-4 text-[var(--color-muted)]" /></Link>
            <Link href="/contact" onClick={onClose} className="flex items-center justify-between py-2 font-medium">Contact <IconArrow className="h-4 w-4 text-[var(--color-muted)]" /></Link>
          </div>

          {/* CTAs */}
          <Link
            href="/#alerts"
            onClick={onClose}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-pink)] px-6 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-pink)]"
          >
            <IconBell className="h-4 w-4" /> Get new-listing alerts
          </Link>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-line)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
              <IconPhone className="h-4 w-4 text-[var(--color-sky)]" /> Call
            </a>
            <a href={waLink(`Hi ${SITE.shortName}, I'd like to ask about a listing.`)} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white">
              <IconWhatsApp className="h-4 w-4" /> WhatsApp
            </a>
          </div>
          <p className="mt-4 text-center text-xs text-[var(--color-muted)]">{SITE.location} · Prices in RWF &amp; USD</p>
        </div>
      </div>
    </div>
  );
}
