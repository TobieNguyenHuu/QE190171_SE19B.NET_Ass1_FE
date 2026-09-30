import type { ReactNode } from "react";
import { btnSecondary } from "./styles";

export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin text-accent ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Shows a spinner while loading, an error panel with retry on failure, otherwise the children. */
export function Loadable({
  loading, error, onRetry, children,
}: { loading: boolean; error: string | null; onRetry: () => void; children: ReactNode }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20 text-sm text-muted" role="status">
        <Spinner /> Loading…
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800" role="alert">
        <p className="font-medium">Could not load this page</p>
        <p className="mt-1">{error}</p>
        <button type="button" onClick={onRetry} className={`${btnSecondary} mt-4`}>Try again</button>
      </div>
    );
  }
  return <>{children}</>;
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-12 text-center">
      <p className="font-medium">{title}</p>
      {children && <div className="mt-2 text-sm text-muted">{children}</div>}
    </div>
  );
}
