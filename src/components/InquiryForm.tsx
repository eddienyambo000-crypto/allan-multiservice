"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/leads";
import { SITE } from "@/lib/site";
import { useSettings } from "@/components/SettingsProvider";
import { compactUSD, formatUSD } from "@/lib/money";
import type { Listing } from "@/lib/types";
import { useHoneypot } from "@/components/useHoneypot";
import { IconWhatsApp, IconPhone, IconVideo } from "@/components/icons";

export default function InquiryForm({
  listing,
  rate,
}: {
  listing: Pick<Listing, "id" | "title" | "price" | "price_label" | "listing_type">;
  rate: number;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Hi ${SITE.shortName}, I'm interested in "${listing.title}". Is it still available?`);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const { field: honeypot, human } = useHoneypot();
  const { wa, phone: ownerPhone } = useSettings();

  async function send(kind: "inquiry" | "video_tour", waMessage: string) {
    if (!human()) { setState("done"); return; }
    setState("sending");
    await submitInquiry({ name, phone, message: waMessage, listing_id: listing.id, listing_title: listing.title, kind });
    setState("done");
    window.open(wa(waMessage), "_blank", "noopener");
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
      <p className="font-[family-name:var(--font-mono)] text-[0.62rem] uppercase tracking-wider text-[var(--color-sky)]">Interested?</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-sky)]">{listing.price_label}</p>
      <p className="text-sm font-medium text-[var(--color-muted)]">
        ≈ {formatUSD(listing.price, rate)}{listing.listing_type === "rent" ? " /mo" : ""} <span className="opacity-60">({compactUSD(listing.price, rate)})</span>
      </p>

      <form onSubmit={(e) => { e.preventDefault(); send("inquiry", message); }} className="mt-5 flex flex-col gap-3">
        {honeypot}
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} />
        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (+250 7XX XXX XXX)" className={inputCls} />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
        <button type="submit" disabled={state === "sending"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition-[transform,opacity] duration-200 hover:-translate-y-0.5 disabled:opacity-60">
          <IconWhatsApp className="h-4 w-4" />
          {state === "sending" ? "Sending…" : state === "done" ? "Opening WhatsApp…" : "Send via WhatsApp"}
        </button>
      </form>

      {state === "done" && (
        <p className="mt-3 rounded-lg bg-[var(--color-sky-soft)] px-3 py-2 text-xs text-[var(--color-sky-hover)]">Got it — we&apos;ve opened WhatsApp so you can hit send. We reply fast.</p>
      )}

      <button
        onClick={() => send("video_tour", `Hi ${SITE.shortName}, I'd like a video tour of "${listing.title}" before viewing in person. My name is ${name || "(name)"}.`)}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-sky)] bg-[var(--color-sky-soft)] px-5 py-3 text-sm font-semibold text-[var(--color-sky-hover)] transition-colors hover:bg-[var(--color-sky)] hover:text-white"
      >
        <IconVideo className="h-4 w-4" /> Request a video tour
      </button>

      <a href={`tel:${ownerPhone}`} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-sky)]">
        <IconPhone className="h-4 w-4 text-[var(--color-sky)]" /> Call {SITE.phoneDisplay}
      </a>

      <p className="mt-4 text-center text-xs text-[var(--color-muted)]">Buying from abroad? <a href="/diaspora" className="font-semibold text-[var(--color-sky)]">See our remote-buying guide →</a></p>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]";
