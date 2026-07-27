"use client";

import { useState } from "react";
import { History, User, PlusCircle, Send, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useQuotations,
  STAGE_LABELS,
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_TONE,
} from "@/lib/quotations-store";
import { StatusBadge } from "@/components/easy-lift/status-badge";

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
  const log = useQuotations((s) => s.log);

  // فرم ثبت اقدام سریع
  const [actor, setActor] = useState("");
  const [action, setAction] = useState("");
  const [detail, setDetail] = useState("");

  if (!req) return null;
  const events = [...req.history].reverse();

  function submitLog() {
    if (!action.trim()) return;
    log(id, actor.trim() || "کاربر", action.trim(), detail.trim() || undefined);
    setActor("");
    setAction("");
    setDetail("");
  }

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
            <StatusBadge tone={QUOTE_STATUS_TONE[req.quoteStatus]} className="mr-1">
              {QUOTE_STATUS_LABELS[req.quoteStatus]}
            </StatusBadge>
          </DialogTitle>
        </DialogHeader>

        {/* فرم ثبت اقدام سریع */}
        <div className="border-b border-slate-100 bg-slate-50/60 p-4">
          <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <PlusCircle className="size-3.5 text-emerald-600" />
            ثبت اقدام جدید
          </p>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                value={actor}
                onChange={(e) => setActor(e.target.value)}
                placeholder="انجام‌دهنده"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
              <input
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="عنوان اقدام *"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) submitLog();
                }}
              />
            </div>
            <div className="flex gap-2">
              <input
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="جزئیات (اختیاری)"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) submitLog();
                }}
              />
              <button
                onClick={submitLog}
                disabled={!action.trim()}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="size-3" />
                ثبت
              </button>
            </div>
          </div>
        </div>

        {/* لیست رویدادها */}
        <div className="max-h-[50vh] overflow-y-auto p-5">
          {events.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">هنوز رویدادی ثبت نشده است</p>
          ) : (
            <div className="space-y-4">
              {events.map((e, i) => {
                const isReject = e.action.includes("رد درخواست");
                return (
                  <div key={e.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-full ${isReject ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}
                      >
                        {isReject ? <XCircle className="size-4" /> : <User className="size-4" />}
                      </span>
                      {i < events.length - 1 ? (
                        <span className="mt-1 w-px flex-1 bg-slate-200" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-semibold ${isReject ? "text-rose-700" : "text-slate-800"}`}
                        >
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
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
