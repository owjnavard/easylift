import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type KpiTone = "hero" | "emerald" | "amber" | "rose" | "sky" | "violet" | "slate";

const iconTone: Record<KpiTone, string> = {
  hero: "bg-white/20 text-white",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  sky: "bg-sky-50 text-sky-600",
  violet: "bg-violet-50 text-violet-600",
  slate: "bg-slate-100 text-slate-600",
};

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "slate",
  delta,
  deltaUp = true,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: KpiTone;
  delta?: string;
  deltaUp?: boolean;
  className?: string;
}) {
  if (tone === "hero") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-500 p-5 text-white shadow-sm",
          className
        )}
      >
        <div className="absolute -left-8 -top-8 size-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -right-4 size-28 rounded-full bg-white/10" />
        <div className="relative flex items-start justify-between">
          <p className="text-sm font-medium text-emerald-50/90">{label}</p>
          {Icon ? (
            <span className="grid size-9 place-items-center rounded-xl bg-white/20">
              <Icon className="size-5" />
            </span>
          ) : null}
        </div>
        <div className="relative mt-4 text-4xl font-extrabold tracking-tight">
          {value}
        </div>
        {(hint || delta) && (
          <div className="relative mt-3 flex items-center gap-2 text-xs text-emerald-50/90">
            {delta ? (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-white/20 px-2 py-0.5 font-semibold">
                {deltaUp ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {delta}
              </span>
            ) : null}
            {hint}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon ? (
          <span
            className={cn(
              "grid size-9 place-items-center rounded-xl",
              iconTone[tone]
            )}
          >
            <Icon className="size-5" />
          </span>
        ) : null}
      </div>
      <div className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">
        {value}
      </div>
      {(hint || delta) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {delta ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold",
                deltaUp
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              )}
            >
              {deltaUp ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {delta}
            </span>
          ) : null}
          {hint ? <span className="text-slate-400">{hint}</span> : null}
        </div>
      )}
    </div>
  );
}
