"use client";

import { useState } from "react";
import { ArrowRight, ClipboardCheck } from "lucide-react";
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
    <div className="p-4 lg:p-8">
      <button
        onClick={() => setPage("technical")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
      >
        <ArrowRight className="size-4" />
        بازگشت به فنی و مهندسی
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 lg:text-3xl">
            آسانسور A3 — پروژه پارسیان
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            ۱۲ طبقه • ظرفیت ۱۳ نفر • وضعیت: در حال اجرا
          </p>
        </div>
        <StatusBadge tone="green" className="px-4 py-2 text-sm">
          ۸۵٪ پیشرفت
        </StatusBadge>
      </div>

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

      <div className="mt-8">
        {tab === 0 && <ElevatorInfoTab />}
        {tab === 1 && <PartsTab />}
        {tab === 2 && <SurveyEditTab />}
        {tab === 3 && <CalculationTab />}
        {tab === 4 && <StandardTab />}
      </div>
    </div>
  );
}

/* ---------- Tab 0: اطلاعات آسانسور ---------- */
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Panel className="p-6 lg:col-span-2">
        <h3 className="mb-5 text-lg font-bold text-slate-800">
          مشخصات فنی آسانسور
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.l} className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">{f.l}</div>
              <div className="mt-1 font-semibold text-slate-800">{f.v}</div>
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

/* ---------- Tab 1: لوازم مورد نیاز ---------- */
function PartsTab() {
  const parts = [
    { n: "موتور گیرلس", brand: "آرکل", qty: 1, unit: "عدد", status: "تأمین شد" },
    { n: "ریل T90", brand: "ساوادکوه", qty: 12, unit: "شاخه", status: "در حال تأمین" },
    { n: "تابلو فرمان", brand: "آرکل", qty: 1, unit: "عدد", status: "تأمین شد" },
    { n: "کابین", brand: "داخلی", qty: 1, unit: "عدد", status: "در حال ساخت" },
    { n: "کفشک", brand: "آرکل", qty: 48, unit: "عدد", status: "کسری" },
    { n: "سیم بکسل", brand: "کرج کابل", qty: 2, unit: "عدد", status: "کسری" },
  ];
  return (
    <Panel padded={false} className="overflow-hidden">
      <div className="border-b border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800">لیست لوازم مورد نیاز</h3>
        <p className="mt-1 text-sm text-slate-500">
          به‌صورت خودکار از مشخصات فنی آسانسور تولید شده است.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-right font-semibold text-slate-600">نام کالا</th>
              <th className="p-4 text-center font-semibold text-slate-600">برند</th>
              <th className="p-4 text-center font-semibold text-slate-600">تعداد</th>
              <th className="p-4 text-center font-semibold text-slate-600">واحد</th>
              <th className="p-4 text-center font-semibold text-slate-600">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="p-4 text-right font-semibold text-slate-800">{p.n}</td>
                <td className="p-4 text-center text-slate-600">{p.brand}</td>
                <td className="p-4 text-center text-slate-700">
                  {p.qty.toLocaleString("fa-IR")}
                </td>
                <td className="p-4 text-center text-slate-600">{p.unit}</td>
                <td className="p-4 text-center">
                  <StatusBadge
                    tone={
                      p.status === "تأمین شد"
                        ? "green"
                        : p.status === "کسری"
                          ? "red"
                          : p.status === "در حال ساخت"
                            ? "blue"
                            : "amber"
                    }
                  >
                    {p.status}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ---------- Tab 2: برداشت اطلاعات ---------- */
function SurveyEditTab() {
  const [panel, setPanel] = useState<"project" | "stages" | "form">("project");
  const [stage, setStage] = useState(0);
  const stages = [
    "چاله",
    "آهنکشی",
    "ریل",
    "درب",
    "کابین",
    "مکانیک",
    "راه‌اندازی",
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800">
            <ClipboardCheck className="size-7 text-blue-600" />
            برداشت اطلاعات
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            ثبت اطلاعات فنی پروژه آسانسور
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            مود ویرایش
          </button>
          <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50">
            مود نمایش
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <Panel padded={false} className="overflow-hidden">
            <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50">
              {(
                [
                  ["project", "اطلاعات پروژه"],
                  ["stages", "مراحل"],
                  ["form", "ثبت اطلاعات"],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setPanel(k)}
                  className={cn(
                    "border-b-2 py-3 text-xs font-medium transition",
                    panel === k
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>

            {panel === "project" && (
              <div className="space-y-4 p-5 text-sm">
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
                <div className="pt-4">
                  <StatBar percent={25} label="پیشرفت" value="۲۵٪" barClass="bg-blue-600" />
                </div>
              </div>
            )}

            {panel === "stages" && (
              <div className="space-y-2 p-5">
                {stages.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setStage(i)}
                    className={cn(
                      "w-full rounded-xl p-3 text-right text-sm transition",
                      stage === i
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {(i + 1).toLocaleString("fa-IR")}- {s}
                  </button>
                ))}
              </div>
            )}

            {panel === "form" && (
              <div className="space-y-4 p-5">
                {["عرض چاله", "عمق چاله", "ارتفاع پیت", "ارتفاع طبقه"].map((l) => (
                  <div key={l}>
                    <label className="mb-2 block text-xs text-slate-500">
                      {l}
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                ))}
                <button className="w-full rounded-xl bg-blue-600 py-2.5 text-sm text-white transition hover:bg-blue-700">
                  ثبت اطلاعات
                </button>
              </div>
            )}
          </Panel>
        </div>

        {/* Schematic */}
        <div className="lg:col-span-9">
          <Panel padded={false} className="flex h-full min-h-[500px] flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  شماتیک آسانسور
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  انتخاب هر فیلد، محل آن را روی نقشه مشخص می‌کند.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50">
                  بازنشانی
                </button>
                <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50">
                  بزرگنمایی
                </button>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center rounded-b-3xl bg-slate-100 p-8">
              <div className="grid h-full w-full place-items-center rounded-3xl border-2 border-dashed border-slate-300 bg-white text-center">
                <div>
                  <ClipboardCheck className="mx-auto size-20 text-slate-300" />
                  <h3 className="mt-6 text-xl font-bold text-slate-500">
                    محل نمایش شماتیک آسانسور
                  </h3>
                  <p className="mt-3 text-sm text-slate-400">
                    شماتیک بر اساس اطلاعات برداشت‌شده به‌صورت خودکار تکمیل می‌شود.
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="p-5">
          <h3 className="mb-4 text-base font-bold text-slate-800">یادداشت‌ها</h3>
          <textarea
            className="h-32 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-blue-500"
            placeholder="توضیحات مرحله برداشت ..."
          />
        </Panel>
        <Panel className="p-5">
          <h3 className="mb-4 text-base font-bold text-slate-800">
            آخرین فعالیت‌ها
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <span className="mt-1 size-2.5 shrink-0 rounded-full bg-green-500" />
              <div>
                <div className="font-medium text-slate-700">
                  مرحله چاله ثبت شد
                </div>
                <div className="text-xs text-slate-400">امروز ۱۰:۳۵</div>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="mt-1 size-2.5 shrink-0 rounded-full bg-blue-500" />
              <div>
                <div className="font-medium text-slate-700">
                  اطلاعات پروژه ویرایش شد
                </div>
                <div className="text-xs text-slate-400">امروز ۰۹:۲۰</div>
              </div>
            </div>
          </div>
        </Panel>
        <Panel className="p-5">
          <h3 className="mb-4 text-base font-bold text-slate-800">
            فایل‌های پروژه
          </h3>
          <div className="space-y-3">
            {[
              { n: "نقشه اولیه.pdf", c: "text-red-500" },
              { n: "عکس چاله.jpg", c: "text-green-600" },
            ].map((f) => (
              <div
                key={f.n}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
              >
                <div className="flex items-center gap-3 text-sm">
                  <FileIcon className={f.c} />
                  <span className="text-slate-700">{f.n}</span>
                </div>
                <button className="text-sm font-medium text-blue-600">
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

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-5", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

/* ---------- Tab 3: محاسبات فنی ---------- */
function CalculationTab() {
  const calcs = [
    { l: "ارتفاع کل سفر", v: "۴۸ متر", d: "۱۲ طبقه × ۴ متر" },
    { l: "وزن کابین", v: "۱۲۰۰ کیلوگرم", d: "ظرفیت ۱۰۰۰ کیلوگرم" },
    { l: "وزن پادوزن", v: "۱۶۰۰ کیلوگرم", d: "کابین + ۰.۵ ظرفیت" },
    { l: "نیروی موتور", v: "۱۱ کیلووات", d: "گیرلس VVVF" },
    { l: "تعداد ریل", v: "۱۲ شاخه", v2: "T90" },
    { l: "طول سیم بکسل", v: "۹۶ متر", d: "۲ × ارتفاع سفر" },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Panel className="p-6">
          <h3 className="mb-5 text-lg font-bold text-slate-800">
            نتیجه محاسبات فنی
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {calcs.map((c) => (
              <div key={c.l} className="rounded-2xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">{c.l}</div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {c.v}
                  {c.v2 ? <span className="ms-2 text-sm text-blue-600">{c.v2}</span> : null}
                </div>
                {c.d ? (
                  <div className="mt-1 text-xs text-slate-400">{c.d}</div>
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

/* ---------- Tab 4: استاندارد ---------- */
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Panel className="p-6 lg:col-span-2">
        <h3 className="mb-5 text-lg font-bold text-slate-800">
          چک‌لیست استاندارد
        </h3>
        <div className="space-y-3">
          {checks.map((c) => (
            <label
              key={c.n}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
            >
              <span className="text-sm text-slate-700">{c.n}</span>
              <StatusBadge tone={c.s ? "green" : "amber"}>
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
