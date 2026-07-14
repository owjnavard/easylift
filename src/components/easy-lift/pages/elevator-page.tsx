"use client";

import { useState } from "react";
import {
  ArrowRight,
  ClipboardCheck,
  Cog,
  Save,
  CheckCircle2,
  Info,
  ArrowLeft,
} from "lucide-react";
import { Panel, StatusBadge, StatBar, EasyAiCard } from "@/components/easy-lift";
import { useProjectStore } from "@/lib/project-store";
import { useNav } from "@/lib/nav-store";
import { PART_MAP, formatCompact } from "@/lib/vendor-data";
import { cn } from "@/lib/utils";

const TABS = [
  "اطلاعات آسانسور",
  "لوازم مورد نیاز",
  "برداشت اطلاعات",
  "محاسبات فنی",
  "استاندارد",
] as const;

export function ElevatorPage() {
  const elevId = useProjectStore((s) => s.selectedElevatorId);
  const elevator = useProjectStore((s) =>
    s.elevators.find((e) => e.id === elevId)
  );
  const project = useProjectStore((s) =>
    s.projects.find((p) => p.id === elevator?.projectId)
  );
  const setPage = useNav((s) => s.setPage);
  const [tab, setTab] = useState(2); // default to survey tab

  // No elevator selected
  if (!elevator) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <button
          onClick={() => setPage("technical")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
        >
          <ArrowRight className="size-4" />
          بازگشت به فنی و مهندسی
        </button>
        <Panel className="p-10 text-center">
          <Cog className="mx-auto size-12 text-slate-300" />
          <h2 className="mt-4 text-base font-bold text-slate-600">
            آسانسوری انتخاب نشده است
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            از بخش «فنی و مهندسی» یک آسانسور را انتخاب کنید.
          </p>
          <button
            onClick={() => setPage("technical")}
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            رفتن به فنی و مهندسی
            <ArrowLeft className="size-4" />
          </button>
        </Panel>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => setPage("technical")}
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
      >
        <ArrowRight className="size-4" />
        بازگشت به فنی و مهندسی
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-slate-900 text-emerald-400">
            <Cog className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {elevator.name} — {project?.name ?? ""}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              {project?.floors.toLocaleString("fa-IR")} طبقه •{" "}
              {elevator.survey
                ? `برداشت تکمیل`
                : "در انتظار برداشت اطلاعات"}
            </p>
          </div>
        </div>
        <StatusBadge
          tone={elevator.survey ? "emerald" : "amber"}
          className="px-3 py-1.5 text-xs"
        >
          {elevator.progress.toLocaleString("fa-IR")}٪ پیشرفت
        </StatusBadge>
      </div>

      {/* Tabs */}
      <div className="el-tabs-row mt-6 flex gap-6 overflow-x-auto border-b border-slate-200">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={cn(
              "el-tab pb-3 pt-1 text-sm text-slate-500",
              tab === i && "active !text-emerald-700"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 0 && <ElevatorInfoTab elevator={elevator} project={project} />}
        {tab === 1 && <PartsTab elevator={elevator} />}
        {tab === 2 && <SurveyEditTab elevator={elevator} project={project} />}
        {tab === 3 && <CalculationTab elevator={elevator} project={project} />}
        {tab === 4 && <StandardTab />}
      </div>
    </div>
  );
}

type Elevator = NonNullable<ReturnType<typeof useProjectStore.getState>["elevators"][number]>;
type Project = NonNullable<ReturnType<typeof useProjectStore.getState>["projects"][number]>;

function ElevatorInfoTab({
  elevator,
  project,
}: {
  elevator: Elevator;
  project?: Project;
}) {
  const fields = [
    { l: "کد آسانسور", v: elevator.code },
    { l: "نام", v: elevator.name },
    { l: "پروژه", v: project?.name ?? "—" },
    { l: "تعداد طبقات", v: project?.floors.toLocaleString("fa-IR") ?? "—" },
    { l: "وضعیت", v: elevator.status },
    { l: "پیشرفت", v: `${elevator.progress.toLocaleString("fa-IR")}٪` },
    { l: "برداشت اطلاعات", v: elevator.survey ? "تکمیل شده" : "در انتظار" },
    {
      l: "قطعات محاسبه‌شده",
      v: `${elevator.parts.length.toLocaleString("fa-IR")} نوع`,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Panel className="p-5 lg:col-span-2">
        <h3 className="mb-4 text-sm font-bold text-slate-900">
          مشخصات فنی آسانسور
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.l} className="rounded-xl bg-slate-50 p-3.5">
              <div className="text-[11px] text-slate-500">{f.l}</div>
              <div className="mt-1 text-sm font-semibold text-slate-800">
                {f.v}
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <EasyAiCard
        insights={[
          "بر اساس مشخصات، قطعات موردنیاز به‌صورت خودکار محاسبه می‌شود.",
          "پس از تکمیل برداشت، قطعات در پیش‌فاکتور تجمیع می‌شوند.",
          "هزینه تخمینی تجهیزات در مرحله صدور پیش‌فاکتور نمایش داده می‌شود.",
        ]}
        ctaLabel="راهنمای برداشت"
      />
    </div>
  );
}

function PartsTab({ elevator }: { elevator: Elevator }) {
  const parts = elevator.parts;
  return (
    <Panel padded={false} className="overflow-hidden">
      <div className="border-b border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-900">لیست لوازم مورد نیاز</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          به‌صورت خودکار از مشخصات برداشت‌شده محاسبه شده است — این قطعات در پیش‌فاکتور تجمیع می‌شوند.
        </p>
      </div>
      {parts.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-400">
          هنوز قطعه‌ای محاسبه نشده — ابتدا تب «برداشت اطلاعات» را تکمیل کنید.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-slate-50/80">
              <tr className="border-b border-slate-200/70">
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">قطعه</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">تعداد</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">واحد</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">فرمول محاسبه</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => {
                const part = PART_MAP[p.partId];
                if (!part) return null;
                return (
                  <tr key={p.partId} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {part.name}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-600">
                      {p.qty.toLocaleString("fa-IR")}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-slate-500">{part.unit}</td>
                    <td className="px-4 py-3 text-right text-[11px] text-slate-400">{p.formula}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function SurveyEditTab({
  elevator,
  project,
}: {
  elevator: Elevator;
  project?: Project;
}) {
  const saveElevatorSurvey = useProjectStore((s) => s.saveElevatorSurvey);

  const [survey, setSurvey] = useState(
    elevator.survey ?? {
      pitWidth: 170,
      pitDepth: 1.6,
      floorHeight: 3.2,
      headroom: 3.8,
    }
  );
  const [note, setNote] = useState(elevator.survey?.note ?? "");
  const [saved, setSaved] = useState(!!elevator.survey?.completedAt);

  const set = (k: keyof typeof survey, v: number) =>
    setSurvey((s) => ({ ...s, [k]: v }));

  const floors = project?.floors ?? 8;
  const travel = floors * survey.floorHeight;

  function save() {
    saveElevatorSurvey(elevator.id, survey, note);
    setSaved(true);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
            <span className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <ClipboardCheck className="size-5" />
            </span>
            برداشت اطلاعات آسانسور {elevator.code}
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            اطلاعات بر اساس شماتیک آسانسور ثبت شود — پس از ذخیره، قطعات به‌صورت خودکار محاسبه می‌شوند.
          </p>
        </div>
        {saved ? (
          <StatusBadge tone="emerald" className="px-3 py-1.5">
            <CheckCircle2 className="me-1 size-3.5" />
            برداشت تکمیل
          </StatusBadge>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* form */}
        <div className="lg:col-span-7">
          <Panel className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-bold text-slate-900">
              ابعاد شماتیک آسانسور
            </h3>
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

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-sky-50 p-3 text-xs text-sky-700">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>
                ارتفاع کل سفر:{" "}
                <strong>{travel.toLocaleString("fa-IR")} متر</strong> — پس از
                ذخیره، قطعات با فرمول‌های ثبت‌شده محاسبه و در پیش‌فاکتور تجمیع
                می‌شوند.
              </span>
            </div>

            <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={save}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Save className="size-4" />
                ذخیره برداشت و محاسبه قطعات
              </button>
            </div>
          </Panel>
        </div>

        {/* schematic + summary */}
        <div className="space-y-5 lg:col-span-5">
          <Panel padded={false} className="overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-3.5">
              <h3 className="text-sm font-bold text-slate-900">شماتیک آسانسور</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                نمایی گرافیکی از ابعاد واردشده
              </p>
            </div>
            <div className="flex items-center justify-center bg-slate-100 p-6">
              <div className="grid h-64 w-full max-w-xs place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-white text-center">
                <div>
                  <ClipboardCheck className="mx-auto size-14 text-slate-300" />
                  <h3 className="mt-3 text-sm font-bold text-slate-500">
                    شماتیک آسانسور
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-400">
                    عرض {survey.pitWidth.toLocaleString("fa-IR")}cm • سفر{" "}
                    {travel.toLocaleString("fa-IR")}m
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <h3 className="text-sm font-bold text-slate-900">خلاصه</h3>
            <div className="mt-4 space-y-3 text-xs">
              <Row label="پروژه" value={project?.name ?? "—"} />
              <Row label="طبقات" value={floors.toLocaleString("fa-IR")} />
              <Row label="ارتفاع سفر" value={`${travel.toLocaleString("fa-IR")} م`} strong />
              <div className="border-t border-slate-100 pt-3">
                <StatBar
                  percent={saved ? 25 : 0}
                  label="پیشرفت برداشت"
                  value={saved ? "۲۵٪" : "۰٪"}
                  barClass="bg-emerald-500"
                />
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function CalculationTab({
  elevator,
  project,
}: {
  elevator: Elevator;
  project?: Project;
}) {
  const survey = elevator.survey;
  const floors = project?.floors ?? 8;
  const travel = survey ? floors * survey.floorHeight : 0;
  const calcs = survey
    ? [
        { l: "ارتفاع کل سفر", v: `${travel.toLocaleString("fa-IR")} متر`, d: `${floors.toLocaleString("fa-IR")} طبقه × ${survey.floorHeight}م` },
        { l: "طول ریل کل", v: `${((travel + survey.pitDepth + survey.headroom) * 2).toLocaleString("fa-IR")} متر`, d: "۲ مسیر × (سفر + چاله + اورهد)" },
        { l: "طول سیم بکسل", v: `${(travel * 2).toLocaleString("fa-IR")} متر`, d: "۲ × ارتفاع سفر" },
        { l: "تعداد درب", v: floors.toLocaleString("fa-IR"), d: "به ازای هر طبقه" },
        { l: "قطعات محاسبه‌شده", v: `${elevator.parts.length.toLocaleString("fa-IR")} نوع`, d: "از فرمول‌های ثبت‌شده" },
      ]
    : [];
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Panel className="p-5">
          <h3 className="mb-4 text-sm font-bold text-slate-900">
            نتیجه محاسبات فنی
          </h3>
          {!survey ? (
            <div className="p-8 text-center text-sm text-slate-400">
              ابتدا تب «برداشت اطلاعات» را تکمیل کنید.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {calcs.map((c) => (
                <div key={c.l} className="rounded-xl border border-slate-200 p-3.5">
                  <div className="text-[11px] text-slate-500">{c.l}</div>
                  <div className="mt-1 text-base font-bold text-slate-900">{c.v}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">{c.d}</div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
      <EasyAiCard
        insights={[
          "محاسبات با استاندارد ISO 4190 منطبق است.",
          "پادوزن مناسب برای تعادل بهینه پیشنهاد می‌شود.",
          "قطعات محاسبه‌شده در پیش‌فاکتور تجمیع می‌شوند.",
        ]}
        ctaLabel="اعمال محاسبات"
      />
    </div>
  );
}

function StandardTab() {
  const checks = [
    { n: "کنترل ترمز اضطراری", s: true },
    { n: "تست چراغ اضطراری", s: true },
    { n: "کنترل سیم بکسل و گیربکس", s: true },
    { n: "درب‌های اتوماتیک طبقات", s: false },
    { n: "سیستم آلارم و ارتباط صوتی", s: false },
    { n: "تست بار کامل", s: false },
  ];
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Panel className="p-5 lg:col-span-2">
        <h3 className="mb-4 text-sm font-bold text-slate-900">چک‌لیست استاندارد</h3>
        <div className="space-y-2">
          {checks.map((c) => (
            <label
              key={c.n}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
            >
              <span className="text-sm text-slate-700">{c.n}</span>
              <StatusBadge tone={c.s ? "emerald" : "amber"}>
                {c.s ? "تأیید شد" : "در انتظار"}
              </StatusBadge>
            </label>
          ))}
        </div>
      </Panel>
      <EasyAiCard
        insights={[
          "۴ مورد از ۶ چک‌لیست تأیید شده است.",
          "۲ مورد باقی‌مانده قبل از تحویل لازم است.",
          "پیشنهاد برنامه‌ریزی بازرسی برای پایان هفته.",
        ]}
        ctaLabel="ثبت گزارش استاندارد"
      />
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

void formatCompact;
