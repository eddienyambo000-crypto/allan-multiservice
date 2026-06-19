"use client";

import { useState } from "react";
import { formatRWF, formatUSD, DEFAULT_USD_RATE } from "@/lib/money";
import { IconCalc } from "@/components/icons";

/** Rwanda land/property transfer tax: 0% on first RWF 10M, 5% above. */
export default function TransferTaxCalculator({ rate = DEFAULT_USD_RATE }: { rate?: number }) {
  const [price, setPrice] = useState<number>(85_000_000);
  const taxable = Math.max(0, price - 10_000_000);
  const tax = taxable * 0.05;
  const total = price + tax;

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-7">
      <p className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[0.62rem] uppercase tracking-wider text-[var(--color-sky)]">
        <IconCalc className="h-4 w-4" /> Transfer-tax calculator
      </p>
      <label className="mt-4 block">
        <span className="text-xs font-medium text-[var(--color-muted)]">Purchase price (RWF)</span>
        <input
          type="number"
          value={price || ""}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-1.5 w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-lg font-semibold text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-sky)]"
        />
      </label>
      <input
        type="range"
        min={5_000_000}
        max={500_000_000}
        step={5_000_000}
        value={Math.min(price, 500_000_000)}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--color-sky)]"
      />

      <dl className="mt-5 flex flex-col gap-2.5 text-sm">
        <Row label="Tax-free band (first RWF 10M)" value="RWF 0" />
        <Row label="Transfer tax (5% above 10M)" value={`${formatRWF(tax)}  ·  ${formatUSD(tax, rate)}`} />
        <div className="my-1 h-px bg-[var(--color-line)]" />
        <Row label="Estimated total cost" value={`${formatRWF(total)}  ·  ${formatUSD(total, rate)}`} strong />
      </dl>
      <p className="mt-4 text-xs text-[var(--color-muted)]">
        Estimate only. Notary and registration fees may apply. We confirm exact figures before you commit.
      </p>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[var(--color-muted)]">{label}</dt>
      <dd className={strong ? "font-bold text-[var(--color-sky)]" : "font-semibold text-[var(--color-ink)]"}>{value}</dd>
    </div>
  );
}
