"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/leads";
import { SITE, waLink } from "@/lib/site";
import { useHoneypot } from "@/components/useHoneypot";
import { IconCheck } from "@/components/icons";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const { field: honeypot, human } = useHoneypot();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!human()) { setState("done"); return; }
    setState("sending");
    await submitInquiry({ name, phone, message });
    setState("done");
    const msg = `Hi ${SITE.shortName}, my name is ${name}. ${message}`;
    window.open(waLink(msg), "_blank", "noopener");
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#E7F7EF] text-[#1FA971]">
          <IconCheck className="h-6 w-6" />
        </span>
        <h2 className="text-xl font-bold text-[var(--color-ink)]">Message sent!</h2>
        <p className="max-w-sm text-sm text-[var(--color-muted)]">
          We&apos;ve opened WhatsApp so you can hit send. We reply to every message — usually within the hour.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8"
    >
      {honeypot}
      <div className="grid gap-3 sm:grid-cols-2">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
          className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]" />
        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+250 7XX XXX XXX"
          className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]" />
      </div>
      <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
        placeholder="What are you looking for? Type, area, budget, timeline…"
        className="w-full resize-none rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]" />
      <button type="submit" disabled={state === "sending"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-sky)] px-5 py-3.5 text-sm font-semibold text-white transition-[transform,background,opacity] duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-sky-hover)] disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
