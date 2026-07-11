"use client";

import {
  ArrowUpRight,
  TrendingUp,
  Building2,
  ShoppingCart,
  Wallet,
  Plus,
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

const chartData = [
  { m: "فر", v: 20 },
  { m: "ار", v: 35 },
  { m: "خر", v: 42 },
  { m: "تی", v: 58 },
  { m: "مر", v: 75 },
  { m: "شه", v: 95 },
];

export function DashboardPage() {
  const setPage = useNav((s) => s.setPage);

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 lg:text-3xl">
          داشبورد
        </h2>
        <p className="mt-1 text-sm text-slate-500">وضعیت کلی شرکت</p>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-sm">
          <p className="text-sm opacity-90">پروژه‌های فعال</p>
          <h3 className="mt-5 text-5xl font-black">۲۴</h3>
          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5">
              <ArrowUpRight className="size-3.5" /> +۱۲٪
            </span>
            <TrendingUp className="size-6" />
          </div>
        </div>

        <Panel className="p-6">
          <p className="text-sm text-slate-500">آسانسورها</p>
          <h3 className="mt-5 text-5xl font-black text-slate-800">۸۶</h3>
          <div className="mt-6">
            <StatBar percent={80} barClass="bg-green-500" />
          </div>
        </Panel>

        <Panel className="p-6">
          <p className="text-sm text-slate-500">درخواست خرید</p>
          <h3 className="mt-5 text-5xl font-black text-slate-800">۱۸</h3>
          <div className="mt-6 flex items-center gap-2 text-sm text-orange-500">
            <ShoppingCart className="size-4" />
            نیاز به بررسی
          </div>
        </Panel>

        <Panel className="p-6">
          <p className="text-sm text-slate-500">درآمد ماه</p>
          <h3 className="mt-5 text-4xl font-black text-slate-800">۴۸B</h3>
          <div className="mt-6 flex items-center gap-2 text-sm text-green-500">
            <Wallet className="size-4" />
            رشد ۸٪
          </div>
        </Panel>
      </section>

      {/* Main content grid */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left (2/3) */}
        <div className="space-y-6 xl:col-span-2">
          {/* Chart */}
          <Panel className="p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">روند پروژه‌ها</h3>
              <select className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-600 outline-none">
                <option>۶ ماه</option>
                <option>۳ ماه</option>
                <option>۱ سال</option>
              </select>
            </div>
            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#EEF2FF"
                  />
                  <XAxis
                    dataKey="m"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid #e2e8f0",
                      fontFamily: "var(--font-vazirmatn)",
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "#475569", fontWeight: 700 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#g1)"
                    dot={{ r: 5, fill: "#2563eb", strokeWidth: 0 }}
                    activeDot={{ r: 7 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* Project progress */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Panel className="p-6">
              <h3 className="font-bold text-slate-800">پروژه پارسیان</h3>
              <p className="mt-2 text-sm text-slate-500">۴ آسانسور</p>
              <div className="mt-6">
                <StatBar percent={74} barClass="bg-blue-600" />
              </div>
              <div className="mt-4 font-bold text-blue-600">۷۴٪</div>
            </Panel>
            <Panel className="p-6">
              <h3 className="font-bold text-slate-800">پروژه الماس</h3>
              <p className="mt-2 text-sm text-slate-500">۲ آسانسور</p>
              <div className="mt-6">
                <StatBar percent={48} barClass="bg-cyan-500" />
              </div>
              <div className="mt-4 font-bold text-cyan-600">۴۸٪</div>
            </Panel>
          </div>
        </div>

        {/* Right (1/3) */}
        <div className="space-y-6">
          <Panel className="p-6">
            <h3 className="font-bold text-slate-800">فعالیت‌های اخیر</h3>
            <div className="mt-6 space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-green-500" />
                <div>
                  <div className="font-medium text-slate-700">
                    قرارداد جدید ثبت شد
                  </div>
                  <div className="text-xs text-slate-400">۱۰ دقیقه پیش</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-blue-500" />
                <div>
                  <div className="font-medium text-slate-700">
                    پروژه پارسیان بروزرسانی شد
                  </div>
                  <div className="text-xs text-slate-400">۱ ساعت پیش</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-orange-500" />
                <div>
                  <div className="font-medium text-slate-700">
                    درخواست خرید موتور
                  </div>
                  <div className="text-xs text-slate-400">۳ ساعت پیش</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-purple-500" />
                <div>
                  <div className="font-medium text-slate-700">
                    AI محاسبات را بررسی کرد
                  </div>
                  <div className="text-xs text-slate-400">دیروز</div>
                </div>
              </div>
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

          <button
            onClick={() => setPage("technical")}
            className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-slate-300 p-6 text-sm font-semibold text-slate-500 transition hover:border-blue-300 hover:text-blue-600"
          >
            <Plus className="size-4" />
            پروژه جدید
          </button>
        </div>
      </section>
    </div>
  );
}
