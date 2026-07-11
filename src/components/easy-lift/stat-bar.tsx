import { cn } from "@/lib/utils";

/** Horizontal progress bar with label + percentage. */
export function StatBar({
  label,
  value,
  percent,
  barClass = "bg-blue-600",
  className,
}: {
  label?: string;
  value?: string;
  percent: number; // 0-100
  barClass?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {(label || value) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label ? <span className="text-slate-600">{label}</span> : null}
          {value ? <span className="font-semibold text-slate-700">{value}</span> : null}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={cn("h-2 rounded-full", barClass)}
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}
