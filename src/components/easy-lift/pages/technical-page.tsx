"use client";

import { FolderOpen, Cog, ArrowLeft } from "lucide-react";
import { Panel, StatusBadge } from "@/components/easy-lift";
import { useProjectStore } from "@/lib/project-store";
import { useNav } from "@/lib/nav-store";
import { useShallow } from "zustand/react/shallow";

export function TechnicalPage() {
  const projects = useProjectStore((s) => s.projects);
  const elevators = useProjectStore((s) => s.elevators);
  const selectProject = useProjectStore((s) => s.selectProject);
  const selectElevator = useProjectStore((s) => s.selectElevator);
  const setPage = useNav((s) => s.setPage);

  function openProject(projectId: string) {
    selectProject(projectId);
    setPage("project");
  }

  function openElevator(elevatorId: string) {
    selectElevator(elevatorId);
    setPage("elevator");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          فنی و مهندسی
        </h1>
        <p className="text-sm text-slate-500">
          مدیریت پروژه‌ها و آسانسورها از منظر فنی و اجرایی — شامل پروژه‌های پیش‌نویس (Draft) ایجاد‌شده از پیش‌فاکتورها
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Projects */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
            <FolderOpen className="size-4 text-emerald-600" />
            پروژه‌ها
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {projects.length.toLocaleString("fa-IR")}
            </span>
          </h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => openProject(p.id)}
                className="el-card-hover flex w-full items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-4 text-right shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FolderOpen className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      کد: {p.code} • {p.customer} • {p.floors.toLocaleString("fa-IR")} طبقه
                    </div>
                  </div>
                </div>
                <StatusBadge tone={p.status === "active" ? "emerald" : "slate"}>
                  {p.status === "active" ? "فعال" : "Draft"}
                </StatusBadge>
              </button>
            ))}
            {projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
                هنوز پروژه‌ای ایجاد نشده است
              </div>
            ) : null}
          </div>
        </section>

        {/* Elevators */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Cog className="size-4 text-emerald-600" />
            آسانسورها
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {elevators.length.toLocaleString("fa-IR")}
            </span>
          </h2>
          <div className="space-y-3">
            {elevators.map((e) => {
              const proj = projects.find((p) => p.id === e.projectId);
              const done = !!e.survey?.completedAt;
              const tone =
                e.status === "executing" || e.status === "delivered"
                  ? "emerald"
                  : done
                    ? "sky"
                    : "amber";
              const label =
                e.status === "executing"
                  ? "در حال اجرا"
                  : e.status === "calculated"
                    ? "برداشت تکمیل"
                    : e.status === "design"
                      ? "در انتظار برداشت"
                      : e.status;
              return (
                <button
                  key={e.id}
                  onClick={() => openElevator(e.id)}
                  className="el-card-hover flex w-full items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-4 text-right shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-emerald-400">
                      <Cog className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900">{e.name}</div>
                      <div className="mt-0.5 truncate text-xs text-slate-500">
                        {proj?.name ?? "—"}
                      </div>
                    </div>
                  </div>
                  <StatusBadge tone={tone as any}>
                    {typeof e.progress === "number" && e.progress > 0
                      ? `${e.progress.toLocaleString("fa-IR")}٪`
                      : label}
                  </StatusBadge>
                </button>
              );
            })}
            {elevators.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
                هنوز آسانسوری ثبت نشده است
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

void ArrowLeft;
