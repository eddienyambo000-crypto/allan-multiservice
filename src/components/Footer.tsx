import Link from "next/link";
import Image from "next/image";
import { SITE, VERTICALS } from "@/lib/site";
import { FEATURED_LOCATIONS } from "@/lib/locations";
import { getSettings } from "@/lib/settings";
import { IconWhatsApp, IconPin, IconPhone, IconArrow, IconInstagram, IconTikTok } from "@/components/icons";

export default async function Footer() {
  const settings = await getSettings();
  const popular = FEATURED_LOCATIONS.slice(0, 8);
  const link = "text-sm text-white/65 transition-colors hover:text-white";

  return (
    <footer className="bg-[var(--color-ink)] text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            {settings.logo_url ? (
              <Image src={settings.logo_url} alt={SITE.name} width={150} height={40} className="h-9 w-auto object-contain" />
            ) : (
              <>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-sky)] font-[family-name:var(--font-display)] text-base font-bold text-white">A</span>
                <span className="font-[family-name:var(--font-display)] text-[1.05rem] font-bold text-white">
                  ALLAN<span className="text-[var(--color-sky)]"> Multiservice</span>
                </span>
              </>
            )}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            Rwanda&apos;s first verified marketplace for property, land, and cars — for buyers at home and in the diaspora. No ghost listings.
          </p>
          <a href={`https://wa.me/${settings.whatsapp ?? SITE.whatsapp}`} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
            <IconWhatsApp className="h-4 w-4" /> Chat on WhatsApp
          </a>
          <div className="mt-5 flex items-center gap-2.5">
            <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-[var(--color-pink)] hover:text-[var(--color-pink)]"><IconInstagram className="h-[18px] w-[18px]" /></a>
            <a href={SITE.tiktok} target="_blank" rel="noopener" aria-label="TikTok" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"><IconTikTok className="h-[18px] w-[18px]" /></a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Browse</p>
          <ul className="flex flex-col gap-3">
            {VERTICALS.map((v) => (
              <li key={v.key}><Link href={v.href} className={link}>{v.label}</Link></li>
            ))}
            <li><Link href="/diaspora" className={link}>Buying from Abroad</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Popular searches</p>
          <ul className="flex flex-col gap-3">
            {popular.map((l) => (
              <li key={l.slug}><Link href={`/properties/location/${l.slug}`} className={link}>Houses in {l.name}</Link></li>
            ))}
            <li><Link href="/about" className={link}>About</Link></li>
            <li><Link href="/contact" className={link}>Contact</Link></li>
            <li><Link href="/review" className={link}>Leave a review</Link></li>
            <li><Link href="/privacy" className={link}>Privacy</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Get in touch</p>
          <ul className="flex flex-col gap-3 text-sm text-white/65">
            <li className="flex items-center gap-2"><IconPin className="h-4 w-4 text-[var(--color-sky)]" /> {SITE.address}</li>
            <li>
              <a href={`tel:${settings.phone ?? SITE.phone}`} className="flex items-center gap-2 transition-colors hover:text-white">
                <IconPhone className="h-4 w-4 text-[var(--color-sky)]" /> {SITE.phoneDisplay}
              </a>
            </li>
          </ul>
          {settings.rdb_line && (
            <p className="mt-5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/55">{settings.rdb_line}</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/45">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <a
            href={SITE.builtByUrl}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-xs text-white/60 transition-colors hover:border-[var(--color-sky)] hover:text-white"
          >
            Designed &amp; built by <span className="font-semibold text-white/90">Eddie Nyambo</span>
            <IconArrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
