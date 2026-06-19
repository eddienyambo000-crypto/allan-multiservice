"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminTestimonials, adminSetTestimonialApproved, adminDeleteTestimonial,
  adminAddTestimonial, triggerRevalidate,
} from "@/lib/admin";
import type { Testimonial } from "@/lib/types";
import { IconStar } from "@/components/icons";

export default function ReviewsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", quote: "", rating: 5 });

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try { setItems(await adminTestimonials()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed to load."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function act(fn: () => Promise<void>) {
    try { await fn(); await triggerRevalidate(); load(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Action failed."); }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await act(() => adminAddTestimonial(form));
    setForm({ name: "", role: "", quote: "", rating: 5 });
    setAdding(false);
  }

  if (loading) return <p className="text-sm text-[var(--color-muted)]">Loading reviews…</p>;

  const pending = items.filter((t) => !t.approved);
  return (
    <div className="flex flex-col gap-4">
      {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>}

      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted)]">{items.length} reviews · {pending.length} awaiting approval</p>
        <button onClick={() => setAdding((v) => !v)} className="rounded-full bg-[var(--color-pink)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-pink)] transition-transform hover:-translate-y-0.5">
          {adding ? "Close" : "+ Add review"}
        </button>
      </div>

      {adding && (
        <form onSubmit={add} className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)]">
          <div className="grid gap-3 sm:grid-cols-2">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer name" className={inp} />
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Bought in Kanombe" className={inp} />
          </div>
          <textarea required rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} placeholder="Their words…" className={`${inp} resize-none`} />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-muted)]">Rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className="text-[var(--color-pink)]" aria-label={`${n} stars`}>
                <IconStar className="h-5 w-5" {...(form.rating >= n ? { fill: "currentColor" } : {})} />
              </button>
            ))}
          </div>
          <button type="submit" className="self-start rounded-xl bg-[var(--color-sky)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-sky-hover)]">Publish review</button>
        </form>
      )}

      {items.length === 0 ? (
        <p className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-10 text-center text-sm text-[var(--color-muted)]">
          No reviews yet. Share your <b>/review</b> link with happy clients, or add one above. Reviews only show on the site once approved.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((t) => (
            <div key={t.id} className={`rounded-[var(--radius-card)] border bg-white p-4 ${t.approved ? "border-[var(--color-line)]" : "border-[color-mix(in_srgb,var(--color-pink)_45%,transparent)] shadow-[var(--shadow-soft)]"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--color-ink)]">{t.name}</span>
                    <span className="flex text-[var(--color-pink)]">{Array.from({ length: Math.max(1, Math.min(5, t.rating)) }).map((_, k) => <IconStar key={k} className="h-3.5 w-3.5" fill="currentColor" />)}</span>
                    {!t.approved && <span className="rounded-full bg-[var(--color-pink-soft)] px-2 py-0.5 text-[0.6rem] font-bold uppercase text-[var(--color-pink-hover)]">Pending</span>}
                  </div>
                  {t.role && <p className="text-xs text-[var(--color-muted)]">{t.role}</p>}
                  <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">“{t.quote}”</p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button onClick={() => act(() => adminSetTestimonialApproved(t.id, !t.approved))} className="rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink)] hover:border-[var(--color-sky)]">
                    {t.approved ? "Unpublish" : "Approve"}
                  </button>
                  <button onClick={() => confirm("Delete this review?") && act(() => adminDeleteTestimonial(t.id))} className="rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-xs font-semibold text-red-500 hover:border-red-400">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inp = "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-sky)]";
