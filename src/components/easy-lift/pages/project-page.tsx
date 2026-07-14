"use client";

import { useState } from "react";
import {
  ArrowRight,
  Plus,
  Building2,
  Warehouse,
  User,
  FileText,
  FolderOpen,
  History,
  Cog,
} from "lucide-react";
import { useNav } from "@/lib/nav-store";
import { useProjectStore, type ProjectHistoryEntry } from "@/lib/project-store";
import { Panel, StatusBadge, StatBar } from "@/components/easy-lift";
import { cn } from "@/lib/utils";

const TABS = [
  "اطلاعات عمومی",
  "آسانسورها",
  "انبار پروژه",
  "کارفرما",
  "تعهدات فنی",
  "تاریخچه پروژه",
] as const;

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

export function ProjectPage() {
  const setPage = useNav((s) => s.setPage);
  const [tab, setTab] = useState(0);
  const projectId = useProjectStore((s) => s.selectedProjectId);
  const project = useProjectStore((s) =>
    s.projects.find((p) => p.id === projectId)
  );
  const elevators = useProjectStore((s) => s.elevators);
  const selectElevator = useProjectStore((s) => s.selectElevator);

  const projectElevators = project
    ? elevators.filter((e) => e.projectId === project.id)
    : [];

  // fallback if no project selected
  if (!project) {
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
          <FolderOpen className="mx-auto size-12 text-slate-300" />
          <h2 className="mt-4 text-base font-bold text-slate-600">
            پروژه‌ای انتخاب نشده است
          </h2>
          <button
            onClick={() => setPage("technical")}
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            رفتن به فنی و مهندسی
          </button>
        </Panel>
      </div>
    );
  }

  const surveyedCount = projectElevators.filter(
    (e) => e.survey?.completedAt
  ).length;
  const avgProgress =
    projectElevators.length > 0
      ? Math.round(
          projectElevators.reduce((s, e) => s + e.progress, 0) /
            projectElevators.length
        )
      : 0;

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
          <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <FolderOpen className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {project.name}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              کد پروژه: {project.code}
            </p>
          </div>
        </div>
        <StatusBadge
          tone={project.status === "active" ? "emerald" : "slate"}
          className="px-3 py-1.5 text-xs"
        >
          {project.status === "active" ? "فعال" : "Draft"}
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

      <Panel className="mt-6 min-h-[400px] p-5 sm:p-6">
        {tab === 0 && (
          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-900">
              اطلاعات عمومی پروژه
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { l: "نام پروژه", v: project.name },
                { l: "کد پروژه", v: project.code },
                { l: "مشتری", v: project.customer },
                { l: "مکان", v: project.address },
                { l: "کاربری", v: project.buildingType },
                { l: "تعداد طبقات", v: project.floors.toLocaleString("fa-IR") },
                { l: "واحد در طبقه", v: project.unitsPerFloor.toLocaleString("fa-IR") },
                { l: "تعداد آسانسور", v: project.elevatorCount.toLocaleString("fa-IR") },
                { l: "وضعیت", v: project.status === "active" ? "فعال" : "Draft" },
              ].map((f) => (
                <div key={f.l} className="rounded-xl bg-slate-50 p-4">
                  <div className="text-[11px] text-slate-500">{f.l}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">
                    {f.v}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-slate-500">پیشرفت کلی پروژه</span>
                <span className="font-bold text-emerald-600">
                  {avgProgress.toLocaleString("fa-IR")}٪
                </span>
              </div>
              <StatBar percent={avgProgress} barClass="bg-emerald-500" />
            </div>
          </div>
        )}

        {tab === 1 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">لیست آسانسورها</h3>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700">
                <Plus className="size-3.5" />
                افزودن
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {projectElevators.map((e) => {
                const done = !!e.survey?.completedAt;
                return (
                  <button
                    key={e.id}
                    onClick={() => {
                      selectElevator(e.id);
                      setPage("elevator");
                    }}
                    className="el-card-hover rounded-xl border border-slate-200/70 p-4 text-right"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cog className="size-4 text-slate-400" />
                        <div className="font-bold text-slate-900">{e.name}</div>
                      </div>
                      <StatusBadge tone={done ? "emerald" : "amber"}>
                        {done ? "برداشت تکمیل" : "در انتظار"}
                      </StatusBadge>
                    </div>
                    <div className="mt-3">
                      <StatBar
                        percent={e.progress}
                        value={`${e.progress.toLocaleString("fa-IR")}٪`}
                        barClass="bg-emerald-500"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === 2 && (
          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-900">انبار پروژه</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <Warehouse className="size-5 text-emerald-600" />
                <div className="mt-2 text-xs text-slate-500">تعداد اقلام</div>
                <div className="text-xl font-extrabold text-slate-900">۴۲</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">موجودی</div>
                <StatBar percent={68} value="۶۸٪" barClass="bg-emerald-500" className="mt-2" />
              </div>
              <div className="rounded-xl bg-rose-50/60 p-4">
                <div className="text-xs text-rose-500">کسری</div>
                <div className="mt-1 text-xl font-extrabold text-rose-600">۷ مورد</div>
              </div>
            </div>
          </div>
        )}

        {tab === 3 && (
          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-900">کارفرما</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Building2 className="size-5" />
                </span>
                <div>
                  <div className="font-semibold text-slate-900">
                    {project.customer}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">کارفرما</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
                  <User className="size-5" />
                </span>
                <div>
                  <div className="font-semibold text-slate-900" dir="ltr">
                    ۰۹۱۲xxx
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">تماس کارفرما</div>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
              آدرس: {project.address}
            </div>
          </div>
        )}

        {tab === 4 && (
          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-900">
              مشخصات فنی و تعهدات
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <FileText className="size-5 text-emerald-600" />
                <div className="mt-2 font-semibold text-slate-900">
                  تعهدات پیمانکار
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  نصب کامل {project.elevatorCount.toLocaleString("fa-IR")} آسانسور
                  مسافربری شامل تأمین موتور، ریل، کابین و تابلو فرمان.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <FileText className="size-5 text-sky-600" />
                <div className="mt-2 font-semibold text-slate-900">زمان تحویل</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  مدت اجرا: ۶ ماه<br />
                  تحویل موقت: ۱۴۰۵/۰۷/۱۵<br />
                  تحویل قطعی: ۱۴۰۵/۰۸/۱۵
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === 5 && <ProjectHistoryTab history={project.history} />}
      </Panel>
    </div>
  );
}

function ProjectHistoryTab({ history }: { history: ProjectHistoryEntry[] }) {
  const events = [...history].reverse();
  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
        <History className="size-4 text-emerald-600" />
        تاریخچه پروژه
      </h3>
      {events.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-400">
          هنوز رویدادی ثبت نشده است
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((e, i) => (
            <div key={e.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <History className="size-4" />
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
                  توسط {e.actor}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
