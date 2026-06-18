import Link from "next/link";
import { SITE, VERTICALS } from "@/lib/site";
import { IconWhatsApp, IconPin, IconPhone } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-ink)] font-[family-name:var(--font-display)] text-base font-bold text-white">
              A
            </span>
            <span className="font-[family-name:var(--font-display)] text-[1.05rem] font-bold text-[var(--color-ink)]">
              ALLAN<span className="text-[var(--color-sky)]"> Multiservice</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-muted)]">
            Rwanda&apos;s first verified marketplace for property, land, and cars.
            One trusted place to buy, rent, and sell — no ghost listings.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Marketplace</p>
          <ul className="flex flex-col gap-3">
            {VERTICALS.map((v) => (
              <li key={v.key}>
                <Link
                  href={v.href}
                  className="text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-sky)]"
                >
                  {v.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Company</p>
          <ul className="flex flex-col gap-3">
            <li><Link href="/sell" className="text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-sky)]">Sell with Allan</Link></li>
            <li><Link href="/about" className="text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-sky)]">About</Link></li>
            <li><Link href="/contact" className="text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-sky)]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Get in touch</p>
          <ul className="flex flex-col gap-3 text-sm text-[var(--color-ink-soft)]">
            <li className="flex items-center gap-2">
              <IconPin className="h-4 w-4 text-[var(--color-sky)]" /> {SITE.address}
            </li>
            <li>
              <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 transition-colors hover:text-[var(--color-sky)]">
                <IconPhone className="h-4 w-4 text-[var(--color-sky)]" /> {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 font-semibold text-[var(--color-sky)] transition-colors hover:text-[var(--color-pink)]"
              >
                <IconWhatsApp className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <a
            href={SITE.builtByUrl}
            target="_blank"
            rel="noopener"
            className="text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-sky)]"
          >
            Built by <span className="font-semibold text-[var(--color-ink-soft)]">EDDIE NYAMBO</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
