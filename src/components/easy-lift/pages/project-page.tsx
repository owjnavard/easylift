"use client";

import { useState } from "react";
import { ArrowRight, Plus, Building2, Warehouse, User, FileText, FolderOpen } from "lucide-react";
import { useNav } from "@/lib/nav-store";
import { Panel, StatusBadge, StatBar } from "@/components/easy-lift";
import { cn } from "@/lib/utils";

const TABS = [
  "اطلاعات عمومی",
  "آسانسورها",
  "انبار پروژه",
  "کارفرما",
  "تعهدات فنی",
] as const;

export function ProjectPage() {
  const setPage = useNav((s) => s.setPage);
  const [tab, setTab] = useState(0);

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
              پروژه پارسیان
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">کد پروژه: P-۱۴۰۵۰۱</p>
          </div>
        </div>
        <StatusBadge tone="emerald" className="px-3 py-1.5 text-xs">
          فعال
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
                { l: "نام پروژه", v: "پارسیان" },
                { l: "کد پروژه", v: "P-140501" },
                { l: "مکان", v: "تهران، شهرک غرب" },
                { l: "تاریخ شروع", v: "۱۴۰۵/۰۲/۱۵" },
                { l: "تاریخ پایان", v: "۱۴۰۵/۰۸/۱۵" },
                { l: "وضعیت", v: "فعال" },
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
                <span className="font-bold text-emerald-600">۷۴٪</span>
              </div>
              <StatBar percent={74} barClass="bg-emerald-500" />
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
              {[
                { n: "آسانسور A3", s: "در حال اجرا", p: 85, t: "emerald" },
                { n: "آسانسور A4", s: "برداشت اطلاعات", p: 25, t: "sky" },
                { n: "آسانسور A5", s: "طراحی", p: 10, t: "amber" },
                { n: "آسانسور A6", s: "تحویل موقت", p: 95, t: "emerald" },
              ].map((e) => (
                <button
                  key={e.n}
                  onClick={() => setPage("elevator")}
                  className="el-card-hover rounded-xl border border-slate-200/70 p-4 text-right"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900">{e.n}</div>
                    <StatusBadge tone={e.t as any}>{e.s}</StatusBadge>
                  </div>
                  <div className="mt-3">
                    <StatBar
                      percent={e.p}
                      value={`${e.p.toLocaleString("fa-IR")}٪`}
                      barClass="bg-emerald-500"
                    />
                  </div>
                </button>
              ))}
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
                    شرکت ساختمانی پارسیان
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">شخص حقوقی</div>
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
              آدرس: تهران، شهرک غرب، خیابان فروردین، پلاک ۱۲
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
                  نصب کامل ۲ آسانسور مسافربری با ظرفیت ۱۳ نفر، شامل تأمین موتور،
                  ریل، کابین و تابلو فرمان.
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
      </Panel>
    </div>
  );
}
