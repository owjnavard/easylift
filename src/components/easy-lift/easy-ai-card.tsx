import { cn } from "@/lib/utils";
import { Sparkles, Bot } from "lucide-react";

export function EasyAiCard({
  insights,
  ctaLabel = "تحلیل هوشمند",
  onCta,
  className,
}: {
  insights: React.ReactNode[];
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-5 text-white shadow-sm",
        className
      )}
    >
      <div className="absolute -left-6 -top-6 size-24 rounded-full bg-emerald-500/20 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <span className="grid size-7 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Sparkles className="size-4" />
          </span>
          Easy AI
        </h3>
        <Bot className="size-5 text-emerald-400/70" />
      </div>
      <ul className="relative mt-4 space-y-3">
        {insights.map((line, i) => (
          <li
            key={i}
            className="flex gap-2 text-xs leading-relaxed text-slate-300"
          >
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onCta}
        className="relative mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-500"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
