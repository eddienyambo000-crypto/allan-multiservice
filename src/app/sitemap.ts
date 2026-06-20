import type { MetadataRoute } from "next";
import { SITE, VERTICALS, VERTICAL_BY_DB } from "@/lib/site";
import { LOCATIONS } from "@/lib/locations";
import { getAllSlugs } from "@/lib/listings";

const base = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/diaspora`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const verticalPages: MetadataRoute.Sitemap = VERTICALS.map((v) => ({
    url: `${base}${v.href}`,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Programmatic location landing pages across all verticals & all Rwanda.
  const locationPages: MetadataRoute.Sitemap = VERTICALS.flatMap((v) =>
    LOCATIONS.map((loc) => ({
      url: `${base}${v.href}/location/${loc.slug}`,
      changeFrequency: "weekly" as const,
      priority: loc.featured ? 0.7 : 0.5,
    }))
  );

  const slugs = await getAllSlugs();
  const listingPages: MetadataRoute.Sitemap = slugs.map((s) => ({
    url: `${base}${VERTICAL_BY_DB[s.vertical].href}/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : s.created_at ? new Date(s.created_at) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...verticalPages, ...locationPages, ...listingPages];
}
