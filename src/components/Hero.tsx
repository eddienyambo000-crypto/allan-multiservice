import Image from "next/image";
import HeroSearch from "@/components/HeroSearch";
import Reveal from "@/components/Reveal";
import { IconShield, IconCheck, IconGlobe } from "@/components/icons";
import type { SiteSettings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/settings";

/**
 * Sky-led hero with an admin-configurable background:
 * gradient (default) · image · video. A dark sky overlay keeps text legible
 * on any media, so owners can drop in anything without breaking contrast.
 */
export default function Hero({ settings }: { settings: SiteSettings }) {
  const headline = settings.hero_headline || DEFAULT_SETTINGS.hero_headline!;
  const subtext = settings.hero_subtext || DEFAULT_SETTINGS.hero_subtext!;
  const type = settings.hero_media_type ?? "gradient";

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background layer */}
      <div aria-hidden className="absolute inset-0 -z-20">
        {type === "video" && settings.hero_media_url ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={settings.hero_poster_url ?? undefined}
          >
            <source src={settings.hero_media_url} />
          </video>
        ) : type === "image" && settings.hero_media_url ? (
          <Image src={settings.hero_media_url} alt="" fill priority className="object-cover" sizes="100vw" />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(120% 120% at 0% 0%, #1AA0F0 0%, #0C8CE0 38%, #0A6FC0 70%, #064E8C 100%)",
            }}
          />
        )}
      </div>

      {/* Legibility + brand overlay */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,38,68,0.42) 0%, rgba(6,38,68,0.30) 45%, rgba(6,38,68,0.62) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage: "radial-gradient(80% 70% at 50% 0%, #000 0%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(80% 70% at 50% 0%, #000 0%, transparent 78%)",
        }}
      />

      <div className="container-x relative pt-32 pb-16 text-center sm:pt-40 sm:pb-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-pink)]" />
            Rwanda&apos;s first verified marketplace
          </span>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-[clamp(2.6rem,7vw,5.4rem)] font-bold leading-[1.02] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.18)]">
            {headline}
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-white/85 sm:text-lg">
            {subtext}
          </p>
        </Reveal>
        <Reveal delay={180}>
          <div className="mt-10">
            <HeroSearch />
          </div>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/85">
            <span className="inline-flex items-center gap-1.5"><IconShield className="h-4 w-4" /> Physically verified</span>
            <span className="inline-flex items-center gap-1.5"><IconCheck className="h-4 w-4" /> Clear titles &amp; papers</span>
            <span className="inline-flex items-center gap-1.5"><IconGlobe className="h-4 w-4" /> Diaspora-friendly · USD pricing</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
