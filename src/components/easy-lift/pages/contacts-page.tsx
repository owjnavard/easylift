"use client";

import { Phone, MapPin, Mail, Building2, Plus, Users } from "lucide-react";
import {
  EasyAiCard,
  PageHeader,
  Panel,
  StatusBadge,
  Toolbar,
  FilterSelect,
  DataTable,
  type Column,
} from "@/components/easy-lift";
import { KpiCard } from "@/components/easy-lift/kpi-card";

interface Contact {
  name: string;
  group: string;
  phone: string;
  city: string;
  projects: number;
  status: "active" | "partner";
}

const rows: Contact[] = [
  { name: "شرکت پارسیان", group: "کارفرما", phone: "02188776655", city: "تهران", projects: 8, status: "active" },
  { name: "آسانبر نوین", group: "تأمین‌کننده", phone: "02122334455", city: "اصفهان", projects: 12, status: "partner" },
  { name: "برج آریا", group: "کارفرما", phone: "02144556677", city: "تهران", projects: 3, status: "active" },
  { name: "سپهر آسانسور", group: "تأمین‌کننده", phone: "03155667788", city: "اصفهان", projects: 9, status: "partner" },
  { name: "پارس لیفت", group: "تأمین‌کننده", phone: "02166778899", city: "کرج", projects: 6, status: "active" },
];

const columns: Column<Contact>[] = [
  {
    key: "name",
    header: "نام",
    align: "right",
    render: (r) => (
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
          {r.name.charAt(0)}
        </span>
        <span className="font-semibold text-slate-800">{r.name}</span>
      </div>
    ),
  },
  { key: "group", header: "گروه", align: "center" },
  { key: "phone", header: "تلفن", align: "center", render: (r) => (
    <span dir="ltr" className="font-mono text-xs">{r.phone}</span>
  ) },
  { key: "city", header: "شهر", align: "center" },
  { key: "projects", header: "پروژه", align: "center" },
  {
    key: "status",
    header: "وضعیت",
    align: "center",
    render: (r) =>
      r.status === "active" ? (
        <StatusBadge tone="emerald">فعال</StatusBadge>
      ) : (
        <StatusBadge tone="sky">همکار</StatusBadge>
      ),
  },
];

export function ContactsPage() {
  return (
    <div>
      <PageHeader
        icon={Users}
        title="مدیریت مخاطبین"
        subtitle="کارفرمایان، پیمانکاران، تأمین‌کنندگان و پرسنل"
        searchPlaceholder="جستجوی مخاطب..."
        actionLabel="ثبت مخاطب جدید"
      />

      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        {/* KPI */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard tone="hero" label="کل مخاطبین" value="۱۲۴۸" icon={Users} />
          <KpiCard tone="emerald" label="کارفرما" value="۳۲۰" icon={Building2} />
          <KpiCard tone="sky" label="تأمین‌کننده" value="۱۸۵" icon={Building2} />
          <KpiCard tone="violet" label="پرسنل" value="۷۴" icon={Users} />
        </section>

        <Toolbar
          filters={
            <>
              <FilterSelect>
                <option>همه گروه‌ها</option>
                <option>کارفرما</option>
                <option>تأمین‌کننده</option>
                <option>پیمانکار</option>
              </FilterSelect>
              <FilterSelect>
                <option>همه شهرها</option>
                <option>تهران</option>
                <option>اصفهان</option>
                <option>کرج</option>
              </FilterSelect>
              <FilterSelect>
                <option>فعال</option>
                <option>غیرفعال</option>
              </FilterSelect>
            </>
          }
          actions={
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
              <Plus className="size-4" />
              ثبت مخاطب جدید
            </button>
          }
        />

        {/* Contact cards */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="el-card-hover p-5">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-base font-bold text-emerald-600">
                  پ
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">شرکت پارسیان</h3>
                  <p className="text-xs text-slate-500">کارفرما</p>
                </div>
              </div>
              <StatusBadge tone="emerald">فعال</StatusBadge>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Phone className="size-3.5 text-slate-400" />
                <span dir="ltr">02188776655</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-slate-400" /> تهران
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-slate-400" /> info@test.com
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 className="size-3.5 text-slate-400" /> ۸ پروژه
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700">
                مشاهده
              </button>
              <button className="flex-1 rounded-lg bg-slate-100 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">
                ویرایش
              </button>
            </div>
          </Panel>

          <Panel className="el-card-hover p-5">
            <div className="flex gap-3">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-sky-50 text-base font-bold text-sky-600">
                آ
              </div>
              <div>
                <h3 className="font-bold text-slate-900">آسانبر نوین</h3>
                <p className="text-xs text-slate-500">تأمین‌کننده</p>
              </div>
            </div>
            <div className="mt-5 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Phone className="size-3.5 text-slate-400" />
                <span dir="ltr">02122334455</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-slate-400" /> sales@novin.com
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-slate-400" /> اصفهان
              </div>
            </div>
            <button className="mt-5 w-full rounded-lg bg-slate-100 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">
              مشاهده اطلاعات
            </button>
          </Panel>

          <EasyAiCard
            insights={[
              "۳ مخاطب تکراری شناسایی شد.",
              "۲ شماره موبایل ناقص است.",
              "۵ ایمیل نامعتبر است.",
            ]}
            ctaLabel="بررسی توسط AI"
          />
        </section>

        <DataTable columns={columns} data={rows} onRowClick={() => {}} />
      </div>
    </div>
  );
}
