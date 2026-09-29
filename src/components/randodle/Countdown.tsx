import { useEffect, useState } from "react";
import { formatDuration, msUntilTomorrow } from "@/services/dateService";

export function Countdown({ label = "Next Randodle" }: { label?: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setRemaining(msUntilTomorrow());
    const id = window.setInterval(() => setRemaining(msUntilTomorrow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p
        className="mt-1 font-mono text-3xl font-bold tabular-nums text-foreground"
        aria-live="off"
        suppressHydrationWarning
      >
        {remaining === null ? "--:--:--" : formatDuration(remaining)}
      </p>
    </div>
  );
}
