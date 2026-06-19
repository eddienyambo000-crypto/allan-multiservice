"use client";

import { useState } from "react";
import { submitAlert } from "@/lib/leads";
import { VERTICALS, SITE, waLink } from "@/lib/site";
import { FILTER_LOCATIONS } from "@/lib/locations";
import type { Vertical } from "@/lib/types";
import { IconBell, IconCheck } from "@/components/icons";

/** New-listing alerts — the primary buyer lead magnet (replaces the seller funnel). */
export default function AlertsForm({ compact = false }: { compact?: boolean }) {
  const [vertical, setVertical] = useState<Vertical | "">("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const channel = contact.includes("@") ? "email" : "whatsapp";
    await submitAlert({ channel, contact, vertical: vertical || null, location: location || null });
    setState("done");
    const msg = `Hi ${SITE.shortName}, please alert me about new ${vertical || "listings"}${location ? ` in ${location}` : ""}. My contact: ${contact}`;
    if (channel === "whatsapp") window.open(waLink(msg), "_blank", "noopener");
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-5 text-left shadow-[var(--shadow-soft)]">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E7F7EF] text-[#1FA971]"><IconCheck className="h-6 w-6" /></span>
        <div>
          <p className="font-semibold text-[var(--color-ink)]">You&apos;re on the list.</p>
          <p className="text-sm text-[var(--color-muted)]">We&apos;ll ping you the moment a match drops — before it hits the public feed.</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-3 ${compact ? "" : "rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6"}`}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <select value={vertical} onChange={(e) => setVertical(e.target.value as Vertical)} className={selectCls}>
          <option value="">Any category</option>
          {VERTICALS.map((v) => <option key={v.key} value={v.vertical}>{v.short}</option>)}
        </select>
        <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectCls}>
          <option value="">Anywhere in Rwanda</option>
          {FILTER_LOCATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="WhatsApp number or email"
          className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--color-pink)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-pink)] transition-[transform,opacity] duration-200 hover:-translate-y-0.5 disabled:opacity-60"
        >
          <IconBell className="h-4 w-4" /> {state === "sending" ? "Saving…" : "Alert me"}
        </button>
      </div>
      <p className="text-xs text-[var(--color-muted)]">Free. No spam. Unsubscribe anytime — just reply STOP.</p>
    </form>
  );
}

const selectCls =
  "w-full cursor-pointer appearance-none rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-sky)]";
