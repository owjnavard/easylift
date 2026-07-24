"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  Cog,
  Save,
  CheckCircle2,
  Info,
  Eye,
  Pencil,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Type,
  Trash2,
  Undo2,
  ChevronLeft,
  ChevronDown,
  History,
  FileText,
  ImageIcon,
  Calculator,
} from "lucide-react";
import { Panel, StatusBadge } from "@/components/easy-lift";
import { useProjectStore, type Elevator, type Project } from "@/lib/project-store";
import {
  SURVEY_STAGES,
  VIEW_TYPES,
  MAP_TYPES,
  EXPORT_FORMATS,
  defaultSurveyValues,
  type ViewType,
  type MapType,
} from "@/lib/survey-stages";
import { cn } from "@/lib/utils";

export function SurveyEditor({
  elevator,
  project,
}: {
  elevator: Elevator;
  project?: Project;
}) {
  const saveElevatorSurvey = useProjectStore((s) => s.saveElevatorSurvey);

  const [survey, setSurvey] = useState<Record<string, number | string>>(
    () => {
      const defaults = defaultSurveyValues();
      if (elevator.survey) {
        return { ...defaults, ...(elevator.survey as any) };
      }
      return defaults;
    }
  );
  const [note, setNote] = useState(elevator.survey?.note ?? "");
  const [mode, setMode] = useState<"view" | "edit">(
    elevator.survey?.completedAt ? "view" : "edit"
  );
  const [activeStage, setActiveStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<number>>(() => {
    if (elevator.survey?.completedAt) {
      return new Set(SURVEY_STAGES.map((s) => s.id));
    }
    return new Set<number>();
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [viewType, setViewType] = useState<ViewType>("top");
  const [mapType, setMapType] = useState<MapType>("pit");
  const [zoom, setZoom] = useState(1);

  const floors = project?.floors ?? 8;
  const stage = SURVEY_STAGES[activeStage];
  const progressPercent = Math.round(
    (completedStages.size / SURVEY_STAGES.length) * 100
  );

  function setField(key: string, value: number | string) {
    setSurvey((s) => ({ ...s, [key]: value }));
  }

  function saveStage() {
    setCompletedStages((prev) => {
      const next = new Set(prev);
      next.add(stage.id);
      return next;
    });
    const allDone = completedStages.size + 1 >= SURVEY_STAGES.length;
    if (allDone) {
      saveElevatorSurvey(
        elevator.id,
        {
          pitWidth: Number(survey.pitWidth) || 170,
          pitDepth: Number(survey.pitDepth) || 1.6,
          floorHeight: Number(survey.floorHeight) || 3.2,
          headroom: Number(survey.headroom) || 3.8,
        },
        note
      );
      setMode("view");
    }
  }

  return (
    <div className="space-y-4">
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
              {stage.id.toLocaleString("fa-IR")} از{" "}
              {SURVEY_STAGES.length.toLocaleString("fa-IR")} — {stage.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <button onClick={() => setMode("view")} className={cn("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition", mode === "view" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
            <Eye className="size-3.5" /> مشاهده
          </button>
          <button onClick={() => setMode("edit")} className={cn("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition", mode === "edit" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
            <Pencil className="size-3.5" /> ویرایش
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-3">
          <Panel className="p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">مراحل ثبت اطلاعات</h3>
            <div className="space-y-1.5">
              {SURVEY_STAGES.map((s, i) => {
                const active = i === activeStage;
                const done = completedStages.has(s.id);
                return (
                  <button key={s.id} onClick={() => setActiveStage(i)} className={cn("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-right text-xs transition", active ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50")}>
                    <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold transition", done ? "bg-emerald-500 text-white" : active ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500")}>
                      {done ? <CheckCircle2 className="size-3.5" /> : s.id}
                    </span>
                    <span className="flex-1 truncate font-medium">{s.label}</span>
                    {active ? <ChevronLeft className="size-3.5 text-emerald-500" /> : null}
                  </button>
                );
              })}
            </div>
          </Panel>
          <Panel className="p-4 text-center">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">پیشرفت برداشت</h3>
            <ProgressDonut percent={progressPercent} />
            <div className="mt-3 text-[11px] text-slate-500">
              {completedStages.size.toLocaleString("fa-IR")} از {SURVEY_STAGES.length.toLocaleString("fa-IR")} مرحله تکمیل شد
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-6">
          <Panel padded={false} className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-2.5">
              <div className="flex items-center gap-1">
                <ToolBtn icon={MousePointer2} label="انتخاب" />
                <ToolBtn icon={Pencil} label="ویرایش" active={mode === "edit"} />
                <ToolBtn icon={Type} label="متن" />
                <ToolBtn icon={Trash2} label="حذف" />
                <span className="mx-1 h-5 w-px bg-slate-200" />
                <ToolBtn icon={ZoomIn} onClick={() => setZoom((z) => Math.min(2, z + 0.1))} />
                <ToolBtn icon={ZoomOut} onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))} />
                <ToolBtn icon={Undo2} label="بازگشت" />
              </div>
              <span className="text-[10px] font-medium text-slate-400">زوم: {Math.round(zoom * 100).toLocaleString("fa-IR")}٪</span>
            </div>

            {mode === "view" && (
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-4 py-2.5">
                <LabeledSelect label="نوع نما" value={viewType} onChange={(v) => setViewType(v as ViewType)} options={VIEW_TYPES.map((t) => ({ value: t.id, label: t.label }))} />
                <LabeledSelect label="نوع نقشه" value={mapType} onChange={(v) => setMapType(v as MapType)} options={MAP_TYPES.map((m) => ({ value: m.id, label: m.label }))} />
                <div className="mr-auto flex items-center gap-1">
                  <span className="text-[10px] text-slate-400">خروجی:</span>
                  {EXPORT_FORMATS.map((f) => {
                    const Icon = f.icon === "FileText" ? FileText : f.icon === "Box" ? Cog : f.icon === "ImageIcon" ? ImageIcon : FileText;
                    return (
                      <button key={f.id} title={f.label} className="grid size-7 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-emerald-600">
                        <Icon className="size-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center bg-slate-50 p-6">
              <ElevatorSchematic survey={survey} floors={floors} zoom={zoom} stage={stage.id} completedStages={completedStages} focusedField={focusedField} viewType={mode === "edit" ? "top" : viewType} mapType={mode === "view" ? mapType : undefined} />
            </div>

            <div className="grid grid-cols-4 gap-px border-t border-slate-100 bg-slate-100 text-center">
              <DimChip label="عرض چاه" value={String(survey.pitWidth ?? "—")} unit="cm" />
              <DimChip label="عمق چاله" value={String(survey.pitDepth ?? "—")} unit="m" />
              <DimChip label="ارتفاع طبقه" value={String(survey.floorHeight ?? "—")} unit="m" />
              <DimChip label="ارتفاع اورهد" value={String(survey.headroom ?? "—")} unit="m" />
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-3">
          {mode === "view" ? (
            <Panel className="p-4">
              <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                <Eye className="size-3.5" /> اطلاعات ثبت‌شده — {stage.label}
              </h3>
              <div className="space-y-3">
                {stage.fields.map((f) => (
                  <ReadField key={f.key} label={f.label} value={survey[f.key] ?? "—"} unit={f.unit} />
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-center">
                <div className="text-[10px] text-emerald-600">وضعیت برداشت</div>
                <div className="mt-1 text-sm font-bold text-emerald-700">
                  {completedStages.has(stage.id) ? "تکمیل شده" : "در حال انجام"}
                </div>
              </div>
              <button onClick={() => setMode("edit")} className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">
                <Pencil className="size-3.5" /> ویرایش اطلاعات
              </button>
            </Panel>
          ) : (
            <Panel className="p-4">
              <h3 className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                <Pencil className="size-3.5" /> ورودی اطلاعات — {stage.label}
              </h3>
              <p className="mb-3 text-[10px] text-slate-400">
                فیلدهای مرحله {(activeStage + 1).toLocaleString("fa-IR")} از {SURVEY_STAGES.length.toLocaleString("fa-IR")}
              </p>
              <div className="space-y-3">
                {stage.fields.map((f) => {
                  const isText = f.unit === "";
                  const val = survey[f.key];
                  return (
                    <div key={f.key}>
                      <label className="mb-1 block text-[11px] font-medium text-slate-600">{f.label}</label>
                      <div className="relative">
                        <input
                          type={isText ? "text" : "number"}
                          step={f.step}
                          value={val ?? ""}
                          onChange={(e) => setField(f.key, isText ? e.target.value : Number(e.target.value))}
                          onFocus={() => setFocusedField(f.key)}
                          onBlur={() => setFocusedField(null)}
                          placeholder={f.placeholder}
                          className={cn(
                            "w-full rounded-lg border bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:bg-white focus:ring-2",
                            focusedField === f.key ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100",
                            !isText && "pl-10"
                          )}
                        />
                        {!isText && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">{f.unit}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={saveStage} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700">
                <Save className="size-3.5" /> ثبت مرحله {stage.label}
              </button>
              {completedStages.has(stage.id) ? (
                <div className="mt-2 flex items-center justify-center gap-1 text-[11px] font-medium text-emerald-600">
                  <CheckCircle2 className="size-3.5" /> این مرحله تکمیل شده است
                </div>
              ) : null}
            </Panel>
          )}
        </div>
      </div>

      {mode === "edit" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
              <History className="size-3.5 text-emerald-600" /> تاریخچه تغییرات
            </h3>
            <div className="space-y-3 text-[11px]">
              {Array.from(completedStages).map((sid) => {
                const s = SURVEY_STAGES.find((x) => x.id === sid);
                return (
                  <div key={sid} className="flex gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <div className="min-w-0">
                      <div className="font-medium text-slate-700">تکمیل مرحله {s?.label ?? ""}</div>
                      <div className="text-[10px] text-slate-400">امروز • مدیر فنی</div>
                    </div>
                  </div>
                );
              })}
              {completedStages.size === 0 ? <div className="py-4 text-center text-slate-400">هنوز مرحله‌ای تکمیل نشده است</div> : null}
            </div>
          </Panel>
          <Panel className="p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
              <FileText className="size-3.5 text-emerald-600" /> توضیحات فنی
            </h3>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="توضیحات فنی محل پروژه..." className="h-28 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100" />
          </Panel>
          <Panel className="p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
              <ImageIcon className="size-3.5 text-emerald-600" /> تصاویر پروژه
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {["نقشه اولیه.pdf", "عکس چاله.jpg"].map((f) => (
                <div key={f} className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 p-2.5">
                  <div className="grid size-10 place-items-center rounded-lg bg-rose-50 text-rose-500"><FileText className="size-5" /></div>
                  <span className="truncate text-[10px] text-slate-600">{f}</span>
                  <button className="text-[10px] font-medium text-emerald-600 hover:text-emerald-700">مشاهده</button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      <div className="flex items-start gap-2 rounded-xl bg-sky-50 p-3 text-xs text-sky-700">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          {mode === "edit"
            ? "نقشه در نمای بالا نمایش داده می‌شود. با انتخاب هر ورودی، اندازه مربوطه روی نقشه قرمز می‌شود. پس از تکمیل هر مرحله، جزئیات به نقشه اضافه می‌گردد."
            : "با تغییر نوع نما و نوع نقشه، شماتیک متناسب نمایش داده می‌شود. خروجی نقشه در فرمت‌های مختلف قابل دریافت است."}
        </span>
      </div>
    </div>
  );
}

function ProgressDonut({ percent }: { percent: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="relative mx-auto size-28">
      <svg className="size-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#059669" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} className="transition-all duration-500" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-xl font-extrabold text-slate-900">{percent.toLocaleString("fa-IR")}٪</div>
          <div className="text-[9px] text-slate-400">پیشرفت</div>
        </div>
      </div>
    </div>
  );
}

function ElevatorSchematic({ survey, floors, zoom, stage, completedStages, focusedField, viewType, mapType }: {
  survey: Record<string, number | string>; floors: number; zoom: number; stage: number; completedStages: Set<number>; focusedField: string | null; viewType: ViewType; mapType?: MapType;
}) {
  const pitWidth = Number(survey.pitWidth) || 170;
  const pitDepth = Number(survey.pitDepth) || 1.6;
  const floorHeight = Number(survey.floorHeight) || 3.2;
  const headroom = Number(survey.headroom) || 3.8;
  const dimColor = "#ef4444";
  const stdColor = "#94a3b8";
  const labelColor = "#475569";
  const dimColorFor = (key: string) => (focusedField === key ? dimColor : stdColor);

  if (viewType === "top") {
    const W = 280, H = 260, cx = W / 2, cy = H / 2, shaftW = 160, shaftH = 200;
    const sx = cx - shaftW / 2, sy = cy - shaftH / 2;
    const cabW = shaftW * 0.6, cabH = shaftH * 0.55, cabX = cx - cabW / 2, cabY = cy - cabH / 2;
    return (
      <div className="w-full overflow-auto">
        <svg viewBox={`0 0 ${W} ${H + 50}`} style={{ transform: `scale(${zoom})`, transformOrigin: "center", maxWidth: "100%" }} className="mx-auto">
          <text x={W / 2} y={18} textAnchor="middle" fontSize="11" fill={labelColor} fontWeight="bold">{mapType ? MAP_TYPES.find((m) => m.id === mapType)?.label : "نمای بالا — پلان چاه"}</text>
          <rect x={sx} y={sy} width={shaftW} height={shaftH} fill="#f1f5f9" stroke="#64748b" strokeWidth="2" rx="2" />
          {completedStages.has(1) && <rect x={sx + 4} y={sy + shaftH - 30} width={shaftW - 8} height="26" fill="#fef3c7" opacity="0.6" />}
          {completedStages.has(3) && (<><rect x={sx + 8} y={sy + 6} width="6" height={shaftH - 12} fill="#0ea5e9" opacity="0.5" rx="1" /><rect x={sx + shaftW - 14} y={sy + 6} width="6" height={shaftH - 12} fill="#0ea5e9" opacity="0.5" rx="1" /></>)}
          {completedStages.has(2) && (<><line x1={sx + 8} y1={sy + 30} x2={sx + shaftW - 8} y2={sy + 30} stroke="#475569" strokeWidth="2" strokeDasharray="4 2" /><line x1={sx + 8} y1={sy + shaftH - 30} x2={sx + shaftW - 8} y2={sy + shaftH - 30} stroke="#475569" strokeWidth="2" strokeDasharray="4 2" /></>)}
          <rect x={cabX} y={cabY} width={cabW} height={cabH} fill={focusedField === "cabinWidth" || focusedField === "cabinDepth" ? "#fee2e2" : "#cbd5e1"} stroke="#059669" strokeWidth="2" rx="3" />
          {completedStages.has(5) && <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9" fill="#475569" fontWeight="bold">کابین</text>}
          {completedStages.has(4) && <rect x={cx - 20} y={sy + shaftH - 8} width="40" height="6" fill="#0ea5e9" rx="1" />}
          {completedStages.has(6) && <rect x={sx + shaftW - 24} y={sy + 40} width="10" height="50" fill="#a78bfa" opacity="0.6" rx="1" />}
          <DimLine x1={sx} y1={sy - 18} x2={sx + shaftW} y2={sy - 18} color={dimColorFor("pitWidth")} label={pitWidth.toLocaleString("fa-IR")} side="h" />
          <DimLine x1={sx + shaftW + 18} y1={sy} x2={sx + shaftW + 18} y2={sy + shaftH} color={dimColorFor("pitDepth")} label={pitDepth.toLocaleString("fa-IR")} side="v" />
          <DimLine x1={cabX} y1={cabY - 12} x2={cabX + cabW} y2={cabY - 12} color={dimColorFor("cabinWidth")} label={String(survey.cabinWidth ?? "—")} side="h" />
          <DimLine x1={cabX + cabW + 12} y1={cabY} x2={cabX + cabW + 12} y2={cabY + cabH} color={dimColorFor("cabinDepth")} label={String(survey.cabinDepth ?? "—")} side="v" />
          <StageBadge stage={stage} x={W / 2} y={H + 30} />
        </svg>
      </div>
    );
  }

  const W = 240, H = 380;
  const showFloors = Math.min(floors, 4);
  const travel = showFloors * floorHeight;
  const totalH = travel + pitDepth + headroom;
  const scale = (H - 60) / (totalH || 1);
  const shaftW = 130, shaftX = (W - shaftW) / 2;
  const pitY = H - 30 - pitDepth * scale;
  const headY = H - 30 - totalH * scale;
  const cabinH = floorHeight * scale * 0.7, cabinW = shaftW * 0.6;
  const cabinX = shaftX + (shaftW - cabinW) / 2, cabinY = pitY - cabinH - 5;
  const viewLabel = viewType === "front" ? "نمای جلو" : viewType === "back" ? "نمای پشت" : viewType === "right" ? "نمای راست" : viewType === "left" ? "نمای چپ" : "نمای سه‌بعدی";

  return (
    <div className="w-full overflow-auto">
      <svg viewBox={`0 0 ${W} ${H + 30}`} style={{ transform: `scale(${zoom})`, transformOrigin: "center", maxWidth: "100%" }} className="mx-auto">
        <text x={W / 2} y={18} textAnchor="middle" fontSize="11" fill={labelColor} fontWeight="bold">{mapType ? MAP_TYPES.find((m) => m.id === mapType)?.label : viewLabel}</text>
        <rect x={shaftX} y={headY} width={shaftW} height={totalH * scale} fill="#f1f5f9" stroke="#64748b" strokeWidth="2" rx="2" />
        <rect x={shaftX} y={pitY} width={shaftW} height={pitDepth * scale} fill={focusedField === "pitDepth" ? "#fecaca" : "#e2e8f0"} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
        {Array.from({ length: showFloors + 1 }).map((_, i) => { const y = pitY - i * floorHeight * scale; return <line key={i} x1={shaftX} y1={y} x2={shaftX + shaftW} y2={y} stroke="#94a3b8" strokeWidth="1" />; })}
        <rect x={shaftX} y={headY} width={shaftW} height={headroom * scale} fill={focusedField === "headroom" ? "#fecaca" : "#e0f2fe"} stroke="#7dd3fc" strokeWidth="1" strokeDasharray="2 2" />
        {completedStages.has(3) && (<><line x1={shaftX + 10} y1={pitY} x2={shaftX + 10} y2={headY + 5} stroke={focusedField === "railType" ? dimColor : "#475569"} strokeWidth="3" /><line x1={shaftX + shaftW - 10} y1={pitY} x2={shaftX + shaftW - 10} y2={headY + 5} stroke={focusedField === "railType" ? dimColor : "#475569"} strokeWidth="3" /></>)}
        {completedStages.has(2) && (<><line x1={shaftX} y1={pitY - 10} x2={shaftX + shaftW} y2={pitY - 10} stroke={focusedField === "ironProfileType" ? dimColor : "#475569"} strokeWidth="2" /><line x1={shaftX} y1={headY + headroom * scale + 5} x2={shaftX + shaftW} y2={headY + headroom * scale + 5} stroke={focusedField === "ironProfileType" ? dimColor : "#475569"} strokeWidth="2" /></>)}
        <rect x={cabinX} y={cabinY} width={cabinW} height={cabinH} fill={focusedField === "cabinHeight" ? "#fecaca" : "#cbd5e1"} stroke="#059669" strokeWidth="2" rx="3" />
        {completedStages.has(4) && <rect x={cabinX + cabinW / 2 - 8} y={cabinY + cabinH - 4} width="16" height="6" fill={focusedField === "doorWidth" ? dimColor : "#0ea5e9"} rx="1" />}
        <DimLine x1={shaftX} y1={headY - 14} x2={shaftX + shaftW} y2={headY - 14} color={dimColorFor("pitWidth")} label={pitWidth.toLocaleString("fa-IR")} side="h" />
        <DimLine x1={shaftX + shaftW + 18} y1={headY} x2={shaftX + shaftW + 18} y2={H - 30} color={dimColorFor("floorHeight")} label={totalH.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} side="v" />
        <DimLine x1={cabinX} y1={cabinY - 10} x2={cabinX + cabinW} y2={cabinY - 10} color={dimColorFor("cabinWidth")} label={String(survey.cabinWidth ?? "—")} side="h" />
        <StageBadge stage={stage} x={W / 2} y={H - 8} />
      </svg>
    </div>
  );
}

function DimLine({ x1, y1, x2, y2, color, label, side }: { x1: number; y1: number; x2: number; y2: number; color: string; label: string; side: "h" | "v" }) {
  const isH = side === "h";
  const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" />
      <line x1={x1} y1={y1 - 4} x2={x1} y2={y1 + 4} stroke={color} strokeWidth="1" />
      <line x1={x2} y1={y2 - 4} x2={x2} y2={y2 + 4} stroke={color} strokeWidth="1" />
      <text x={midX} y={midY} textAnchor="middle" fontSize="9" fill={color} fontWeight="bold" transform={isH ? "" : `rotate(-90 ${midX} ${midY})`} dy={isH ? -3 : 3}>{label}</text>
    </g>
  );
}

function StageBadge({ stage, x, y }: { stage: number; x: number; y: number }) {
  const s = SURVEY_STAGES.find((st) => st.id === stage);
  return (
    <g>
      <rect x={x - 55} y={y - 10} width="110" height="18" fill="#059669" rx="9" />
      <text x={x} y={y + 3} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">مرحله {stage.toLocaleString("fa-IR")} — {s?.label}</text>
    </g>
  );
}

function ToolBtn({ icon: Icon, label, active, onClick }: { icon: React.ComponentType<{ className?: string }>; label?: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={cn("inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition", active ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700")} title={label}>
      <Icon className="size-3.5" />
      {label ? <span className="hidden sm:inline">{label}</span> : null}
    </button>
  );
}

function DimChip({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-white px-2 py-2.5">
      <div className="text-[9px] text-slate-400">{label}</div>
      <div className="mt-0.5 font-bold text-slate-800">{value}<span className="ms-0.5 text-[9px] font-normal text-slate-400">{unit}</span></div>
    </div>
  );
}

function ReadField({ label, value, unit, strong }: { label: string; value: number | string; unit: string; strong?: boolean }) {
  const display = typeof value === "number" ? value.toLocaleString("fa-IR") : String(value);
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className={cn("text-sm", strong ? "font-bold text-emerald-600" : "font-semibold text-slate-800")}>
        {display || "—"}
        {unit ? <span className="ms-0.5 text-[10px] font-normal text-slate-400">{unit}</span> : null}
      </span>
    </div>
  );
}

function LabeledSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex items-center gap-1.5">
      <label className="text-[10px] font-semibold text-slate-500">{label}:</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none rounded-md border border-slate-200 bg-white py-1.5 pr-7 pl-2 text-[11px] font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100">
          {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
        <ChevronDown className="pointer-events-none absolute left-1.5 top-1/2 size-3 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

void Calculator;
void Cog;
