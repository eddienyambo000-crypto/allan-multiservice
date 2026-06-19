"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { adminGetSettings, adminSaveSettings, adminUploadImage } from "@/lib/admin";
import type { SiteSettings } from "@/lib/types";

export default function SettingsTab() {
  const [s, setS] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const set = (k: keyof SiteSettings, v: unknown) => setS((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    adminGetSettings().then((d) => { setS(d); setLoading(false); }).catch((e) => { setErr(String(e)); setLoading(false); });
  }, []);

  async function upload(kind: "logo" | "hero", file?: File) {
    if (!file) return;
    setBusy(true); setErr(""); setMsg("");
    try {
      const url = await adminUploadImage(file, "branding");
      if (kind === "logo") set("logo_url", url);
      else { set("hero_media_url", url); set("hero_media_type", file.type.startsWith("video") ? "video" : "image"); }
    } catch (e) { setErr(e instanceof Error ? e.message : "Upload failed."); }
    finally { setBusy(false); }
  }

  async function save() {
    setBusy(true); setErr(""); setMsg("");
    try { await adminSaveSettings(s); setMsg("Saved! Changes appear on the site within a few minutes."); }
    catch (e) { setErr(e instanceof Error ? e.message : "Save failed."); }
    finally { setBusy(false); }
  }

  if (loading) return <p className="text-sm text-[var(--color-muted)]">Loading settings…</p>;

  return (
    <div className="flex flex-col gap-6">
      {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>}
      {msg && <p className="rounded-lg bg-[#E7F7EF] px-3 py-2 text-sm text-[#1FA971]">{msg}</p>}

      {/* Logo */}
      <Card title="Logo" hint="Upload your logo (PNG with transparent background works best). Until then a text logo is used.">
        <div className="flex flex-wrap items-center gap-4">
          {s.logo_url ? (
            <div className="relative h-12 w-40 overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)]">
              <Image src={s.logo_url} alt="Logo" fill className="object-contain p-1" />
            </div>
          ) : <span className="text-sm text-[var(--color-muted)]">No logo set</span>}
          <label className="cursor-pointer rounded-lg border border-[var(--color-sky)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sky)] hover:bg-[var(--color-sky-soft)]">
            Upload logo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => upload("logo", e.target.files?.[0])} />
          </label>
          {s.logo_url && <button onClick={() => set("logo_url", null)} className="text-xs font-semibold text-red-500">Remove</button>}
        </div>
      </Card>

      {/* Hero */}
      <Card title="Homepage hero background" hint="Choose a gradient, or upload a photo or video. A dark overlay keeps the headline readable on anything.">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {(["gradient", "image", "video"] as const).map((t) => (
              <button key={t} onClick={() => set("hero_media_type", t)} className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${s.hero_media_type === t ? "bg-[var(--color-sky)] text-white" : "border border-[var(--color-line)] text-[var(--color-ink-soft)]"}`}>{t}</button>
            ))}
          </div>
          {s.hero_media_type !== "gradient" && (
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer rounded-lg border border-[var(--color-sky)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sky)] hover:bg-[var(--color-sky-soft)]">
                {busy ? "Uploading…" : `Upload ${s.hero_media_type}`}
                <input type="file" accept={s.hero_media_type === "video" ? "video/*" : "image/*"} className="hidden" onChange={(e) => upload("hero", e.target.files?.[0])} />
              </label>
              {s.hero_media_url && <span className="max-w-xs truncate text-xs text-[var(--color-muted)]">{s.hero_media_url}</span>}
            </div>
          )}
          <Input label="Headline" value={s.hero_headline ?? ""} onChange={(v) => set("hero_headline", v)} placeholder="Find your place in Rwanda." />
          <Input label="Sub-text" value={s.hero_subtext ?? ""} onChange={(v) => set("hero_subtext", v)} />
        </div>
      </Card>

      {/* Contact + USD */}
      <Card title="Contact & pricing">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Phone" value={s.phone ?? ""} onChange={(v) => set("phone", v)} placeholder="+250…" />
          <Input label="WhatsApp number (no +)" value={s.whatsapp ?? ""} onChange={(v) => set("whatsapp", v)} placeholder="250…" />
          <Input label="Email" value={s.email ?? ""} onChange={(v) => set("email", v)} />
          <Input label="USD rate (1 USD = ? RWF)" value={String(s.usd_rate ?? "")} onChange={(v) => set("usd_rate", Number(v) || null)} placeholder="1330" />
          <div className="sm:col-span-2"><Input label="Trust line (footer)" value={s.rdb_line ?? ""} onChange={(v) => set("rdb_line", v)} placeholder="RDB-registered · Licensed agents · Verified listings" /></div>
        </div>
      </Card>

      <button onClick={save} disabled={busy} className="self-start rounded-xl bg-[var(--color-sky)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-sky-hover)] disabled:opacity-60">
        {busy ? "Saving…" : "Save settings"}
      </button>
    </div>
  );
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <h3 className="text-base font-semibold text-[var(--color-ink)]">{title}</h3>
      {hint && <p className="mb-4 mt-1 text-xs text-[var(--color-muted)]">{hint}</p>}
      <div className={hint ? "" : "mt-4"}>{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-[family-name:var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--color-muted)]">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-sky)]" />
    </label>
  );
}
