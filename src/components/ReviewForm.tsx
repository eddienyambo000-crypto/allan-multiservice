"use client";

import { useState } from "react";
import { submitTestimonial } from "@/lib/testimonials";
import { IconStar, IconCheck } from "@/components/icons";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    await submitTestimonial({ name, role, quote, rating });
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#E7F7EF] text-[#1FA971]"><IconCheck className="h-7 w-7" /></span>
        <h2 className="text-2xl font-bold text-[var(--color-ink)]">Thank you! 🙏</h2>
        <p className="max-w-sm text-[var(--color-muted)]">Your review means a lot. We&apos;ll add it to the site once we&apos;ve had a quick look.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div>
        <p className="mb-2 font-[family-name:var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--color-muted)]">Your rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)} aria-label={`${n} stars`}
              className="text-[var(--color-pink)] transition-transform hover:scale-110">
              <IconStar className="h-7 w-7" {...((hover || rating) >= n ? { fill: "currentColor" } : {})} />
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input value={name} onChange={setName} placeholder="Your name" required />
        <Input value={role} onChange={setRole} placeholder="e.g. Bought a home in Kibagabaga" />
      </div>
      <textarea required value={quote} onChange={(e) => setQuote(e.target.value)} rows={4} placeholder="How was your experience with Allan Multiservice Group?"
        className="w-full resize-none rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]" />
      <button type="submit" disabled={state === "sending"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-sky)] px-6 py-3.5 text-sm font-semibold text-white transition-[transform,background,opacity] duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-sky-hover)] disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Submit review"}
      </button>
    </form>
  );
}

function Input({ value, onChange, placeholder, required }: { value: string; onChange: (v: string) => void; placeholder: string; required?: boolean }) {
  return (
    <input required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]" />
  );
}
