"use client";

import { History, User } from "lucide-react";
import { Panel } from "@/components/easy-lift";
import { useQuotations } from "@/lib/quotations-store";

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "همین حالا";
  if (m < 60) return `${m.toLocaleString("fa-IR")} دقیقه پیش`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h.toLocaleString("fa-IR")} ساعت پیش`;
  const days = Math.floor(h / 24);
  return `${days.toLocaleString("fa-IR")} روز پیش`;
}

export function HistoryPanel({ id }: { id: string }) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id)!);
  const events = [...req.history].reverse();

  return (
    <Panel className="p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <History className="size-4 text-emerald-600" />
        تاریخچه پروژه
      </h3>
      <div className="mt-4 space-y-4">
        {events.map((e, i) => (
          <div key={e.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <User className="size-3.5" />
              </span>
              {i < events.length - 1 ? (
                <span className="mt-1 w-px flex-1 bg-slate-200" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-800">
                  {e.action}
                </span>
                <span className="shrink-0 text-[10px] text-slate-400">
                  {timeAgo(e.at)}
                </span>
              </div>
              {e.detail ? (
                <p className="mt-0.5 text-[11px] text-slate-500">{e.detail}</p>
              ) : null}
              <div className="mt-0.5 text-[10px] text-slate-400">
                توسط {e.actor} • مرحله {e.stage.toLocaleString("fa-IR")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
