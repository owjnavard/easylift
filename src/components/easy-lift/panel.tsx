import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white shadow-sm",
        padded && "p-5 sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
