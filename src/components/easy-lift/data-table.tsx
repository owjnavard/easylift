import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  align?: "right" | "center" | "left";
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

/**
 * Lightweight data table matching the original design:
 * slate-100 header row, border-t body rows with hover:bg-slate-50.
 */
export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  className,
}: {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  className?: string;
}) {
  const alignClass = (a?: string) =>
    a === "center"
      ? "text-center"
      : a === "left"
        ? "text-left"
        : "text-right";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl bg-white shadow-lg",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-100">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn("p-4 font-semibold text-slate-600", alignClass(c.align), c.className)}
                >
                  {c.header}
                </th>
              ))}
              {onRowClick ? <th className="p-4" /> : null}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-t border-slate-100 transition",
                  onRowClick && "cursor-pointer hover:bg-slate-50"
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn("p-4 text-slate-700", alignClass(c.align), c.className)}
                  >
                    {c.render ? c.render(row, i) : (row[c.key] as React.ReactNode)}
                  </td>
                ))}
                {onRowClick ? (
                  <td className="p-4 text-left">
                    <ChevronLeft className="ms-auto size-4 text-slate-400" />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
