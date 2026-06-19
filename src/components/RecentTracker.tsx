"use client";

import { useEffect } from "react";
import { pushRecent } from "@/lib/favorites";

/** Records this listing as recently viewed (localStorage). Renders nothing. */
export default function RecentTracker({ slug }: { slug: string }) {
  useEffect(() => { pushRecent(slug); }, [slug]);
  return null;
}
