"use client";

import { useState } from "react";
import Image from "next/image";
import { adminUpsert, adminUploadImage, slugify } from "@/lib/admin";
import { VERTICALS, KIGALI_AREAS } from "@/lib/site";
import type { Listing, Vertical, ListingType, ListingStatus } from "@/lib/types";

const empty: Partial<Listing> = {
  vertical: "property",
  listing_type: "sale",
  currency: "RWF",
  status: "available",
  featured: false,
  features: [],
  images: [],
  district: "Gasabo",
};

export default function ListingForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: Listing;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState<Partial<Listing>>(initial ?? empty);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: keyof Listing, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  const isResidential = f.vertical === "property" || f.vertical === "rental";
  const isLand = f.vertical === "land";
  const isCar = f.vertical === "car";

  const MAX_IMAGES = 10;

  async function handleImages(files: FileList | null) {
    if (!files?.length) return;
    const current = f.images ?? [];
    const room = MAX_IMAGES - current.length;
    if (room <= 0) { setErr(`Maximum ${MAX_IMAGES} photos. Remove one to add more.`); return; }
    const toAdd = Array.from(files).slice(0, room);
    setBusy(true);
    setErr("");
    try {
      const urls: string[] = [];
      for (const file of toAdd) urls.push(await adminUploadImage(file));
      set("images", [...current, ...urls]);
      if (Array.from(files).length > room) setErr(`Only the first ${room} were added — ${MAX_IMAGES} photo max.`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Image upload failed.");
    } finally {
      setBusy(false);
    }
  }

  function moveImage(from: number, dir: -1 | 1) {
    const imgs = [...(f.images ?? [])];
    const to = from + dir;
    if (to < 0 || to >= imgs.length) return;
    [imgs[from], imgs[to]] = [imgs[to], imgs[from]];
    set("images", imgs);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const price = Number(f.price) || 0;
      const priceLabel =
        f.price_label?.trim() ||
        `${f.currency} ${price.toLocaleString("en-US")}${f.listing_type === "rent" ? " / month" : ""}`;
      const payload: Partial<Listing> = {
        ...f,
        price,
        price_label: priceLabel,
        slug: f.slug?.trim() || slugify(`${f.title ?? "listing"}-${f.location ?? ""}`),
        title: f.title ?? "",
        location: f.location ?? "Kigali",
      };
      await adminUpsert(payload);
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{err}</p>}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Vertical">
          <select value={f.vertical} onChange={(e) => set("vertical", e.target.value as Vertical)} className={inputCls}>
            {VERTICALS.map((v) => <option key={v.vertical} value={v.vertical}>{v.label}</option>)}
          </select>
        </Field>
        <Field label="Listing type">
          <select value={f.listing_type} onChange={(e) => set("listing_type", e.target.value as ListingType)} className={inputCls}>
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>
        </Field>
      </div>

      <Field label="Title">
        <input required value={f.title ?? ""} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="Modern 4-Bedroom Villa in Kiyovu" />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Location / area">
          <input list="areas" value={f.location ?? ""} onChange={(e) => set("location", e.target.value)} className={inputCls} placeholder="Kiyovu" />
          <datalist id="areas">{KIGALI_AREAS.map((a) => <option key={a} value={a} />)}</datalist>
        </Field>
        <Field label="District">
          <input value={f.district ?? ""} onChange={(e) => set("district", e.target.value)} className={inputCls} placeholder="Nyarugenge" />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Price (number)">
          <input type="number" value={f.price ?? ""} onChange={(e) => set("price", Number(e.target.value))} className={inputCls} placeholder="280000000" />
        </Field>
        <Field label="Currency">
          <input value={f.currency ?? "RWF"} onChange={(e) => set("currency", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Status">
          <select value={f.status} onChange={(e) => set("status", e.target.value as ListingStatus)} className={inputCls}>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </Field>
      </div>

      {isResidential && (
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Bedrooms"><input type="number" value={f.bedrooms ?? ""} onChange={(e) => set("bedrooms", Number(e.target.value))} className={inputCls} /></Field>
          <Field label="Bathrooms"><input type="number" value={f.bathrooms ?? ""} onChange={(e) => set("bathrooms", Number(e.target.value))} className={inputCls} /></Field>
          <Field label="Area (m²)"><input type="number" value={f.area_sqm ?? ""} onChange={(e) => set("area_sqm", Number(e.target.value))} className={inputCls} /></Field>
          <Field label="Furnished">
            <select value={String(f.furnished ?? false)} onChange={(e) => set("furnished", e.target.value === "true")} className={inputCls}>
              <option value="false">No</option><option value="true">Yes</option>
            </select>
          </Field>
        </div>
      )}

      {isLand && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Area (m²)"><input type="number" value={f.area_sqm ?? ""} onChange={(e) => set("area_sqm", Number(e.target.value))} className={inputCls} /></Field>
          <Field label="Zoning"><input value={f.zoning ?? ""} onChange={(e) => set("zoning", e.target.value)} className={inputCls} placeholder="Residential" /></Field>
          <Field label="Title status"><input value={f.title_status ?? ""} onChange={(e) => set("title_status", e.target.value)} className={inputCls} placeholder="Freehold Title" /></Field>
        </div>
      )}

      {(isLand || isResidential) && (
        <Field label="Tenure (shown to diaspora buyers)">
          <select value={f.tenure ?? ""} onChange={(e) => set("tenure", e.target.value)} className={inputCls}>
            <option value="">Not specified</option>
            <option value="Freehold">Freehold</option>
            <option value="Leasehold (99yr)">Leasehold (99yr)</option>
            <option value="Leasehold (49yr)">Leasehold (49yr)</option>
          </select>
        </Field>
      )}

      {isCar && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Make"><input value={f.make ?? ""} onChange={(e) => set("make", e.target.value)} className={inputCls} placeholder="Toyota" /></Field>
            <Field label="Model"><input value={f.model ?? ""} onChange={(e) => set("model", e.target.value)} className={inputCls} placeholder="RAV4" /></Field>
            <Field label="Year"><input type="number" value={f.year ?? ""} onChange={(e) => set("year", Number(e.target.value))} className={inputCls} placeholder="2019" /></Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Field label="Mileage (km)"><input type="number" value={f.mileage_km ?? ""} onChange={(e) => set("mileage_km", Number(e.target.value))} className={inputCls} /></Field>
            <Field label="Transmission"><input value={f.transmission ?? ""} onChange={(e) => set("transmission", e.target.value)} className={inputCls} placeholder="Automatic" /></Field>
            <Field label="Fuel"><input value={f.fuel_type ?? ""} onChange={(e) => set("fuel_type", e.target.value)} className={inputCls} placeholder="Petrol" /></Field>
            <Field label="Body type"><input value={f.body_type ?? ""} onChange={(e) => set("body_type", e.target.value)} className={inputCls} placeholder="SUV" /></Field>
          </div>
        </>
      )}

      <Field label="Description">
        <textarea value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={4} className={inputCls} />
      </Field>

      <Field label="Features (comma-separated)">
        <input
          value={(f.features ?? []).join(", ")}
          onChange={(e) => set("features", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          className={inputCls}
          placeholder="Swimming Pool, Garden, 24/7 Security"
        />
      </Field>

      <Field label="Video tour URL (YouTube/Vimeo — optional)">
        <input value={f.video_url ?? ""} onChange={(e) => set("video_url", e.target.value)} className={inputCls} placeholder="https://youtu.be/…" />
      </Field>

      {/* Images — up to 10, reorderable, first is the cover */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--color-muted)]">
            Photos ({(f.images ?? []).length}/{MAX_IMAGES}) — first photo is the cover
          </span>
          <label className={`cursor-pointer rounded-lg border border-[var(--color-sky)] px-3 py-1.5 text-xs font-semibold text-[var(--color-sky)] ${busy ? "opacity-50" : "hover:bg-[var(--color-sky-soft)]"}`}>
            {busy ? "Uploading…" : "+ Add photos"}
            <input type="file" accept="image/*" multiple disabled={busy} onChange={(e) => { handleImages(e.target.files); e.target.value = ""; }} className="hidden" />
          </label>
        </div>
        {(f.images ?? []).length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {(f.images ?? []).map((src, i) => (
              <div key={src + i} className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--color-line)]">
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                {i === 0 && <span className="absolute left-1 top-1 rounded bg-[var(--color-sky)] px-1.5 py-0.5 text-[0.55rem] font-bold uppercase text-white">Cover</span>}
                <button type="button" onClick={() => set("images", (f.images ?? []).filter((_, j) => j !== i))} className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-xs text-white" aria-label="Remove photo">×</button>
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/45 px-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="px-1 text-white disabled:opacity-30" aria-label="Move left">‹</button>
                  <button type="button" onClick={() => moveImage(i, 1)} disabled={i === (f.images ?? []).length - 1} className="px-1 text-white disabled:opacity-30" aria-label="Move right">›</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
        <input type="checkbox" checked={!!f.featured} onChange={(e) => set("featured", e.target.checked)} />
        Featured (show on homepage)
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={busy} className="rounded-xl bg-[var(--color-sky)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-sky-hover)] disabled:opacity-60">
          {busy ? "Saving…" : initial ? "Update listing" : "Create listing"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-[var(--color-line)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)]">
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-sky)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-[family-name:var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--color-muted)]">{label}</span>
      {children}
    </label>
  );
}
