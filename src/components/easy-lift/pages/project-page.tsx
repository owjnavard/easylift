"use client";

import { useState } from "react";
import { ArrowRight, Plus, Building2, Warehouse, User, FileText } from "lucide-react";
import { useNav } from "@/lib/nav-store";
import { Panel, StatusBadge, StatBar } from "@/components/easy-lift";
import { cn } from "@/lib/utils";

const TABS = [
  "اطلاعات عمومی پروژه",
  "لیست آسانسورها",
  "انبار پروژه",
  "کارفرما",
  "مشخصات فنی و تعهدات",
] as const;

export function ProjectPage() {
  const setPage = useNav((s) => s.setPage);
  const [tab, setTab] = useState(0);

  return (
    <div className="p-4 lg:p-8">
      <button
        onClick={() => setPage("technical")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
      >
        <ArrowRight className="size-4" />
        بازگشت به فنی و مهندسی
      </button>

      <h1 className="text-2xl font-black text-slate-800 lg:text-3xl">
        پروژه پارسیان
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        کد پروژه: P-۱۴۰۵۰۱ • وضعیت:{" "}
        <StatusBadge tone="green" className="ms-1">
          فعال
        </StatusBadge>
      </p>

      {/* Tabs */}
      <div className="el-tabs-row mt-8 flex gap-8 overflow-x-auto border-b border-slate-200 pb-1">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={cn("el-tab pb-4 text-sm", tab === i && "active")}
          >
            {t}
          </button>
        ))}
      </div>

      <Panel className="mt-8 min-h-[450px] p-6 lg:p-8">
        {tab === 0 && (
          <div>
            <h3 className="mb-5 text-lg font-bold text-slate-800">
              اطلاعات عمومی پروژه
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { l: "نام پروژه", v: "پارسیان" },
                { l: "کد پروژه", v: "P-140501" },
                { l: "مکان", v: "تهران، شهرک غرب" },
                { l: "تاریخ شروع", v: "۱۴۰۵/۰۲/۱۵" },
                { l: "تاریخ پایان", v: "۱۴۰۵/۰۸/۱۵" },
                { l: "وضعیت", v: "فعال" },
              ].map((f) => (
                <div key={f.l} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{f.l}</div>
                  <div className="mt-1 font-semibold text-slate-800">{f.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-500">پیشرفت کلی پروژه</span>
                <span className="font-bold text-blue-600">۷۴٪</span>
              </div>
              <StatBar percent={74} barClass="bg-blue-600" />
            </div>
          </div>
        )}

        {tab === 1 && (
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                لیست آسانسورها
              </h3>
              <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                <Plus className="size-4" />
                افزودن آسانسور
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { n: "آسانسور A3", s: "در حال اجرا", p: 85, t: "green" },
                { n: "آسانسور A4", s: "برداشت اطلاعات", p: 25, t: "blue" },
                { n: "آسانسور A5", s: "طراحی", p: 10, t: "amber" },
                { n: "آسانسور A6", s: "تحویل موقت", p: 95, t: "green" },
              ].map((e) => (
                <button
                  key={e.n}
                  onClick={() => setPage("elevator")}
                  className="rounded-3xl border border-slate-200 p-5 text-right transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-800">{e.n}</div>
                    <StatusBadge tone={e.t as any}>{e.s}</StatusBadge>
                  </div>
                  <div className="mt-4">
                    <StatBar
                      percent={e.p}
                      label="پیشرفت"
                      value={`${e.p.toLocaleString("fa-IR")}٪`}
                      barClass="bg-blue-600"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 2 && (
          <div>
            <h3 className="mb-5 text-lg font-bold text-slate-800">انبار پروژه</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <Warehouse className="size-6 text-blue-600" />
                <div className="mt-3 text-sm text-slate-500">تعداد اقلام</div>
                <div className="text-2xl font-black text-slate-800">۴۲</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <StatBar percent={68} label="موجودی" value="۶۸٪" barClass="bg-green-500" />
              </div>
              <div className="rounded-2xl bg-red-50 p-5">
                <div className="text-sm text-red-500">کسری</div>
                <div className="mt-2 text-2xl font-black text-red-600">۷ مورد</div>
              </div>
            </div>
          </div>
        )}

        {tab === 3 && (
          <div>
            <h3 className="mb-5 text-lg font-bold text-slate-800">کارفرما</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-blue-100 text-blue-600">
                  <Building2 className="size-7" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">
                    شرکت ساختمانی پارسیان
                  </div>
                  <div className="mt-1 text-sm text-slate-500">شخص حقوقی</div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-green-100 text-green-600">
                  <User className="size-7" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">۰۹۱۲xxx</div>
                  <div className="mt-1 text-sm text-slate-500">تماس کارفرما</div>
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
              آدرس: تهران، شهرک غرب، خیابان فروردین، پلاک ۱۲
            </div>
          </div>
        )}

        {tab === 4 && (
          <div>
            <h3 className="mb-5 text-lg font-bold text-slate-800">
              مشخصات فنی و تعهدات
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5">
                <FileText className="size-6 text-blue-600" />
                <div className="mt-3 font-semibold text-slate-800">
                  تعهدات پیمانکار
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  نصب کامل ۲ آسانسور مسافربری با ظرفیت ۱۳ نفر، شامل تأمین موتور،
                  ریل، کابین و تابلو فرمان.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <FileText className="size-6 text-green-600" />
                <div className="mt-3 font-semibold text-slate-800">زمان تحویل</div>
                <p className="mt-2 text-sm text-slate-600">
                  مدت اجرا: ۶ ماه از تاریخ شروع.<br />
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
