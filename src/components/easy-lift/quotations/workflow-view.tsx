"use client";

import { useState } from "react";
import {
  ArrowRight,
  Code2,
  User,
  History,
  PlusCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { WorkflowStepper } from "./workflow-stepper";
import { HistoryDialog } from "./history-dialog";
import { Step1Request } from "./step1-request";
import { Step2Quote } from "./step2-quote";
import { Step3Contract } from "./step3-contract";
import { Step4Activate } from "./step4-activate";
import {
  useQuotations,
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_TONE,
} from "@/lib/quotations-store";
import { StatusBadge } from "@/components/easy-lift/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ------ دیالوگ ثبت اقدام / رد درخواست ------
function LogActionDialog({
  id,
  mode,
  open,
  onOpenChange,
}: {
  id: string;
  mode: "log" | "reject";
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const log = useQuotations((s) => s.log);
  const rejectRequest = useQuotations((s) => s.rejectRequest);

  const [action, setAction] = useState("");
  const [detail, setDetail] = useState("");
  const [actor, setActor] = useState("");
  const [rejectBy, setRejectBy] = useState("");

  function reset() {
    setAction("");
    setDetail("");
    setActor("");
    setRejectBy("");
  }

  function submit() {
    if (mode === "log") {
      log(id, actor || "کاربر", action, detail || undefined);
    } else {
      rejectRequest(id, action, rejectBy || "کارفرما");
    }
    reset();
    onOpenChange(false);
  }

  const isReject = mode === "reject";
  const canSubmit = isReject ? action.trim().length > 0 : action.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-md gap-0 p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-slate-100 p-5">
          <DialogTitle
            className={`flex items-center gap-2 text-base font-bold ${isReject ? "text-rose-700" : "text-slate-900"}`}
          >
            {isReject ? (
              <XCircle className="size-4 text-rose-600" />
            ) : (
              <PlusCircle className="size-4 text-emerald-600" />
            )}
            {isReject ? "رد درخواست پیش‌فاکتور" : "ثبت اقدام انجام شده"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-5">
          {isReject ? (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  رد کننده (کارفرما / کاربر)
                </label>
                <input
                  value={rejectBy}
                  onChange={(e) => setRejectBy(e.target.value)}
                  placeholder="مثال: کارفرما"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  علت رد درخواست <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  rows={3}
                  placeholder="علت را شرح دهید..."
                  className="w-full resize-none rounded-xl border border-rose-200 bg-rose-50/30 px-3.5 py-2.5 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                وضعیت پیش‌فاکتور به «تایید نشده» تغییر می‌کند. این اقدام در تاریخچه ثبت می‌شود.
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  انجام‌دهنده
                </label>
                <input
                  value={actor}
                  onChange={(e) => setActor(e.target.value)}
                  placeholder="نام کاربر / بخش"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  عنوان اقدام <span className="text-rose-500">*</span>
                </label>
                <input
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="مثال: بررسی مشخصات آسانسورها"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  جزئیات (اختیاری)
                </label>
                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={2}
                  placeholder="توضیحات بیشتر..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="border-t border-slate-100 p-4">
          <button
            onClick={() => { reset(); onOpenChange(false); }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            انصراف
          </button>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-40 ${isReject ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
          >
            {isReject ? "ثبت رد درخواست" : "ثبت اقدام"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WorkflowView({ id }: { id: string }) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id)!);
  const select = useQuotations((s) => s.select);
  const goToStage = useQuotations((s) => s.goToStage);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [logDialogMode, setLogDialogMode] = useState<"log" | "reject" | null>(null);

  const maxReached = req.stage;
  const isRejected = req.quoteStatus === "rejected";

  return (
    <div className="min-h-full bg-[#F6F7F9]">
      {/* top bar */}
      <header className="border-b border-slate-200/80 bg-white">
        <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => select(null)}
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              aria-label="بازگشت به لیست"
            >
              <ArrowRight className="size-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="truncate text-base font-extrabold text-slate-900 sm:text-lg">
                  {req.customer || "درخواست جدید"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-600">
                  <Code2 className="size-3" />
                  {req.code}
                </span>
                {/* نشان وضعیت پیش‌فاکتور */}
                <StatusBadge tone={QUOTE_STATUS_TONE[req.quoteStatus]}>
                  {QUOTE_STATUS_LABELS[req.quoteStatus]}
                </StatusBadge>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                <User className="size-3" />
                {req.requesterName}
                <span className="text-slate-300">•</span>
                {req.building.floors.toLocaleString("fa-IR")} طبقه
                <span className="text-slate-300">•</span>
                {(req.elevators?.length ?? req.building.elevatorCount).toLocaleString("fa-IR")} آسانسور
              </div>
              {/* علت رد — نمایش در صورت وجود */}
              {isRejected && req.rejection && (
                <div className="mt-1.5 flex items-start gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] text-rose-700">
                  <AlertTriangle className="mt-0.5 size-3 shrink-0" />
                  <span>
                    <span className="font-semibold">علت رد:</span> {req.rejection.reason}
                    {" "}— توسط {req.rejection.by}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* دکمه‌های تاریخچه و ثبت اقدام */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {/* ثبت اقدام */}
            <button
              onClick={() => setLogDialogMode("log")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <PlusCircle className="size-3.5" />
              ثبت اقدام
            </button>
            {/* رد درخواست (فقط اگر رد نشده) */}
            {!isRejected && (
              <button
                onClick={() => setLogDialogMode("reject")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                <XCircle className="size-3.5" />
                رد درخواست
              </button>
            )}
            {/* تاریخچه */}
            <button
              onClick={() => setHistoryOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <History className="size-3.5 text-emerald-600" />
              تاریخچه
              <span className="rounded-full bg-emerald-50 px-1.5 text-[10px] font-bold text-emerald-600">
                {req.history.length.toLocaleString("fa-IR")}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <WorkflowStepper
          current={req.stage}
          maxReached={maxReached}
          onJump={(s) => goToStage(id, s)}
        />

        {req.stage === 1 && <Step1Request id={id} />}
        {req.stage === 2 && <Step2Quote id={id} />}
        {req.stage === 3 && <Step3Contract id={id} />}
        {req.stage === 4 && <Step4Activate id={id} />}
      </div>

      <HistoryDialog
        id={id}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />

      {logDialogMode && (
        <LogActionDialog
          id={id}
          mode={logDialogMode}
          open={Boolean(logDialogMode)}
          onOpenChange={(v) => !v && setLogDialogMode(null)}
        />
      )}
    </div>
  );
}
