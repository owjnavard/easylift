"use client";

import { Check, ChevronLeft } from "lucide-react";
import { STAGE_LABELS, type Stage } from "@/lib/quotations-store";
import { cn } from "@/lib/utils";

const STAGES: Stage[] = [1, 2, 3, 4];

export function WorkflowStepper({
  current,
  maxReached,
  onJump,
}: {
  current: Stage;
  maxReached: Stage;
  onJump: (s: Stage) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-5">
      {/* desktop horizontal */}
      <div className="hidden items-center sm:flex">
        {STAGES.map((s, i) => {
          const done = s < current;
          const active = s === current;
          const locked = s > maxReached;
          return (
            <div key={s} className="flex flex-1 items-center">
              <button
                onClick={() => !locked && onJump(s)}
                disabled={locked}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-right transition",
                  active && "bg-emerald-50",
                  !locked && "cursor-pointer hover:bg-slate-50",
                  locked && "cursor-not-allowed opacity-60"
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold transition",
                    done && "bg-emerald-600 text-white",
                    active && "bg-emerald-600 text-white ring-4 ring-emerald-100",
                    !done && !active && "bg-slate-100 text-slate-500"
                  )}
                >
                  {done ? <Check className="size-4" /> : s.toLocaleString("fa-IR")}
                </span>
                <div className="min-w-0">
                  <div
                    className={cn(
                      "truncate text-xs font-semibold",
                      active ? "text-emerald-700" : "text-slate-700"
                    )}
                  >
                    {STAGE_LABELS[s]}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    مرحله {s.toLocaleString("fa-IR")}
                  </div>
                </div>
              </button>
              {i < STAGES.length - 1 ? (
                <div
                  className={cn(
                    "mx-1 h-px flex-1 transition",
                    s < current ? "bg-emerald-400" : "bg-slate-200"
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* mobile compact */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-700">
            مرحله {current.toLocaleString("fa-IR")} از ۴
          </span>
          <span className="text-xs text-slate-500">{STAGE_LABELS[current]}</span>
        </div>
        <div className="flex gap-1">
          {STAGES.map((s) => {
            const done = s < current;
            const active = s === current;
            const locked = s > maxReached;
            return (
              <button
                key={s}
                onClick={() => !locked && onJump(s)}
                disabled={locked}
                className={cn(
                  "h-2 flex-1 rounded-full transition",
                  done && "bg-emerald-500",
                  active && "bg-emerald-600",
                  !done && !active && "bg-slate-200"
                )}
                aria-label={`مرحله ${s}`}
              />
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
          <ChevronLeft className="size-3" />
          برای بازگشت به مرحله قبل روی آن کلیک کنید
        </div>
      </div>
    </div>
  );
}
