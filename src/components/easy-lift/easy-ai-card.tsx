import { cn } from "@/lib/utils";
import { Bot, Sparkles } from "lucide-react";

/**
 * The dark "Easy AI" insight card that appears on most pages.
 * Shows AI suggestions/insights and a primary CTA button.
 */
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
        "flex flex-col rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-lg",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold">
          <Sparkles className="size-5 text-purple-400" />
          Easy AI
        </h3>
        <Bot className="size-7 text-purple-300" />
      </div>
      <div className="mt-6 space-y-4 text-sm text-slate-300">
        {insights.map((line, i) => (
          <p key={i} className="leading-relaxed">
            {line}
          </p>
        ))}
      </div>
      <button
        onClick={onCta}
        className="mt-8 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
