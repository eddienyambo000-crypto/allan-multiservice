import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Called by the admin after a listing/settings change so updates appear on the
 * live site immediately instead of waiting for the time-based cache. Revalidation
 * only refreshes caches — it's not destructive — so it's safe to call openly.
 */
export async function POST() {
  // Bust the unstable_cache "listings" data tag (single-arg legacy call).
  (revalidateTag as unknown as (tag: string) => void)("listings");
  // Refresh every page under the root layout.
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
