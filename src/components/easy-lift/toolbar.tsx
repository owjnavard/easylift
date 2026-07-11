import { cn } from "@/lib/utils";

/** Filter toolbar with dropdowns on one side and actions on the other. */
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
        "flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-lg",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3">{filters}</div>
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
        "rounded-xl bg-slate-100 px-5 py-3 text-sm text-slate-700 outline-none",
        className
      )}
    >
      {children}
    </select>
  );
}
