"use client";

import { FolderOpen, Cog, ArrowLeft } from "lucide-react";
import { Panel, StatusBadge } from "@/components/easy-lift";
import { useNav } from "@/lib/nav-store";

export function TechnicalPage() {
  const setPage = useNav((s) => s.setPage);

  const projects = [
    { n: "پروژه پارسیان", code: "P-۱۴۰۵۰۱", floors: "۱۲ طبقه", elevators: 4 },
    { n: "پروژه الماس", code: "P-۱۴۰۵۰۲", floors: "۸ طبقه", elevators: 2 },
    { n: "پروژه سپهر", code: "P-۱۴۰۵۰۳", floors: "۶ طبقه", elevators: 1 },
  ];

  const elevators = [
    { n: "آسانسور A3", proj: "پروژه پارسیان", status: "در حال اجرا", tone: "emerald", p: 85 },
    { n: "آسانسور A4", proj: "پروژه پارسیان", status: "برداشت اطلاعات", tone: "sky", p: 25 },
    { n: "آسانسور A1", proj: "پروژه الماس", status: "تأمین کالا", tone: "amber", p: 40 },
    { n: "آسانسور B2", proj: "پروژه سپهر", status: "تحویل موقت", tone: "emerald", p: 95 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          فنی و مهندسی
        </h1>
        <p className="text-sm text-slate-500">
          مدیریت پروژه‌ها و آسانسورها از منظر فنی و اجرایی
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Projects */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
            <FolderOpen className="size-4 text-emerald-600" />
            پروژه‌ها
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {projects.length}
            </span>
          </h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <button
                key={p.code}
                onClick={() => setPage("project")}
                className="el-card-hover flex w-full items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-4 text-right shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FolderOpen className="size-5" />
                  </span>
                  <div>
                    <div className="font-bold text-slate-900">{p.n}</div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      کد: {p.code} • {p.floors} • {p.elevators} آسانسور
                    </div>
                  </div>
                </div>
                <ArrowLeft className="size-4 text-slate-300" />
              </button>
            ))}
          </div>
        </section>

        {/* Elevators */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Cog className="size-4 text-emerald-600" />
            آسانسورها
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {elevators.length}
            </span>
          </h2>
          <div className="space-y-3">
            {elevators.map((e) => (
              <button
                key={e.n}
                onClick={() => setPage("elevator")}
                className="el-card-hover flex w-full items-center justify-between rounded-2xl border border-slate-200/70 bg-white p-4 text-right shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-emerald-400">
                    <Cog className="size-5" />
                  </span>
                  <div>
                    <div className="font-bold text-slate-900">{e.n}</div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {e.proj} • {e.status}
                    </div>
                  </div>
                </div>
                <StatusBadge tone={e.tone as any}>{e.p}٪</StatusBadge>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
