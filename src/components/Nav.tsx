"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { VERTICALS, SITE } from "@/lib/site";
import { IconMenu, IconClose, IconArrow } from "@/components/icons";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,padding] duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_var(--color-line)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="container-x flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={SITE.name}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-ink)] font-[family-name:var(--font-display)] text-base font-bold text-white">
            A
          </span>
          <span className="font-[family-name:var(--font-display)] text-[1.05rem] font-bold leading-none text-[var(--color-ink)]">
            ALLAN<span className="text-[var(--color-sky)]"> Multiservice</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {VERTICALS.map((v) => (
            <Link
              key={v.key}
              href={v.href}
              className="text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-sky)]"
            >
              {v.short}
            </Link>
          ))}
          <Link
            href="/about"
            className="text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-sky)]"
          >
            About
          </Link>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/sell"
            className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pink)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-pink)] transition-[transform,background] duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-pink-hover)] active:translate-y-0"
          >
            Sell with Allan
            <IconArrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--color-line)] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface)] lg:hidden"
        >
          <IconMenu />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 bg-white transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="container-x flex items-center justify-between py-5">
          <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-ink)]">
            ALLAN<span className="text-[var(--color-sky)]"> Multiservice</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--color-line)] text-[var(--color-ink)]"
          >
            <IconClose />
          </button>
        </div>
        <div className="container-x flex flex-col gap-1 pt-6">
          {VERTICALS.map((v) => (
            <Link
              key={v.key}
              href={v.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-[var(--color-line)] py-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]"
            >
              {v.label}
              <IconArrow className="h-5 w-5 text-[var(--color-sky)]" />
            </Link>
          ))}
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between border-b border-[var(--color-line)] py-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]"
          >
            About
            <IconArrow className="h-5 w-5 text-[var(--color-sky)]" />
          </Link>
          <Link
            href="/sell"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-pink)] px-6 py-4 text-base font-semibold text-white"
          >
            Sell with Allan <IconArrow className="h-5 w-5" />
          </Link>
          <a
            href={`tel:${SITE.phone}`}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-line)] px-6 py-4 text-base font-semibold text-[var(--color-ink)]"
          >
            Call {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </header>
  );
}
