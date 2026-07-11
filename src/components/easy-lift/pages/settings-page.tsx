"use client";

import {
  Building2,
  UserCog,
  ShieldCheck,
  Database,
  Save,
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
    render: (r) => <span className="font-semibold text-slate-800">{r.name}</span>,
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
        <StatusBadge tone="green">فعال</StatusBadge>
      ) : (
        <StatusBadge tone="blue">آنلاین</StatusBadge>
      ),
  },
];

const menu = [
  { icon: Building2, label: "اطلاعات شرکت", tone: "text-blue-600" },
  { icon: UserCog, label: "کاربران", tone: "text-green-600" },
  { icon: ShieldCheck, label: "دسترسی‌ها", tone: "text-purple-600" },
  { icon: Database, label: "پشتیبان‌گیری", tone: "text-orange-500" },
];

export function SettingsPage() {
  const [sms, setSms] = useState(true);
  const [email, setEmail] = useState(true);
  const [dark, setDark] = useState(false);
  const [log, setLog] = useState(true);

  return (
    <div>
      <PageHeader
        title="تنظیمات سیستم"
        subtitle="مدیریت کاربران، سطوح دسترسی، تنظیمات و اطلاعات شرکت"
        showSearch={false}
        rightSlot={
          <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Save className="size-4" />
            ذخیره تغییرات
          </button>
        }
      />

      <div className="space-y-6 p-4 lg:p-8">
        {/* KPI */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard tone="gradient" label="کاربران" value="۱۸" />
          <KpiCard label="نقش‌ها" value="۶" />
          <KpiCard label="انبارها" value="۳" />
          <Panel className="p-6">
            <p className="text-sm text-slate-500">نسخه سیستم</p>
            <h3 className="mt-6 text-3xl font-black text-slate-800">v2.4.1</h3>
          </Panel>
        </section>

        {/* Menu */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {menu.map((m) => (
            <button
              key={m.label}
              className="rounded-3xl bg-white p-5 text-center shadow-sm transition hover:shadow-xl"
            >
              <m.icon className={`mx-auto size-7 ${m.tone}`} />
              <p className="mt-4 text-sm font-bold text-slate-700">{m.label}</p>
            </button>
          ))}
        </section>

        {/* Content */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Panel className="p-6 lg:p-8">
              <h3 className="mb-6 text-lg font-bold text-slate-800">
                اطلاعات شرکت
              </h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <input
                  className="rounded-xl bg-slate-100 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="نام شرکت"
                />
                <input
                  className="rounded-xl bg-slate-100 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="مدیرعامل"
                />
                <input
                  className="rounded-xl bg-slate-100 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="تلفن"
                />
                <input
                  className="rounded-xl bg-slate-100 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="ایمیل"
                />
                <input
                  className="rounded-xl bg-slate-100 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-200 sm:col-span-2"
                  placeholder="آدرس"
                />
              </div>
            </Panel>

            <Panel className="p-6 lg:p-8">
              <h3 className="mb-6 text-lg font-bold text-slate-800">
                تنظیمات عمومی
              </h3>
              <div className="space-y-5">
                {[
                  { l: "فعال بودن پیامک", v: sms, s: setSms },
                  { l: "ارسال ایمیل خودکار", v: email, s: setEmail },
                  { l: "حالت تاریک", v: dark, s: setDark },
                  { l: "ثبت لاگ سیستم", v: log, s: setLog },
                ].map((o) => (
                  <label
                    key={o.l}
                    className="flex items-center justify-between rounded-xl px-1 py-1"
                  >
                    <span className="text-sm text-slate-700">{o.l}</span>
                    <Switch checked={o.v} onCheckedChange={o.s} />
                  </label>
                ))}
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel className="p-6">
              <h3 className="font-bold text-slate-800">وضعیت سیستم</h3>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">پایگاه داده</span>
                  <span className="font-semibold text-green-600">متصل</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">وب سرویس پیامک</span>
                  <span className="font-semibold text-green-600">فعال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">ایمیل</span>
                  <span className="font-semibold text-amber-500">بررسی</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">نسخه</span>
                  <span className="font-semibold text-slate-700">2.4.1</span>
                </div>
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

        {/* Users table */}
        <div>
          <h3 className="mb-3 text-lg font-bold text-slate-800">
            کاربران سیستم
          </h3>
          <DataTable columns={columns} data={rows} onRowClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
