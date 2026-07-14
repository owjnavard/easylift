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
  Eye,
  Pencil,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Type,
  Trash2,
  Undo2,
  Download,
  ChevronLeft,
  History,
  ImageIcon,
  FileText,
  Maximize2,
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
  const [mode, setMode] = useState<"view" | "edit">(
    elevator.survey?.completedAt ? "view" : "edit"
  );
  const [activeStage, setActiveStage] = useState(0);
  const [zoom, setZoom] = useState(1);

  const set = (k: keyof typeof survey, v: number) =>
    setSurvey((s) => ({ ...s, [k]: v }));

  const floors = project?.floors ?? 8;
  const travel = floors * survey.floorHeight;

  // مراحل برداشت
  const STAGES = [
    { n: 1, label: "چاله", icon: "⛏️" },
    { n: 2, label: "آهنکشی", icon: "🔧" },
    { n: 3, label: "ریل", icon: "📏" },
    { n: 4, label: "درب", icon: "🚪" },
    { n: 5, label: "کابین", icon: "📦" },
    { n: 6, label: "مکانیک", icon: "⚙️" },
    { n: 7, label: "راه‌اندازی", icon: "✅" },
  ];
  const progressPercent = saved ? 68 : Math.round((activeStage / 7) * 100);

  function save() {
    saveElevatorSurvey(elevator.id, survey, note);
    setSaved(true);
    setMode("view");
  }

  return (
    <div className="space-y-4">
      {/* header with mode toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
            <ClipboardCheck className="size-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              برداشت اطلاعات — آسانسور {elevator.code}
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {mode === "view" ? "مشاهده شماتیک" : "ویرایش اطلاعات"} • مرحله{" "}
              {(activeStage + 1).toLocaleString("fa-IR")} از{" "}
              {STAGES.length.toLocaleString("fa-IR")} — {STAGES[activeStage].label}
            </p>
          </div>
        </div>

        {/* mode toggle */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setMode("view")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
              mode === "view"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Eye className="size-3.5" />
            مشاهده
          </button>
          <button
            onClick={() => setMode("edit")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
              mode === "edit"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Pencil className="size-3.5" />
            ویرایش
          </button>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* ===== Left column: stages + progress ===== */}
        <div className="space-y-4 lg:col-span-3">
          <Panel className="p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              مراحل ثبت اطلاعات
            </h3>
            <div className="space-y-1.5">
              {STAGES.map((s, i) => {
                const active = i === activeStage;
                const done = i < activeStage;
                return (
                  <button
                    key={s.n}
                    onClick={() => setActiveStage(i)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-right text-xs transition",
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : done
                          ? "text-slate-600 hover:bg-slate-50"
                          : "text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold transition",
                        done
                          ? "bg-emerald-500 text-white"
                          : active
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-500"
                      )}
                    >
                      {done ? <CheckCircle2 className="size-3.5" /> : s.n}
                    </span>
                    <span className="flex-1 truncate font-medium">{s.label}</span>
                    {active ? (
                      <ChevronLeft className="size-3.5 text-emerald-500" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </Panel>

          {/* progress donut */}
          <Panel className="p-4 text-center">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              پیشرفت برداشت
            </h3>
            <ProgressDonut percent={progressPercent} />
            <div className="mt-3 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="text-slate-500">تکمیل شده</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="size-2 rounded-full bg-sky-400" />
                <span className="text-slate-500">در حال انجام</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="size-2 rounded-full bg-slate-300" />
                <span className="text-slate-500">باقی‌مانده</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* ===== Center column: schematic ===== */}
        <div className="lg:col-span-6">
          <Panel padded={false} className="overflow-hidden">
            {/* toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
              <div className="flex items-center gap-1">
                <ToolBtn icon={MousePointer2} label="انتخاب" />
                <ToolBtn icon={Pencil} label="ویرایش" active={mode === "edit"} />
                <ToolBtn icon={Type} label="متن" />
                <ToolBtn icon={Trash2} label="حذف" />
                <span className="mx-1 h-5 w-px bg-slate-200" />
                <ToolBtn
                  icon={ZoomIn}
                  onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                />
                <ToolBtn
                  icon={ZoomOut}
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                />
                <ToolBtn icon={Undo2} label="بازگشت" />
              </div>
              <span className="text-[10px] font-medium text-slate-400">
                {Math.round(zoom * 100).toLocaleString("fa-IR")}٪
              </span>
            </div>

            {/* schematic canvas */}
            <div className="flex items-center justify-center bg-slate-50 p-6">
              <ElevatorSchematic
                pitWidth={survey.pitWidth}
                pitDepth={survey.pitDepth}
                floorHeight={survey.floorHeight}
                headroom={survey.headroom}
                floors={floors}
                zoom={zoom}
                stage={activeStage}
              />
            </div>

            {/* dimension summary bar */}
            <div className="grid grid-cols-4 gap-px border-t border-slate-100 bg-slate-100 text-center">
              <DimChip label="عرض چاه" value={`${survey.pitWidth.toLocaleString("fa-IR")}`} unit="cm" />
              <DimChip label="عمق چاله" value={survey.pitDepth.toLocaleString("fa-IR")} unit="m" />
              <DimChip label="ارتفاع طبقه" value={survey.floorHeight.toLocaleString("fa-IR")} unit="m" />
              <DimChip label="ارتفاع اورهد" value={survey.headroom.toLocaleString("fa-IR")} unit="m" />
            </div>
          </Panel>
        </div>

        {/* ===== Right column: input panel / files ===== */}
        <div className="lg:col-span-3">
          {mode === "view" ? (
            <Panel className="p-4">
              <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                <Eye className="size-3.5" />
                اطلاعات ثبت‌شده
              </h3>
              <div className="space-y-3">
                <ReadField label="عرض چاه" value={survey.pitWidth} unit="cm" />
                <ReadField label="عمق چاله" value={survey.pitDepth} unit="m" />
                <ReadField label="ارتفاع طبقه" value={survey.floorHeight} unit="m" />
                <ReadField label="ارتفاع اورهد" value={survey.headroom} unit="m" />
                <ReadField
                  label="ارتفاع سفر کل"
                  value={travel}
                  unit="m"
                  strong
                />
              </div>
              <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-center">
                <div className="text-[10px] text-emerald-600">وضعیت برداشت</div>
                <div className="mt-1 text-sm font-bold text-emerald-700">
                  {saved ? "تکمیل شده" : "در حال انجام"}
                </div>
              </div>
              <button
                onClick={() => setMode("edit")}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                <Pencil className="size-3.5" />
                ویرایش اطلاعات
              </button>
            </Panel>
          ) : (
            <Panel className="p-4">
              <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                <Pencil className="size-3.5" />
                ورودی اطلاعات — آسانسور {elevator.code}
              </h3>
              <div className="space-y-3">
                <DimInput
                  label="عرض چاه"
                  value={survey.pitWidth}
                  onChange={(v) => set("pitWidth", v)}
                  unit="cm"
                />
                <DimInput
                  label="عمق چاله"
                  value={survey.pitDepth}
                  onChange={(v) => set("pitDepth", v)}
                  unit="m"
                  step={0.1}
                />
                <DimInput
                  label="ارتفاع طبقه"
                  value={survey.floorHeight}
                  onChange={(v) => set("floorHeight", v)}
                  unit="m"
                  step={0.1}
                />
                <DimInput
                  label="ارتفاع اورهد"
                  value={survey.headroom}
                  onChange={(v) => set("headroom", v)}
                  unit="m"
                  step={0.1}
                />
              </div>

              {/* type selects */}
              <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-3">
                <TypeSelect label="نوع درب" options={["اتوماتیک تلسکوپی", "اتوماتیک مرکزی", "دستی"]} />
                <TypeSelect label="نوع کابین" options={["استاندارد", "لوکس", "وانت"]}/>
                <TypeSelect label="نوع موتور" options={["گیرلس", "گیربکسی"]} />
              </div>

              <button
                onClick={save}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                <Save className="size-3.5" />
                ثبت و محاسبه قطعات
              </button>
            </Panel>
          )}
        </div>
      </div>

      {/* ===== Bottom panels (edit mode) ===== */}
      {mode === "edit" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* history */}
          <Panel className="p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
              <History className="size-3.5 text-emerald-600" />
              تاریخچه تغییرات
            </h3>
            <div className="space-y-3 text-[11px]">
              {saved ? (
                <>
                  <HistEntry
                    time="امروز ۱۰:۳۵"
                    text="ثبت برداشت اطلاعات آسانسور"
                    actor="مدیر فنی"
                  />
                  <HistEntry
                    time="امروز ۰۹:۲۰"
                    text="ویرایش ابعاد چاه"
                    actor="مدیر فنی"
                  />
                </>
              ) : (
                <div className="py-4 text-center text-slate-400">
                  هنوز تغییری ثبت نشده است
                </div>
              )}
            </div>
          </Panel>

          {/* technical notes */}
          <Panel className="p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
              <FileText className="size-3.5 text-emerald-600" />
              توضیحات فنی
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="توضیحات فنی محل پروژه..."
              className="h-28 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </Panel>

          {/* project images */}
          <Panel className="p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
              <ImageIcon className="size-3.5 text-emerald-600" />
              تصاویر پروژه
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {["نقشه اولیه.pdf", "عکس چاله.jpg"].map((f) => (
                <div
                  key={f}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 p-2.5"
                >
                  <div className="grid size-10 place-items-center rounded-lg bg-rose-50 text-rose-500">
                    <FileText className="size-5" />
                  </div>
                  <span className="truncate text-[10px] text-slate-600">{f}</span>
                  <button className="text-[10px] font-medium text-emerald-600 hover:text-emerald-700">
                    مشاهده
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* info banner */}
      <div className="flex items-start gap-2 rounded-xl bg-sky-50 p-3 text-xs text-sky-700">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          ارتفاع کل سفر:{" "}
          <strong>{travel.toLocaleString("fa-IR")} متر</strong> — پس از ذخیره در
          مود ویرایش، قطعات با فرمول‌های ثبت‌شده محاسبه و در پیش‌فاکتور تجمیع
          می‌شوند.
        </span>
      </div>
    </div>
  );
}

/* ---- survey sub-components ---- */

function ProgressDonut({ percent }: { percent: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative mx-auto size-28">
      <svg className="size-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#059669"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-xl font-extrabold text-slate-900">
            {percent.toLocaleString("fa-IR")}٪
          </div>
          <div className="text-[9px] text-slate-400">پیشرفت</div>
        </div>
      </div>
    </div>
  );
}

function ElevatorSchematic({
  pitWidth,
  pitDepth,
  floorHeight,
  headroom,
  floors,
  zoom,
  stage,
}: {
  pitWidth: number;
  pitDepth: number;
  floorHeight: number;
  headroom: number;
  floors: number;
  zoom: number;
  stage: number;
}) {
  // نمایش ۳ طبقه به‌عنوان نمونه + چاله + اورهد
  const showFloors = Math.min(floors, 3);
  const travel = showFloors * floorHeight;
  const totalH = travel + pitDepth + headroom;
  const W = 200;
  const H = 360;
  const scale = H / (totalH || 1);
  const shaftW = 140;
  const shaftX = (W - shaftW) / 2;

  // نقاط کلیدی
  const pitY = H - pitDepth * scale;
  const headY = H - totalH * scale;
  const cabinH = floorHeight * scale * 0.7;
  const cabinW = shaftW * 0.6;
  const cabinX = shaftX + (shaftW - cabinW) / 2;
  const cabinY = pitY - cabinH - 5;

  const dimColor = "#ef4444";
  const stageLabels = ["چاله", "آهنکشی", "ریل", "درب", "کابین", "مکانیک", "راه‌اندازی"];

  return (
    <div className="w-full overflow-auto">
      <svg
        viewBox={`0 0 ${W} ${H + 40}`}
        style={{ transform: `scale(${zoom})`, transformOrigin: "center", maxWidth: "100%" }}
        className="mx-auto"
      >
        {/* shaft outer walls */}
        <rect x={shaftX} y={headY} width={shaftW} height={totalH * scale} fill="#f1f5f9" stroke="#64748b" strokeWidth="2" rx="2" />

        {/* pit area */}
        <rect x={shaftX} y={pitY} width={shaftW} height={pitDepth * scale} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
        {stage === 0 && (
          <rect x={shaftX} y={pitY} width={shaftW} height={pitDepth * scale} fill="#fbbf2430" />
        )}

        {/* floor lines */}
        {Array.from({ length: showFloors + 1 }).map((_, i) => {
          const y = pitY - i * floorHeight * scale;
          return (
            <line key={i} x1={shaftX} y1={y} x2={shaftX + shaftW} y2={y} stroke="#94a3b8" strokeWidth="1" />
          );
        })}

        {/* headroom area */}
        <rect x={shaftX} y={headY} width={shaftW} height={headroom * scale} fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="2 2" />

        {/* rails (left & right) */}
        <line x1={shaftX + 10} y1={pitY} x2={shaftX + 10} y2={headY + 5} stroke="#475569" strokeWidth="3" />
        <line x1={shaftX + shaftW - 10} y1={pitY} x2={shaftX + shaftW - 10} y2={headY + 5} stroke="#475569" strokeWidth="3" />
        {stage === 2 && (
          <>
            <rect x={shaftX + 8} y={headY + 5} width="4" height={travel * scale} fill="#0ea5e9" opacity="0.4" />
            <rect x={shaftX + shaftW - 12} y={headY + 5} width="4" height={travel * scale} fill="#0ea5e9" opacity="0.4" />
          </>
        )}

        {/* cabin */}
        <rect x={cabinX} y={cabinY} width={cabinW} height={cabinH} fill={stage === 4 ? "#05966930" : "#cbd5e1"} stroke="#059669" strokeWidth="2" rx="3" />
        {/* cabin door */}
        {stage >= 3 && (
          <rect x={cabinX + cabinW / 2 - 8} y={cabinY + cabinH - 4} width="16" height="6" fill="#0ea5e9" rx="1" />
        )}

        {/* dimension: width (top) */}
        <line x1={shaftX} y1={headY - 14} x2={shaftX + shaftW} y2={headY - 14} stroke={dimColor} strokeWidth="1" />
        <line x1={shaftX} y1={headY - 18} x2={shaftX} y2={headY - 10} stroke={dimColor} strokeWidth="1" />
        <line x1={shaftX + shaftW} y1={headY - 18} x2={shaftX + shaftW} y2={headY - 10} stroke={dimColor} strokeWidth="1" />
        <text x={shaftX + shaftW / 2} y={headY - 18} textAnchor="middle" fontSize="10" fill={dimColor} fontWeight="bold">
          {pitWidth.toLocaleString("fa-IR")}
        </text>

        {/* dimension: total height (right side) */}
        <line x1={shaftX + shaftW + 18} y1={headY} x2={shaftX + shaftW + 18} y2={H} stroke={dimColor} strokeWidth="1" />
        <line x1={shaftX + shaftW + 14} y1={headY} x2={shaftX + shaftW + 22} y2={headY} stroke={dimColor} strokeWidth="1" />
        <line x1={shaftX + shaftW + 14} y1={H} x2={shaftX + shaftW + 22} y2={H} stroke={dimColor} strokeWidth="1" />
        <text x={shaftX + shaftW + 26} y={(headY + H) / 2} textAnchor="start" fontSize="10" fill={dimColor} fontWeight="bold" transform={`rotate(90 ${shaftX + shaftW + 26} ${(headY + H) / 2})`}>
          {(totalH).toLocaleString("fa-IR", { maximumFractionDigits: 1 })}m
        </text>

        {/* dimension: cabin width */}
        <line x1={cabinX} y1={cabinY - 8} x2={cabinX + cabinW} y2={cabinY - 8} stroke={dimColor} strokeWidth="1" />
        <line x1={cabinX} y1={cabinY - 12} x2={cabinX} y2={cabinY - 4} stroke={dimColor} strokeWidth="1" />
        <line x1={cabinX + cabinW} y1={cabinY - 12} x2={cabinX + cabinW} y2={cabinY - 4} stroke={dimColor} strokeWidth="1" />
        <text x={cabinX + cabinW / 2} y={cabinY - 12} textAnchor="middle" fontSize="9" fill={dimColor} fontWeight="bold">
          {(pitWidth * 0.6).toFixed(0)}
        </text>

        {/* stage label badge */}
        <g>
          <rect x={W / 2 - 50} y={H + 8} width="100" height="20" fill="#059669" rx="10" />
          <text x={W / 2} y={H + 22} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
            مرحله {(stage + 1).toLocaleString("fa-IR")} — {stageLabels[stage]}
          </text>
        </g>
      </svg>
    </div>
  );
}

function ToolBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition",
        active
          ? "bg-emerald-100 text-emerald-700"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      )}
      title={label}
    >
      <Icon className="size-3.5" />
      {label ? <span className="hidden sm:inline">{label}</span> : null}
    </button>
  );
}

function DimChip({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="bg-white px-2 py-2.5">
      <div className="text-[9px] text-slate-400">{label}</div>
      <div className="mt-0.5 font-bold text-slate-800">
        {value}
        <span className="ms-0.5 text-[9px] font-normal text-slate-400">{unit}</span>
      </div>
    </div>
  );
}

function DimInput({
  label,
  value,
  onChange,
  unit,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  step?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium text-slate-600">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pl-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
          {unit}
        </span>
      </div>
    </div>
  );
}

function ReadField({
  label,
  value,
  unit,
  strong,
}: {
  label: string;
  value: number;
  unit: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span
        className={cn(
          "text-sm",
          strong ? "font-bold text-emerald-600" : "font-semibold text-slate-800"
        )}
      >
        {value.toLocaleString("fa-IR")}
        <span className="ms-0.5 text-[10px] font-normal text-slate-400">{unit}</span>
      </span>
    </div>
  );
}

function TypeSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium text-slate-600">
        {label}
      </label>
      <select className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100">
        <option value="">— انتخاب —</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function HistEntry({
  time,
  text,
  actor,
}: {
  time: string;
  text: string;
  actor: string;
}) {
  return (
    <div className="flex gap-2">
      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
      <div className="min-w-0">
        <div className="font-medium text-slate-700">{text}</div>
        <div className="text-[10px] text-slate-400">
          {time} • {actor}
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
