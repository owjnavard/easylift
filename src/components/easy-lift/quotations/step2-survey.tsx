"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ClipboardCheck, Calculator, Info } from "lucide-react";
import { Panel, StatusBadge } from "@/components/easy-lift";
import { useQuotations } from "@/lib/quotations-store";
import { PART_MAP, formatCompact } from "@/lib/vendor-data";
import { computeParts } from "@/lib/parts-engine";
import { cn } from "@/lib/utils";

export function Step2Survey({ id }: { id: string }) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id)!);
  const saveSurvey = useQuotations((s) => s.saveSurvey);
  const goToStage = useQuotations((s) => s.goToStage);
  const log = useQuotations((s) => s.log);

  const [survey, setSurvey] = useState(
    req.survey ?? { pitWidth: 170, pitDepth: 1.6, floorHeight: 3.2, headroom: 3.8 }
  );
  const [note, setNote] = useState(req.surveyNote ?? "");

  const set = (k: keyof typeof survey, v: number) =>
    setSurvey((s) => ({ ...s, [k]: v }));

  // پیش‌محاسبه برای نمایش زنده
  const preview =
    req.building && survey
      ? computeParts(req.building, survey)
      : [];

  function saveAndNext() {
    saveSurvey(id, survey, note);
    goToStage(id, 3);
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Panel className="p-5 sm:p-6">
          <div className="mb-5">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <ClipboardCheck className="size-4" />
              </span>
              برداشت اطلاعات آسانسور
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              اطلاعات بر اساس شماتیک آسانسور ثبت شود. پس از تکمیل، قطعات موردنیاز به‌صورت خودکار محاسبه می‌شود.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <DimField
              label="عرض چاه"
              value={survey.pitWidth}
              onChange={(v) => set("pitWidth", v)}
              unit="سانتی‌متر"
            />
            <DimField
              label="عمق چاله"
              value={survey.pitDepth}
              onChange={(v) => set("pitDepth", v)}
              unit="متر"
            />
            <DimField
              label="ارتفاع طبقه"
              value={survey.floorHeight}
              onChange={(v) => set("floorHeight", v)}
              unit="متر"
            />
            <DimField
              label="ارتفاع اورهد"
              value={survey.headroom}
              onChange={(v) => set("headroom", v)}
              unit="متر"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              یادداشت برداشت
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="توضیحات فنی محل پروژه..."
              className="h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-xl bg-sky-50 p-3 text-xs text-sky-700">
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              ارتفاع کل سفر:{" "}
              <strong>{(req.building.floors * survey.floorHeight).toLocaleString("fa-IR")} متر</strong>{" "}
              — محاسبه قطعات بر اساس فرمول‌های ثبت‌شده در بخش «فرمول‌ها» انجام می‌شود.
            </span>
          </div>
        </Panel>

        {/* parts preview */}
        <Panel padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Calculator className="size-4 text-emerald-600" />
              محاسبه خودکار قطعات
            </h3>
            <StatusBadge tone="emerald">{preview.length} نوع قطعه</StatusBadge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-200/70">
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">قطعه</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">تعداد</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">واحد</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">فرمول محاسبه</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((p) => {
                  const part = PART_MAP[p.partId];
                  return (
                    <tr key={p.partId} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2.5 text-right font-medium text-slate-800">{part.name}</td>
                      <td className="px-4 py-2.5 text-center font-bold text-emerald-600">
                        {p.qty.toLocaleString("fa-IR")}
                      </td>
                      <td className="px-4 py-2.5 text-center text-xs text-slate-500">{part.unit}</td>
                      <td className="px-4 py-2.5 text-right text-[11px] text-slate-400">{p.formula}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {/* summary + nav */}
      <div className="space-y-5">
        <Panel className="p-5">
          <h3 className="text-sm font-bold text-slate-900">خلاصه پروژه موقت</h3>
          <div className="mt-4 space-y-3 text-xs">
            <Row label="مشتری" value={req.customer} />
            <Row label="طبقات" value={req.building.floors.toLocaleString("fa-IR")} />
            <Row label="آسانسور" value={req.building.elevatorCount.toLocaleString("fa-IR")} />
            <Row label="واحد/طبقه" value={req.building.unitsPerFloor.toLocaleString("fa-IR")} />
            <div className="border-t border-slate-100 pt-3">
              <Row
                label="ارتفاع سفر"
                value={`${(req.building.floors * survey.floorHeight).toLocaleString("fa-IR")} م`}
                strong
              />
            </div>
          </div>
        </Panel>

        <div className="flex flex-col gap-2">
          <button
            onClick={saveAndNext}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            تأیید برداشت و صدور پیش‌فاکتور
            <ArrowLeft className="size-4" />
          </button>
          <button
            onClick={() => {
              log(id, "مدیر فنی", "بازگشت به ویرایش درخواست");
              goToStage(id, 1);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowRight className="size-4" />
            بازگشت به درخواست
          </button>
        </div>
      </div>
    </div>
  );
}

function DimField({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pl-12 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
          {unit}
        </span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span
        className={cn(
          "text-slate-700",
          strong ? "font-bold text-emerald-600" : "font-semibold"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// suppress unused
void formatCompact;
void useEffect;
