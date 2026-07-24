import { cn } from "@/lib/utils";
import { Search, Bell, Plus } from "lucide-react";

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  searchPlaceholder = "جستجو...",
  actionLabel,
  onAction,
  showSearch = true,
  rightSlot,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  actionLabel?: string;
  onAction?: () => void;
  showSearch?: boolean;
  rightSlot?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-5">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            {Icon ? (
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon className="size-5" />
              </span>
            ) : null}
            <span className="truncate">{title}</span>
          </h1>
          {subtitle ? (
            <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {rightSlot}
          {showSearch ? (
            <div className="relative w-full sm:w-56 md:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder={searchPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-10 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          ) : null}
          <button
            className="relative grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="اعلان‌ها"
          >
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          {actionLabel ? (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus className="size-4" />
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
