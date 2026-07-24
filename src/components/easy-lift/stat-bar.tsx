import { cn } from "@/lib/utils";

export function StatBar({
  label,
  value,
  percent,
  barClass = "bg-emerald-500",
  className,
}: {
  label?: string;
  value?: string;
  percent: number;
  barClass?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {(label || value) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label ? <span className="text-slate-500">{label}</span> : null}
          {value ? (
            <span className="font-semibold text-slate-700">{value}</span>
          ) : null}
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-150 bg-slate-200/70">
        <div
          className={cn("h-full rounded-full transition-all", barClass)}
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
    </div>
  );
}
