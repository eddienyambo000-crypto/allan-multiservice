// Live RWF↔USD rate so the USD figures shown to buyers track the real market.
// Uses a free, key-less FX API, cached for 12h. Falls back gracefully.

/** Returns how many RWF = 1 USD right now, or null on failure. */
export async function getLiveUsdRate(): Promise<number | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 43200 }, // refresh every 12h
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { rates?: Record<string, number> };
    const rwf = data?.rates?.RWF;
    return typeof rwf === "number" && rwf > 0 ? rwf : null;
  } catch {
    return null;
  }
}
