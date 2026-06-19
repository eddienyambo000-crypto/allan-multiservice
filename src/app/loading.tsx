export default function Loading() {
  return (
    <div className="container-x pt-32 pb-20">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-[var(--color-surface)]" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-[var(--color-surface)]" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white">
            <div className="aspect-[4/3] animate-pulse bg-[var(--color-surface)]" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--color-surface)]" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--color-surface)]" />
              <div className="h-5 w-2/5 animate-pulse rounded bg-[var(--color-surface)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
