"use client";

import {
  Building2,
  Cog,
  ShoppingCart,
  Wallet,
  TrendingUp,
  Plus,
  FileSignature,
  Bot,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useNav } from "@/lib/nav-store";
import { EasyAiCard, Panel, StatBar } from "@/components/easy-lift";
import { KpiCard } from "@/components/easy-lift/kpi-card";

const chartData = [
  { m: "فروردین", v: 20 },
  { m: "اردیبهشت", v: 35 },
  { m: "خرداد", v: 42 },
  { m: "تیر", v: 58 },
  { m: "مرداد", v: 75 },
  { m: "شهریور", v: 95 },
];

const activities = [
  { c: "bg-emerald-500", t: "قرارداد جدید ثبت شد", d: "۱۰ دقیقه پیش" },
  { c: "bg-sky-500", t: "پروژه پارسیان بروزرسانی شد", d: "۱ ساعت پیش" },
  { c: "bg-amber-500", t: "درخواست خرید موتور", d: "۳ ساعت پیش" },
  { c: "bg-violet-500", t: "AI محاسبات را بررسی کرد", d: "دیروز" },
];

export function DashboardPage() {
  const setPage = useNav((s) => s.setPage);

  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          داشبورد
        </h2>
        <p className="text-sm text-slate-500">
          نمای کلی وضعیت پروژه‌ها، انبار و مالی شرکت
        </p>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          tone="hero"
          label="پروژه‌های فعال"
          value="۲۴"
          icon={Building2}
          delta="+۱۲٪"
          deltaUp
          hint="نسبت به ماه قبل"
        />
        <KpiCard
          tone="sky"
          label="آسانسورها"
          value="۸۶"
          icon={Cog}
          hint={<StatBar percent={80} barClass="bg-emerald-500" className="mt-2" />}
        />
        <KpiCard
          tone="amber"
          label="درخواست خرید"
          value="۱۸"
          icon={ShoppingCart}
          hint={<span className="text-amber-600">نیاز به بررسی</span>}
        />
        <KpiCard
          tone="emerald"
          label="درآمد ماه"
          value="۴۸B"
          icon={Wallet}
          delta="رشد ۸٪"
          deltaUp
        />
      </section>

      {/* Main content grid */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Left (2/3) */}
        <div className="space-y-5 xl:col-span-2">
          {/* Chart */}
          <Panel className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  روند پروژه‌ها
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  پیشرفت ۶ ماه اخیر
                </p>
              </div>
              <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-emerald-400">
                <option>۶ ماه</option>
                <option>۳ ماه</option>
                <option>۱ سال</option>
              </select>
            </div>
            <div className="mt-5 h-56 w-full sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 8, left: -22, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="dash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eef2f1"
                  />
                  <XAxis
                    dataKey="m"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      fontFamily: "var(--font-vazirmatn)",
                      fontSize: 12,
                      boxShadow: "0 10px 25px -10px rgb(16 24 40 / 0.2)",
                    }}
                    labelStyle={{ color: "#475569", fontWeight: 700 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fill="url(#dash)"
                    dot={{ r: 4, fill: "#059669", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* Project progress */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Panel className="el-card-hover p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">پروژه پارسیان</h3>
                <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                  فعال
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">۴ آسانسور • تهران</p>
              <div className="mt-4">
                <StatBar percent={74} value="۷۴٪" barClass="bg-emerald-500" />
              </div>
            </Panel>
            <Panel className="el-card-hover p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">پروژه الماس</h3>
                <span className="rounded-lg bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-600">
                  در حال اجرا
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">۲ آسانسور • کرج</p>
              <div className="mt-4">
                <StatBar percent={48} value="۴۸٪" barClass="bg-sky-500" />
              </div>
            </Panel>
          </div>
        </div>

        {/* Right (1/3) */}
        <div className="space-y-5">
          <Panel className="p-5">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                فعالیت‌های اخیر
              </h3>
            </div>
            <div className="mt-4 space-y-4">
              {activities.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${a.c}`}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-700">
                      {a.t}
                    </div>
                    <div className="text-[11px] text-slate-400">{a.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <EasyAiCard
            insights={[
              "پیشنهاد خرید ریل پروژه پارسیان آماده است.",
              "۳ درخواست خرید نیاز به تأیید دارند.",
              "قیمت موتور گیرلس ۷٪ کاهش یافته است.",
            ]}
            ctaLabel="نمایش پیشنهاد"
            onCta={() => setPage("commerce")}
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPage("contracts")}
              className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center transition hover:border-emerald-300 hover:bg-emerald-50/40"
            >
              <FileSignature className="size-5 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">
                قرارداد جدید
              </span>
            </button>
            <button
              onClick={() => setPage("technical")}
              className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center transition hover:border-emerald-300 hover:bg-emerald-50/40"
            >
              <Plus className="size-5 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">
                پروژه جدید
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

void TrendingUp;
void Bot;
