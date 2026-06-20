"use client";

import { useEffect } from "react";

/** Accessible confirm dialog — replaces native confirm() in the admin. */
export default function ConfirmModal({
  title,
  body,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: {
  title: string;
  body?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[200] grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-full max-w-sm rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-lift)]">
        <h3 className="text-lg font-bold text-[var(--color-ink)]">{title}</h3>
        {body && <p className="mt-2 text-sm text-[var(--color-muted)]">{body}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl border border-[var(--color-line)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]">Cancel</button>
          <button onClick={onConfirm} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
