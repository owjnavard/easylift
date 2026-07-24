import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  align?: "right" | "center" | "left";
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  className,
  emptyText = "موردی یافت نشد",
}: {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  className?: string;
  emptyText?: string;
}) {
  const alignClass = (a?: string) =>
    a === "center" ? "text-center" : a === "left" ? "text-left" : "text-right";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-slate-200/70">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500",
                    alignClass(c.align),
                    c.className
                  )}
                >
                  {c.header}
                </th>
              ))}
              {onRowClick ? <th className="px-4 py-3" /> : null}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onRowClick ? 1 : 0)}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-slate-100 transition last:border-0",
                    onRowClick && "cursor-pointer hover:bg-slate-50/70"
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "px-4 py-3.5 text-slate-700",
                        alignClass(c.align),
                        c.className
                      )}
                    >
                      {c.render
                        ? c.render(row, i)
                        : (row[c.key] as React.ReactNode)}
                    </td>
                  ))}
                  {onRowClick ? (
                    <td className="px-4 py-3.5 text-left">
                      <ChevronLeft className="ms-auto size-4 text-slate-300" />
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
