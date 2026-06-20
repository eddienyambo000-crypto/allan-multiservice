import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Refreshes public caches after an admin change. Rejects anonymous callers:
 * requires a valid Supabase session token (the admin's), so randoms can't spam it.
 * Revalidation only refreshes caches — never destructive.
 */
export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || !url || !anon) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const sb = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  (revalidateTag as unknown as (tag: string) => void)("listings");
  (revalidateTag as unknown as (tag: string) => void)("testimonials");
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
