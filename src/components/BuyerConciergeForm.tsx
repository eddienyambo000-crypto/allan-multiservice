"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/leads";
import { SITE, waLink } from "@/lib/site";
import { useHoneypot } from "@/components/useHoneypot";
import { IconCheck, IconSearch } from "@/components/icons";

/** Buyer concierge — "tell us what you want, we hunt it down free". */
export default function BuyerConciergeForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const { field: honeypot, human } = useHoneypot();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!human()) { setState("done"); return; }
    setState("sending");
    await submitInquiry({ name, phone, message, kind: "concierge" });
    setState("done");
    window.open(waLink(`Hi ${SITE.shortName}, I'm looking for: ${message} (Name: ${name}, Phone: ${phone})`), "_blank", "noopener");
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-8 text-center shadow-[var(--shadow-soft)]">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#E7F7EF] text-[#1FA971]"><IconCheck className="h-6 w-6" /></span>
        <h3 className="text-lg font-bold text-[var(--color-ink)]">On it — the hunt is live.</h3>
        <p className="max-w-sm text-sm text-[var(--color-muted)]">Our team will comb the market and come back with real matches. We&apos;ve opened WhatsApp so you can add any detail.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-7">
      {honeypot}
      <div className="grid gap-3 sm:grid-cols-2">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} />
        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+250 7XX XXX XXX" className={inputCls} />
      </div>
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="What are you after? e.g. '3-bed house to buy in Kanombe under RWF 90M' or 'Toyota Land Cruiser, 2018+, automatic'."
        className={`${inputCls} resize-none`}
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-sky)] px-6 py-3.5 text-sm font-semibold text-white transition-[transform,background,opacity] duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-sky-hover)] disabled:opacity-60"
      >
        <IconSearch className="h-4 w-4" /> {state === "sending" ? "Sending…" : "Find it for me — free"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]";
