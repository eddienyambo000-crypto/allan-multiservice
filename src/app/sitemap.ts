import type { MetadataRoute } from "next";
import { SITE, VERTICALS, KIGALI_AREAS } from "@/lib/site";
import { VERTICAL_BY_DB } from "@/lib/site";
import { getAllSlugs } from "@/lib/listings";

const base = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/sell`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const verticalPages: MetadataRoute.Sitemap = VERTICALS.map((v) => ({
    url: `${base}${v.href}`,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Programmatic location landing pages (residential verticals)
  const locationPages: MetadataRoute.Sitemap = ["/properties", "/rentals"].flatMap((href) =>
    KIGALI_AREAS.map((area) => ({
      url: `${base}${href}/kigali/${area.toLowerCase().replace(/\s+/g, "-")}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  const slugs = await getAllSlugs();
  const listingPages: MetadataRoute.Sitemap = slugs.map((s) => ({
    url: `${base}${VERTICAL_BY_DB[s.vertical].href}/${s.slug}`,
    lastModified: s.created_at ? new Date(s.created_at) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...verticalPages, ...locationPages, ...listingPages];
}
