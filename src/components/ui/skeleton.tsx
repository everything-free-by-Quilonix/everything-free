import { cn } from "@/lib/utils/cn";

/**
 * Loading placeholder: a static block that mirrors the final layout. It never
 * pulses or shimmers; the wrapper's `aria-busy` and status text carry the state.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("rounded-xs bg-surface-raised", className)} aria-hidden="true" />;
}
