"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-24 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">Something hiccuped.</h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          Don&apos;t worry — your data is safe. Try again, and if it keeps happening reach us on WhatsApp.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="rounded-full bg-[var(--color-sky)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
            Try again
          </button>
          <a href="/" className="rounded-full border border-[var(--color-line)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-sky)]">
            Back home
          </a>
        </div>
      </div>
    </div>
  );
}
