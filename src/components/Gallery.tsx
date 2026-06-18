"use client";

import Image from "next/image";
import { useState } from "react";
import { IconArrow } from "@/components/icons";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const safe = images.length ? images : [];
  const go = (d: number) => setIdx((i) => (i + d + safe.length) % safe.length);

  if (!safe.length) {
    return (
      <div className="grid aspect-[16/10] w-full place-items-center rounded-[var(--radius-card)] bg-[var(--color-surface)] text-[var(--color-muted)]">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface)]">
        <Image
          src={safe[idx]}
          alt={`${title} — photo ${idx + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        {safe.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[var(--color-ink)] shadow-md backdrop-blur transition-transform hover:scale-105"
            >
              <IconArrow className="h-5 w-5 rotate-180" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[var(--color-ink)] shadow-md backdrop-blur transition-transform hover:scale-105"
            >
              <IconArrow className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.65rem] text-white">
              {idx + 1} / {safe.length}
            </span>
          </>
        )}
      </div>

      {safe.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {safe.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setIdx(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                i === idx ? "border-[var(--color-sky)]" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
