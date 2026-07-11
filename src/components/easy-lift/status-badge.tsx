import { cn } from "@/lib/utils";

type Tone = "emerald" | "amber" | "rose" | "sky" | "violet" | "slate";

const toneMap: Record<Tone, string> = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
  amber: "bg-amber-50 text-amber-700 ring-amber-200/60",
  rose: "bg-rose-50 text-rose-700 ring-rose-200/60",
  sky: "bg-sky-50 text-sky-700 ring-sky-200/60",
  violet: "bg-violet-50 text-violet-700 ring-violet-200/60",
  slate: "bg-slate-100 text-slate-700 ring-slate-200/60",
};

export function StatusBadge({
  children,
  tone = "emerald",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        toneMap[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
