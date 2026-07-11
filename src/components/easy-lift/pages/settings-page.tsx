"use client";

import {
  Building2,
  UserCog,
  ShieldCheck,
  Database,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  EasyAiCard,
  PageHeader,
  Panel,
  StatusBadge,
  DataTable,
  type Column,
} from "@/components/easy-lift";
import { KpiCard } from "@/components/easy-lift/kpi-card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface User {
  name: string;
  position: string;
  role: string;
  lastLogin: string;
  status: "active" | "online";
}

const rows: User[] = [
  { name: "محمد احمدی", position: "مدیرعامل", role: "مدیر سیستم", lastLogin: "امروز", status: "active" },
  { name: "علی رضایی", position: "حسابدار", role: "مالی", lastLogin: "دیروز", status: "online" },
  { name: "حسین کریمی", position: "انباردار", role: "انبار", lastLogin: "۲ ساعت قبل", status: "active" },
  { name: "سارا موسوی", position: "بازرگانی", role: "بازرگانی", lastLogin: "امروز", status: "online" },
];

const columns: Column<User>[] = [
  {
    key: "name",
    header: "نام",
    align: "right",
    render: (r) => (
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600">
          {r.name.charAt(0)}
        </span>
        <span className="font-semibold text-slate-800">{r.name}</span>
      </div>
    ),
  },
  { key: "position", header: "سمت", align: "center" },
  { key: "role", header: "نقش", align: "center" },
  { key: "lastLogin", header: "آخرین ورود", align: "center" },
  {
    key: "status",
    header: "وضعیت",
    align: "center",
    render: (r) =>
      r.status === "active" ? (
        <StatusBadge tone="emerald">فعال</StatusBadge>
      ) : (
        <StatusBadge tone="sky">آنلاین</StatusBadge>
      ),
  },
];

const menu = [
  { icon: Building2, label: "اطلاعات شرکت", tone: "text-emerald-600 bg-emerald-50" },
  { icon: UserCog, label: "کاربران", tone: "text-sky-600 bg-sky-50" },
  { icon: ShieldCheck, label: "دسترسی‌ها", tone: "text-violet-600 bg-violet-50" },
  { icon: Database, label: "پشتیبان‌گیری", tone: "text-amber-600 bg-amber-50" },
];

export function SettingsPage() {
  const [sms, setSms] = useState(true);
  const [email, setEmail] = useState(true);
  const [dark, setDark] = useState(false);
  const [log, setLog] = useState(true);

  return (
    <div>
      <PageHeader
        icon={SettingsIcon}
        title="تنظیمات سیستم"
        subtitle="مدیریت کاربران، سطوح دسترسی و اطلاعات شرکت"
        showSearch={false}
        rightSlot={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
            <Save className="size-4" />
            ذخیره تغییرات
          </button>
        }
      />

      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard tone="hero" label="کاربران" value="۱۸" icon={UserCog} />
          <KpiCard tone="sky" label="نقش‌ها" value="۶" icon={ShieldCheck} />
          <KpiCard tone="amber" label="انبارها" value="۳" icon={Database} />
          <Panel className="p-5">
            <p className="text-xs text-slate-500">نسخه سیستم</p>
            <h3 className="mt-2 text-2xl font-extrabold text-slate-900">v2.4.1</h3>
          </Panel>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {menu.map((m) => (
            <button
              key={m.label}
              className="el-card-hover flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-right shadow-sm"
            >
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${m.tone}`}>
                <m.icon className="size-5" />
              </span>
              <span className="text-sm font-bold text-slate-700">{m.label}</span>
            </button>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Panel className="p-5 sm:p-6">
              <h3 className="mb-5 text-sm font-bold text-slate-900">
                اطلاعات شرکت
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="نام شرکت"
                />
                <input
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="مدیرعامل"
                />
                <input
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="تلفن"
                />
                <input
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="ایمیل"
                />
                <input
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 sm:col-span-2"
                  placeholder="آدرس"
                />
              </div>
            </Panel>

            <Panel className="p-5 sm:p-6">
              <h3 className="mb-5 text-sm font-bold text-slate-900">
                تنظیمات عمومی
              </h3>
              <div className="space-y-1">
                {[
                  { l: "فعال بودن پیامک", v: sms, s: setSms },
                  { l: "ارسال ایمیل خودکار", v: email, s: setEmail },
                  { l: "حالت تاریک", v: dark, s: setDark },
                  { l: "ثبت لاگ سیستم", v: log, s: setLog },
                ].map((o) => (
                  <label
                    key={o.l}
                    className="flex items-center justify-between rounded-lg px-2 py-2.5 transition hover:bg-slate-50"
                  >
                    <span className="text-sm text-slate-700">{o.l}</span>
                    <Switch checked={o.v} onCheckedChange={o.s} />
                  </label>
                ))}
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel className="p-5">
              <h3 className="text-sm font-bold text-slate-900">وضعیت سیستم</h3>
              <div className="mt-4 space-y-3 text-xs">
                {[
                  { l: "پایگاه داده", v: "متصل", t: "emerald" },
                  { l: "وب سرویس پیامک", v: "فعال", t: "emerald" },
                  { l: "ایمیل", v: "بررسی", t: "amber" },
                  { l: "نسخه", v: "2.4.1", t: "slate" },
                ].map((s) => (
                  <div key={s.l} className="flex items-center justify-between">
                    <span className="text-slate-500">{s.l}</span>
                    <StatusBadge tone={s.t as any}>{s.v}</StatusBadge>
                  </div>
                ))}
              </div>
            </Panel>

            <EasyAiCard
              insights={[
                "۲ کاربر بدون نقش دسترسی هستند.",
                "آخرین نسخه سیستم موجود است.",
                "پیشنهاد تهیه نسخه پشتیبان امروز.",
              ]}
              ctaLabel="بررسی هوشمند"
            />
          </div>
        </section>

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-900">کاربران سیستم</h3>
          <DataTable columns={columns} data={rows} onRowClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
