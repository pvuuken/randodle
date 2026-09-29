export function StreakBadge({ days, label = "day streak" }: { days: number; label?: string }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-4 py-1.5 text-sm font-semibold text-warning">
      <span aria-hidden="true">🔥</span>
      {days} {label}
    </p>
  );
}
