"use client";

import { useState } from "react";
import { ArrowRight, Code2, User, History } from "lucide-react";
import { WorkflowStepper } from "./workflow-stepper";
import { HistoryDialog } from "./history-dialog";
import { Step1Request } from "./step1-request";
import { Step2Quote } from "./step2-quote";
import { Step3Contract } from "./step3-contract";
import { Step4Activate } from "./step4-activate";
import { useQuotations } from "@/lib/quotations-store";

export function WorkflowView({ id }: { id: string }) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id)!);
  const select = useQuotations((s) => s.select);
  const goToStage = useQuotations((s) => s.goToStage);
  const [historyOpen, setHistoryOpen] = useState(false);

  const maxReached = req.stage;

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
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-extrabold text-slate-900 sm:text-lg">
                  {req.customer || "درخواست جدید"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-600">
                  <Code2 className="size-3" />
                  {req.code}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                <User className="size-3" />
                {req.requesterName}
                <span className="text-slate-300">•</span>
                {req.building.floors.toLocaleString("fa-IR")} طبقه
                <span className="text-slate-300">•</span>
                {req.building.elevatorCount.toLocaleString("fa-IR")} آسانسور
              </div>
            </div>
          </div>

          {/* history button (all stages) */}
          <button
            onClick={() => setHistoryOpen(true)}
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 lg:self-auto"
          >
            <History className="size-3.5 text-emerald-600" />
            تاریخچه
            <span className="rounded-full bg-emerald-50 px-1.5 text-[10px] font-bold text-emerald-600">
              {req.history.length.toLocaleString("fa-IR")}
            </span>
          </button>
        </div>
      </header>

      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <WorkflowStepper
          current={req.stage}
          maxReached={maxReached}
          onJump={(s) => goToStage(id, s)}
        />

        {/* full-width step content (no sidebar) */}
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
    </div>
  );
}
