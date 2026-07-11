import { cn } from "@/lib/utils";

/** White rounded-3xl card with shadow, matching the design system. */
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
        "rounded-3xl bg-white shadow-lg",
        padded && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
