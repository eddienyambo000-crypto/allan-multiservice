"use client";

import { useState } from "react";
import { IconShare, IconCheck } from "@/components/icons";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      onClick={onShare}
      aria-label="Share this listing"
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
    >
      {copied ? <IconCheck className="h-4 w-4 text-[#1FA971]" /> : <IconShare className="h-4 w-4" />}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
