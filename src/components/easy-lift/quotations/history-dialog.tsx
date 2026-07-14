"use client";

import { History, User, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuotations, STAGE_LABELS } from "@/lib/quotations-store";

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

export function HistoryDialog({
  id,
  open,
  onOpenChange,
}: {
  id: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id));
  if (!req) return null;
  const events = [...req.history].reverse();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0 sm:rounded-2xl">
        <DialogHeader className="flex-row items-center justify-between border-b border-slate-100 p-5">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <History className="size-4 text-emerald-600" />
            تاریخچه پیش‌فاکتور
            <span className="font-mono text-xs font-normal text-slate-400">
              {req.code}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto p-5">
          <div className="space-y-4">
            {events.map((e, i) => (
              <div key={e.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <User className="size-4" />
                  </span>
                  {i < events.length - 1 ? (
                    <span className="mt-1 w-px flex-1 bg-slate-200" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {e.action}
                    </span>
                    <span className="shrink-0 text-[11px] text-slate-400">
                      {timeAgo(e.at)}
                    </span>
                  </div>
                  {e.detail ? (
                    <p className="mt-0.5 text-xs text-slate-500">{e.detail}</p>
                  ) : null}
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    توسط {e.actor} • مرحله{" "}
                    {e.stage.toLocaleString("fa-IR")} (
                    {STAGE_LABELS[e.stage]})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

void X;
