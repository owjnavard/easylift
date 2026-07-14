"use client";

import { ArrowRight, Code2, User } from "lucide-react";
import { WorkflowStepper } from "./workflow-stepper";
import { HistoryPanel } from "./history-panel";
import { Step1Request } from "./step1-request";
import { Step2Refer } from "./step2-refer";
import { Step3Quote } from "./step3-quote";
import { Step4Contract } from "./step4-contract";
import { Step5Activate } from "./step5-activate";
import { useQuotations } from "@/lib/quotations-store";

export function WorkflowView({ id }: { id: string }) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id)!);
  const select = useQuotations((s) => s.select);
  const goToStage = useQuotations((s) => s.goToStage);

  // بیشترین مرحله‌ای که پروژه به آن رسیده (برای قفل کردن مراحل بعدی)
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
        </div>
      </header>

      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        {/* stepper */}
        <WorkflowStepper
          current={req.stage}
          maxReached={maxReached}
          onJump={(s) => goToStage(id, s)}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            {req.stage === 1 && <Step1Request id={id} />}
            {req.stage === 2 && <Step2Refer id={id} />}
            {req.stage === 3 && <Step3Quote id={id} />}
            {req.stage === 4 && <Step4Contract id={id} />}
            {req.stage === 5 && <Step5Activate id={id} />}
          </div>
          <div>
            <HistoryPanel id={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
