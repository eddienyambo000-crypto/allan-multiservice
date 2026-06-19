import Link from "next/link";
import { VERTICALS } from "@/lib/site";
import { IconArrow } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-24 text-center">
      <div className="max-w-md">
        <p className="font-[family-name:var(--font-display)] text-[clamp(4rem,18vw,9rem)] font-bold leading-none text-gradient">404</p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--color-ink)]">This page took a wrong turn.</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">The listing may have sold or moved. Let&apos;s get you back to the good stuff.</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-sky)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
          Back home <IconArrow className="h-4 w-4" />
        </Link>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {VERTICALS.map((v) => (
            <Link key={v.key} href={v.href} className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]">
              {v.short}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
