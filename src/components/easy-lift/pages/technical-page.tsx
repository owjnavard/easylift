"use client";

import { FolderOpen, Cog } from "lucide-react";
import { Panel, StatusBadge } from "@/components/easy-lift";
import { useNav } from "@/lib/nav-store";

export function TechnicalPage() {
  const setPage = useNav((s) => s.setPage);

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 lg:text-3xl">
          فنی و مهندسی
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          مدیریت پروژه‌ها و آسانسورها از نظر فنی و اجرایی
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Projects */}
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-800">
            <FolderOpen className="size-5 text-blue-600" />
            پروژه‌ها
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => setPage("project")}
              className="w-full rounded-3xl border border-transparent bg-white p-6 text-right shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="font-medium text-slate-800">پروژه پارسیان</div>
              <div className="mt-1 text-sm text-slate-500">
                کد: P-۱۴۰۵۰۱ • ۱۲ طبقه
              </div>
            </button>
            <button
              onClick={() => setPage("project")}
              className="w-full rounded-3xl border border-transparent bg-white p-6 text-right shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="font-medium text-slate-800">پروژه الماس</div>
              <div className="mt-1 text-sm text-slate-500">
                کد: P-۱۴۰۵۰۲ • ۸ طبقه
              </div>
            </button>
            <button
              onClick={() => setPage("project")}
              className="w-full rounded-3xl border border-transparent bg-white p-6 text-right shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="font-medium text-slate-800">پروژه سپهر</div>
              <div className="mt-1 text-sm text-slate-500">
                کد: P-۱۴۰۵۰۳ • ۶ طبقه
              </div>
            </button>
          </div>
        </section>

        {/* Elevators */}
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-800">
            <Cog className="size-5 text-blue-600" />
            آسانسورها
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => setPage("elevator")}
              className="flex w-full items-center justify-between rounded-3xl border border-transparent bg-white p-6 text-right shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div>
                <div className="font-semibold text-slate-800">آسانسور A3</div>
                <div className="mt-1 text-sm text-emerald-600">
                  پروژه پارسیان • در حال اجرا
                </div>
              </div>
              <StatusBadge tone="green" className="hidden sm:inline-flex">
                ۸۵٪ پیشرفت
              </StatusBadge>
            </button>
            <button
              onClick={() => setPage("elevator")}
              className="flex w-full items-center justify-between rounded-3xl border border-transparent bg-white p-6 text-right shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div>
                <div className="font-semibold text-slate-800">آسانسور A4</div>
                <div className="mt-1 text-sm text-blue-600">
                  پروژه پارسیان • برداشت اطلاعات
                </div>
              </div>
              <StatusBadge tone="blue" className="hidden sm:inline-flex">
                ۲۵٪ پیشرفت
              </StatusBadge>
            </button>
            <button
              onClick={() => setPage("elevator")}
              className="flex w-full items-center justify-between rounded-3xl border border-transparent bg-white p-6 text-right shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div>
                <div className="font-semibold text-slate-800">آسانسور A1</div>
                <div className="mt-1 text-sm text-amber-600">
                  پروژه الماس • در انتظار تأمین کالا
                </div>
              </div>
              <StatusBadge tone="amber" className="hidden sm:inline-flex">
                ۴۰٪ پیشرفت
              </StatusBadge>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
