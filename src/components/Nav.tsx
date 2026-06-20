"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { VERTICALS, SITE } from "@/lib/site";
import { IconMenu, IconBell, IconGlobe } from "@/components/icons";
import MobileMenu from "@/components/MobileMenu";
import SavedNavLink from "@/components/SavedNavLink";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,padding] duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_var(--color-line)] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <nav className="container-x flex items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={SITE.name}>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-sky)] font-[family-name:var(--font-display)] text-base font-bold text-white shadow-[0_4px_14px_rgba(12,140,224,0.4)]">
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
              href="/diaspora"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-sky)]"
            >
              <IconGlobe className="h-4 w-4" /> From Abroad
            </Link>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <SavedNavLink />
            <Link
              href="/#alerts"
              className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pink)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-pink)] transition-[transform,background] duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-pink-hover)] active:translate-y-0"
            >
              <IconBell className="h-4 w-4" /> Get listing alerts
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <SavedNavLink />
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--color-line)] bg-white/70 text-[var(--color-ink)] backdrop-blur transition-colors hover:bg-[var(--color-surface)]"
            >
              <IconMenu />
            </button>
          </div>
        </nav>
      </header>

      {/* Rendered OUTSIDE the backdrop-blurred header so `fixed` anchors to the viewport. */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
