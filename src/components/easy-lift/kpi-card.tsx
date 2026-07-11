import { cn } from "@/lib/utils";

/**
 * KPI card. The first card in each row uses `gradient` (blue→cyan),
 * the rest are white with shadow.
 */
export function KpiCard({
  label,
  value,
  hint,
  tone = "white",
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "white" | "gradient" | "dark";
  className?: string;
}) {
  if (tone === "gradient") {
    return (
      <div
        className={cn(
          "rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-sm",
          className
        )}
      >
        <p className="text-sm opacity-90">{label}</p>
        <h2 className="mt-5 text-5xl font-black tracking-tight">{value}</h2>
        {hint ? <div className="mt-6 text-sm">{hint}</div> : null}
      </div>
    );
  }

  if (tone === "dark") {
    return (
      <div
        className={cn(
          "rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-sm",
          className
        )}
      >
        <p className="text-sm text-slate-300">{label}</p>
        <h2 className="mt-5 text-5xl font-black tracking-tight">{value}</h2>
        {hint ? <div className="mt-6 text-sm">{hint}</div> : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-3xl bg-white p-6 shadow-lg",
        className
      )}
    >
      <p className="text-sm text-slate-500">{label}</p>
      <h2 className="mt-5 text-5xl font-black tracking-tight text-slate-800">
        {value}
      </h2>
      {hint ? <div className="mt-6 text-sm">{hint}</div> : null}
    </div>
  );
}
