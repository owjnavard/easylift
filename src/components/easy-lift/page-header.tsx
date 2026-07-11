import { cn } from "@/lib/utils";
import { Search, Bell, Plus } from "lucide-react";

/**
 * Sticky page header used by most pages. Matches the original design:
 * title + subtitle on the right (RTL), search + primary action on the left.
 */
export function PageHeader({
  icon,
  title,
  subtitle,
  searchPlaceholder = "جستجو...",
  actionLabel,
  onAction,
  showSearch = true,
  rightSlot,
  className,
}: {
  icon?: React.ReactNode;
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
        "sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-8">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-black text-slate-800 lg:text-3xl">
            {icon}
            <span className="truncate">{title}</span>
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {rightSlot}
          {showSearch ? (
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder={searchPlaceholder}
                className="w-56 rounded-2xl bg-slate-100 px-5 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-200 md:w-80"
              />
            </div>
          ) : null}
          <button className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200">
            <Bell className="size-5" />
          </button>
          {actionLabel ? (
            <button
              onClick={onAction}
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
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
