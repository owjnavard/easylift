"use client";

import { useState } from "react";
import { ArrowRight, ClipboardCheck, Cog } from "lucide-react";
import { useNav } from "@/lib/nav-store";
import { Panel, StatusBadge, StatBar, EasyAiCard } from "@/components/easy-lift";
import { cn } from "@/lib/utils";

const TABS = [
  "اطلاعات آسانسور",
  "لوازم مورد نیاز",
  "برداشت اطلاعات",
  "محاسبات فنی",
  "استاندارد",
] as const;

export function ElevatorPage() {
  const setPage = useNav((s) => s.setPage);
  const [tab, setTab] = useState(2);

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
              آسانسور A3 — پروژه پارسیان
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              ۱۲ طبقه • ظرفیت ۱۳ نفر • در حال اجرا
            </p>
          </div>
        </div>
        <StatusBadge tone="emerald" className="px-3 py-1.5 text-xs">
          ۸۵٪ پیشرفت
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
        {tab === 0 && <ElevatorInfoTab />}
        {tab === 1 && <PartsTab />}
        {tab === 2 && <SurveyEditTab />}
        {tab === 3 && <CalculationTab />}
        {tab === 4 && <StandardTab />}
      </div>
    </div>
  );
}

function ElevatorInfoTab() {
  const fields = [
    { l: "نوع آسانسور", v: "مسافربری" },
    { l: "تعداد توقف", v: "۱۲" },
    { l: "ظرفیت", v: "۱۳ نفر (۱۰۰۰ کیلوگرم)" },
    { l: "سرعت", v: "1.6 m/s" },
    { l: "نوع موتور", v: "گیرلس" },
    { l: "نوع درایو", v: "اینورتر VVVF" },
    { l: "برند موتور", v: "آرکل" },
    { l: "نوع درب", v: "اتوماتیک تلسکوپی" },
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
          "بر اساس مشخصات، ۱۲ عدد ریل T90 مورد نیاز است.",
          "موتور گیرلس ۱۳ نفر با اینورتر پیشنهاد می‌شود.",
          "هزینه تخمینی تجهیزات: ۳.۸ میلیارد ریال.",
        ]}
        ctaLabel="محاسبه لوازم"
      />
    </div>
  );
}

function PartsTab() {
  const parts = [
    { n: "موتور گیرلس", brand: "آرکل", qty: 1, unit: "عدد", status: "تأمین شد", t: "emerald" },
    { n: "ریل T90", brand: "ساوادکوه", qty: 12, unit: "شاخه", status: "در حال تأمین", t: "amber" },
    { n: "تابلو فرمان", brand: "آرکل", qty: 1, unit: "عدد", status: "تأمین شد", t: "emerald" },
    { n: "کابین", brand: "داخلی", qty: 1, unit: "عدد", status: "در حال ساخت", t: "sky" },
    { n: "کفشک", brand: "آرکل", qty: 48, unit: "عدد", status: "کسری", t: "rose" },
    { n: "سیم بکسل", brand: "کرج کابل", qty: 2, unit: "عدد", status: "کسری", t: "rose" },
  ];
  return (
    <Panel padded={false} className="overflow-hidden">
      <div className="border-b border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-900">لیست لوازم مورد نیاز</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          به‌صورت خودکار از مشخصات فنی آسانسور تولید شده است.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-slate-200/70">
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">نام کالا</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">برند</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">تعداد</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">واحد</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-right font-semibold text-slate-800">{p.n}</td>
                <td className="px-4 py-3 text-center text-slate-600">{p.brand}</td>
                <td className="px-4 py-3 text-center text-slate-700">
                  {p.qty.toLocaleString("fa-IR")}
                </td>
                <td className="px-4 py-3 text-center text-slate-600">{p.unit}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge tone={p.t as any}>{p.status}</StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function SurveyEditTab() {
  const [panel, setPanel] = useState<"project" | "stages" | "form">("project");
  const [stage, setStage] = useState(0);
  const stages = ["چاله", "آهنکشی", "ریل", "درب", "کابین", "مکانیک", "راه‌اندازی"];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
            <span className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <ClipboardCheck className="size-5" />
            </span>
            برداشت اطلاعات
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            ثبت اطلاعات فنی پروژه آسانسور
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700">
            ویرایش
          </button>
          <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50">
            نمایش
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <Panel padded={false} className="overflow-hidden">
            <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/80">
              {(
                [
                  ["project", "پروژه"],
                  ["stages", "مراحل"],
                  ["form", "ثبت"],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setPanel(k)}
                  className={cn(
                    "border-b-2 py-2.5 text-xs font-medium transition",
                    panel === k
                      ? "border-emerald-500 text-emerald-700"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>

            {panel === "project" && (
              <div className="space-y-3.5 p-4 text-xs">
                {[
                  ["پروژه", "پارسیان"],
                  ["آسانسور", "A3"],
                  ["ظرفیت", "۱۳ نفر"],
                  ["سرعت", "1.6 m/s"],
                  ["طبقات", "۱۲"],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-slate-500">{l}</span>
                    <span className="font-semibold text-slate-800">{v}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <StatBar percent={25} value="۲۵٪" barClass="bg-emerald-500" />
                </div>
              </div>
            )}

            {panel === "stages" && (
              <div className="space-y-1.5 p-3">
                {stages.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setStage(i)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-right text-xs transition",
                      stage === i
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    {(i + 1).toLocaleString("fa-IR")}- {s}
                  </button>
                ))}
              </div>
            )}

            {panel === "form" && (
              <div className="space-y-3 p-4">
                {["عرض چاله", "عمق چاله", "ارتفاع پیت", "ارتفاع طبقه"].map((l) => (
                  <div key={l}>
                    <label className="mb-1.5 block text-[11px] text-slate-500">
                      {l}
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                ))}
                <button className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700">
                  ثبت اطلاعات
                </button>
              </div>
            )}
          </Panel>
        </div>

        {/* Schematic */}
        <div className="lg:col-span-9">
          <Panel padded={false} className="flex h-full min-h-[420px] flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">شماتیک آسانسور</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  انتخاب هر فیلد، محل آن را روی نقشه مشخص می‌کند.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50">
                  بازنشانی
                </button>
                <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50">
                  بزرگنمایی
                </button>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center rounded-b-2xl bg-slate-100 p-6">
              <div className="grid h-full w-full place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-white text-center">
                <div>
                  <ClipboardCheck className="mx-auto size-16 text-slate-300" />
                  <h3 className="mt-4 text-base font-bold text-slate-500">
                    محل نمایش شماتیک آسانسور
                  </h3>
                  <p className="mt-2 text-xs text-slate-400">
                    شماتیک بر اساس اطلاعات برداشت‌شده تکمیل می‌شود.
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel className="p-4">
          <h3 className="mb-3 text-sm font-bold text-slate-900">یادداشت‌ها</h3>
          <textarea
            className="h-28 w-full resize-none rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            placeholder="توضیحات مرحله برداشت ..."
          />
        </Panel>
        <Panel className="p-4">
          <h3 className="mb-3 text-sm font-bold text-slate-900">فعالیت‌های اخیر</h3>
          <div className="space-y-3 text-xs">
            <div className="flex gap-2.5">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-emerald-500" />
              <div>
                <div className="font-medium text-slate-700">مرحله چاله ثبت شد</div>
                <div className="text-[11px] text-slate-400">امروز ۱۰:۳۵</div>
              </div>
            </div>
            <div className="flex gap-2.5">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-sky-500" />
              <div>
                <div className="font-medium text-slate-700">اطلاعات پروژه ویرایش شد</div>
                <div className="text-[11px] text-slate-400">امروز ۰۹:۲۰</div>
              </div>
            </div>
          </div>
        </Panel>
        <Panel className="p-4">
          <h3 className="mb-3 text-sm font-bold text-slate-900">فایل‌های پروژه</h3>
          <div className="space-y-2">
            {[
              { n: "نقشه اولیه.pdf", c: "text-rose-500" },
              { n: "عکس چاله.jpg", c: "text-emerald-600" },
            ].map((f) => (
              <div
                key={f.n}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
              >
                <span className="text-xs text-slate-700">{f.n}</span>
                <button className="text-xs font-medium text-emerald-600">
                  مشاهده
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function CalculationTab() {
  const calcs = [
    { l: "ارتفاع کل سطر", v: "۴۸ متر", d: "۱۲ طبقه × ۴ متر" },
    { l: "وزن کابین", v: "۱۲۰۰ کیلوگرم", d: "ظرفیت ۱۰۰۰ کیلوگرم" },
    { l: "وزن پادوزن", v: "۱۶۰۰ کیلوگرم", d: "کابین + ۰.۵ ظرفیت" },
    { l: "نیروی موتور", v: "۱۱ کیلووات", d: "گیرلس VVVF" },
    { l: "تعداد ریل", v: "۱۲ شاخه", d: "T90" },
    { l: "طول سیم بکسل", v: "۹۶ متر", d: "۲ × ارتفاع سفر" },
  ];
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Panel className="p-5">
          <h3 className="mb-4 text-sm font-bold text-slate-900">
            نتیجه محاسبات فنی
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {calcs.map((c) => (
              <div key={c.l} className="rounded-xl border border-slate-200 p-3.5">
                <div className="text-[11px] text-slate-500">{c.l}</div>
                <div className="mt-1 text-base font-bold text-slate-900">
                  {c.v}
                </div>
                {c.d ? (
                  <div className="mt-0.5 text-[11px] text-slate-400">{c.d}</div>
                ) : null}
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <EasyAiCard
        insights={[
          "محاسبات با استاندارد ISO 4190 منطبق است.",
          "پادوزن ۱۶۰۰ کیلوگرم برای تعادل بهینه پیشنهاد می‌شود.",
          "نیاز به ۲ شاخه ریل اضافی برای ایمنی.",
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
