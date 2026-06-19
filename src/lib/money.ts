// Money formatting — RWF primary with a USD equivalent for diaspora buyers.

/** Fallback RWF→USD rate (June 2026 ≈ 1,330). Overridden by site_settings.usd_rate. */
export const DEFAULT_USD_RATE = 1330;

export function formatRWF(amount: number): string {
  return `RWF ${Math.round(amount).toLocaleString("en-US")}`;
}

export function formatUSD(amountRWF: number, rate = DEFAULT_USD_RATE): string {
  const usd = amountRWF / rate;
  return `$${Math.round(usd).toLocaleString("en-US")}`;
}

/** "$24k" style compact for cards. */
export function compactUSD(amountRWF: number, rate = DEFAULT_USD_RATE): string {
  const usd = amountRWF / rate;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(usd >= 10_000_000 ? 0 : 1)}M`;
  if (usd >= 1000) return `$${Math.round(usd / 1000)}k`;
  return `$${Math.round(usd)}`;
}
