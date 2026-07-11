import { cn } from "@/lib/utils";

type Tone =
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "slate"
  | "cyan"
  | "purple"
  | "orange";

const toneMap: Record<Tone, string> = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  slate: "bg-slate-100 text-slate-700",
  cyan: "bg-cyan-100 text-cyan-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
};

export function StatusBadge({
  children,
  tone = "green",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
        toneMap[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
