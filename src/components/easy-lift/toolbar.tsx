import { cn } from "@/lib/utils";

export function Toolbar({
  filters,
  actions,
  className,
}: {
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">{filters}</div>
      <div className="flex flex-wrap items-center gap-2">{actions}</div>
    </div>
  );
}

export function FilterSelect({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <select
      className={cn(
        "rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 outline-none transition hover:bg-slate-50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
        className
      )}
    >
      {children}
    </select>
  );
}
