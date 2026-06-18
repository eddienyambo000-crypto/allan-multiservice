"use client";

import { useState } from "react";
import { submitSellerLead } from "@/lib/leads";
import { SITE, waLink, VERTICALS } from "@/lib/site";
import type { Vertical } from "@/lib/types";
import { IconWhatsApp, IconCheck } from "@/components/icons";

export default function SellForm() {
  const [vertical, setVertical] = useState<Vertical>("property");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [assetTitle, setAssetTitle] = useState("");
  const [details, setDetails] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    await submitSellerLead({ vertical, name, phone, asset_title: assetTitle, details });
    setState("done");
    const msg = `Hi ${SITE.shortName}, I'd like to list this for sale:\n• Type: ${vertical}\n• Item: ${assetTitle}\n• Details: ${details}\n• Name: ${name}\n• Phone: ${phone}`;
    window.open(waLink(msg), "_blank", "noopener");
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#E7F7EF] text-[#1FA971]">
          <IconCheck className="h-7 w-7" />
        </span>
        <h2 className="text-2xl font-bold text-[var(--color-ink)]">Got it — we&apos;re on it.</h2>
        <p className="max-w-sm text-[var(--color-muted)]">
          We&apos;ve opened WhatsApp so you can send the details. Our team will reach out to
          arrange photos and pricing — usually within the hour.
        </p>
        <a
          href={waLink(`Hi ${SITE.shortName}, I just submitted an item to sell.`)}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white"
        >
          <IconWhatsApp className="h-4 w-4" /> Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8"
    >
      <fieldset className="mb-5">
        <legend className="mb-2 font-[family-name:var(--font-mono)] text-[0.62rem] uppercase tracking-wider text-[var(--color-sky)]">
          What are you selling?
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {VERTICALS.map((v) => (
            <button
              type="button"
              key={v.key}
              onClick={() => setVertical(v.vertical)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                vertical === v.vertical
                  ? "border-[var(--color-sky)] bg-[var(--color-sky-soft)] text-[var(--color-sky-hover)]"
                  : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-soft)] hover:border-[var(--color-sky)]"
              }`}
            >
              {v.short}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3">
        <Input value={assetTitle} onChange={setAssetTitle} required
          placeholder={vertical === "car" ? "e.g. Toyota RAV4 2019" : "e.g. 3-bedroom house in Kicukiro"} label="Item" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input value={name} onChange={setName} required placeholder="Your name" label="Name" />
          <Input value={phone} onChange={setPhone} required type="tel" placeholder="+250 7XX XXX XXX" label="Phone" />
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="font-[family-name:var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--color-muted)]">Details (price, location, condition)</span>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            placeholder="Tell us the asking price, location, and anything a buyer should know."
            className="w-full resize-none rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]"
          />
        </label>
        <button
          type="submit"
          disabled={state === "sending"}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-pink)] px-5 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-pink)] transition-[transform,opacity] duration-200 hover:-translate-y-0.5 disabled:opacity-60"
        >
          {state === "sending" ? "Submitting…" : "List it with Allan →"}
        </button>
        <p className="text-center text-xs text-[var(--color-muted)]">
          Free to list. We only earn when your item sells.
        </p>
      </div>
    </form>
  );
}

function Input({
  value, onChange, placeholder, label, type = "text", required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-[family-name:var(--font-mono)] text-[0.6rem] uppercase tracking-wider text-[var(--color-muted)]">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-sky)]"
      />
    </label>
  );
}
