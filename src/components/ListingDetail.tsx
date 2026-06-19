import Link from "next/link";
import type { Listing } from "@/lib/types";
import { VERTICAL_BY_DB, SITE } from "@/lib/site";
import { specChips } from "@/lib/format";
import { getRelated } from "@/lib/listings";
import { getSettings, usdRate } from "@/lib/settings";
import { listingSchema, breadcrumbSchema } from "@/lib/schema";
import Gallery from "@/components/Gallery";
import InquiryForm from "@/components/InquiryForm";
import ListingCard from "@/components/ListingCard";
import JsonLd from "@/components/JsonLd";
import PriceTag from "@/components/PriceTag";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButton from "@/components/ShareButton";
import RecentTracker from "@/components/RecentTracker";
import { IconPin, IconCheck, IconShield, IconVideo } from "@/components/icons";

export default async function ListingDetail({ listing }: { listing: Listing }) {
  const meta = VERTICAL_BY_DB[listing.vertical];
  const chips = specChips(listing);
  const [related, settings] = await Promise.all([getRelated(listing, 3), getSettings()]);
  const rate = usdRate(settings);
  const crumb = [
    { name: "Home", url: SITE.url },
    { name: meta.short, url: `${SITE.url}${meta.href}` },
    { name: listing.title, url: `${SITE.url}${meta.href}/${listing.slug}` },
  ];

  return (
    <div className="container-x pt-28 pb-20 sm:pt-32">
      <JsonLd data={listingSchema(listing)} />
      <JsonLd data={breadcrumbSchema(crumb)} />
      <RecentTracker slug={listing.slug} />

      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-muted)]">
        <Link href="/" className="hover:text-[var(--color-sky)]">Home</Link>
        <span>/</span>
        <Link href={meta.href} className="hover:text-[var(--color-sky)]">{meta.short}</Link>
        <span>/</span>
        <span className="text-[var(--color-ink-soft)]">{listing.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="relative">
            <Gallery images={listing.images} title={listing.title} />
            <FavoriteButton slug={listing.slug} size="lg" className="absolute right-3 top-3 shadow-md" />
          </div>

          <div className="mt-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--color-sky-soft)] px-3 py-1 font-[family-name:var(--font-mono)] text-[0.62rem] font-medium uppercase tracking-wider text-[var(--color-sky-hover)]">
                  {listing.listing_type === "rent" ? "For Rent" : "For Sale"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F7EF] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-[#1FA971]">
                  <IconShield className="h-3 w-3" /> Verified
                </span>
                {listing.tenure && (
                  <span className="rounded-full bg-[var(--color-pink-soft)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-[var(--color-pink-hover)]">{listing.tenure}</span>
                )}
              </div>
              <ShareButton title={listing.title} />
            </div>

            <h1 className="mt-3 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight text-[var(--color-ink)]">{listing.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
              <IconPin className="h-4 w-4 text-[var(--color-sky)]" /> {listing.location}, {listing.district}, Rwanda
            </p>
            <div className="mt-4 lg:hidden"><PriceTag listing={listing} rate={rate} size="detail" /></div>

            {chips.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {chips.map((c) => (
                  <div key={c.label} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3">
                    <p className="font-[family-name:var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--color-muted)]">{c.label}</p>
                    <p className="mt-0.5 font-semibold text-[var(--color-ink)]">{c.value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">Description</h2>
              <p className="mt-3 leading-relaxed text-[var(--color-ink-soft)]">{listing.description}</p>
            </div>

            {listing.video_url && (
              <div className="mt-8">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-ink)]"><IconVideo className="h-5 w-5 text-[var(--color-sky)]" /> Video tour</h2>
                <div className="mt-3 aspect-video overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-black">
                  <iframe src={toEmbed(listing.video_url)} title={`${listing.title} video tour`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
              </div>
            )}

            {listing.features.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-[var(--color-ink)]">Features</h2>
                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {listing.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-[var(--color-ink-soft)]">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-sky-soft)] text-[var(--color-sky)]"><IconCheck className="h-3 w-3" /></span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <InquiryForm listing={listing} rate={rate} />
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-xl font-bold text-[var(--color-ink)]">More {meta.short.toLowerCase()} you might like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((l) => <ListingCard key={l.id} listing={l} usdRate={rate} />)}
          </div>
        </section>
      )}
    </div>
  );
}

/** Convert a YouTube/Vimeo watch URL to an embeddable URL (best-effort). */
function toEmbed(url: string): string {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}
