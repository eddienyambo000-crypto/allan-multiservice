"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/leads";
import { SITE, waLink } from "@/lib/site";
import { IconWhatsApp, IconPhone } from "@/components/icons";

export default function InquiryForm({
  listingId,
  listingTitle,
  priceLabel,
}: {
  listingId: string;
  listingTitle: string;
  priceLabel: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Hi ${SITE.shortName}, I'm interested in "${listingTitle}". Is it still available?`);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const wa = waLink(message || `Hi ${SITE.shortName}, I'm interested in "${listingTitle}".`);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    await submitInquiry({ name, phone, message, listing_id: listingId, listing_title: listingTitle });
    setState("done");
    // Hand off to WhatsApp regardless so the lead reaches Allan instantly.
    window.open(wa, "_blank", "noopener");
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
      <p className="font-[family-name:var(--font-mono)] text-[0.62rem] uppercase tracking-wider text-[var(--color-sky)]">
        Interested?
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-ink)]">
        {priceLabel}
      </p>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]"
        />
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (+250 7XX XXX XXX)"
          className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition-[transform,opacity] duration-200 hover:-translate-y-0.5 disabled:opacity-60"
        >
          <IconWhatsApp className="h-4 w-4" />
          {state === "sending" ? "Sending…" : state === "done" ? "Opening WhatsApp…" : "Send via WhatsApp"}
        </button>
      </form>

      {state === "done" && (
        <p className="mt-3 rounded-lg bg-[var(--color-sky-soft)] px-3 py-2 text-xs text-[var(--color-sky-hover)]">
          Got it — we&apos;ve opened WhatsApp so you can hit send. We reply fast.
        </p>
      )}

      <a
        href={`tel:${SITE.phone}`}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-sky)]"
      >
        <IconPhone className="h-4 w-4 text-[var(--color-sky)]" /> Call {SITE.phoneDisplay}
      </a>
    </div>
  );
}
