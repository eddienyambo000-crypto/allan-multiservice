"use client";

import { useState } from "react";
import { submitAlert } from "@/lib/leads";
import { VERTICALS, SITE, waLink } from "@/lib/site";
import { FILTER_LOCATIONS } from "@/lib/locations";
import { useHoneypot } from "@/components/useHoneypot";
import type { Vertical } from "@/lib/types";
import { IconBell, IconCheck } from "@/components/icons";

/** New-listing alerts — the primary buyer lead magnet (replaces the seller funnel). */
export default function AlertsForm({ compact = false }: { compact?: boolean }) {
  const [vertical, setVertical] = useState<Vertical | "">("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const { field: honeypot, human } = useHoneypot();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!human()) { setState("done"); return; }
    setState("sending");
    const channel = contact.includes("@") ? "email" : "whatsapp";
    const res = await submitAlert({ channel, contact, vertical: vertical || null, location: location || null });
    const msg = `Hi ${SITE.shortName}, please alert me about new ${vertical || "listings"}${location ? ` in ${location}` : ""}. My contact: ${contact}`;
    // If the DB save failed and we can't fall back to WhatsApp, tell the truth.
    if (!res.ok && channel === "email") { setState("error"); return; }
    setState("done");
    if (channel === "whatsapp") window.open(waLink(msg), "_blank", "noopener");
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-white p-5 text-left shadow-[var(--shadow-soft)]" role="status" aria-live="polite">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E7F7EF] text-[#1FA971]"><IconCheck className="h-6 w-6" /></span>
        <div>
          <p className="font-semibold text-[var(--color-ink)]">You&apos;re on the list.</p>
          <p className="text-sm text-[var(--color-muted)]">We&apos;ll ping you the moment a match drops — before it hits the public feed.</p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-left" role="alert">
        <p className="font-semibold text-red-700">Hmm, that didn&apos;t go through.</p>
        <p className="mt-1 text-sm text-red-600">
          Please try again, or message us on{" "}
          <a className="font-semibold underline" target="_blank" rel="noopener" href={waLink(`Hi ${SITE.shortName}, please add me to new-listing alerts: ${contact}`)}>WhatsApp</a> and we&apos;ll add you.
        </p>
        <button onClick={() => setState("idle")} className="mt-3 rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-700">Try again</button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-3 ${compact ? "" : "rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6"}`}
    >
      {honeypot}
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
