"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Calculator,
} from "lucide-react";
import { Panel, StatusBadge } from "@/components/easy-lift";
import { useQuotations } from "@/lib/quotations-store";
import { PART_MAP, formatRial, formatCompact } from "@/lib/vendor-data";
import { cn } from "@/lib/utils";

export function Step3Quote({ id }: { id: string }) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id)!);
  const setPartBrand = useQuotations((s) => s.setPartBrand);
  const addExtra = useQuotations((s) => s.addExtra);
  const removeExtra = useQuotations((s) => s.removeExtra);
  const setProfit = useQuotations((s) => s.setProfit);
  const setDiscount = useQuotations((s) => s.setDiscount);
  const approveByCustomer = useQuotations((s) => s.approveByCustomer);
  const goToStage = useQuotations((s) => s.goToStage);
  const log = useQuotations((s) => s.log);
  const updateRequest = useQuotations((s) => s.updateRequest);

  const [extraLabel, setExtraLabel] = useState("");
  const [extraAmount, setExtraAmount] = useState("");
  const [issued, setIssued] = useState(!!req.issuedAt);

  // محاسبه قیمت‌ها
  const partsTotal = req.parts.reduce((sum, p) => {
    const brand = p.brandId ? PART_MAP[p.partId]?.brands.find((b) => b.id === p.brandId) : null;
    if (!brand) return sum;
    return sum + brand.price * p.qty;
  }, 0);

  const missingBrand = req.parts.some((p) => !p.brandId);
  const extrasTotal = req.extras.reduce((s, e) => s + e.amount, 0);
  const subtotal = partsTotal + extrasTotal;
  const profit = Math.round((subtotal * req.profitPercent) / 100);
  const afterProfit = subtotal + profit;
  const finalTotal = Math.max(0, afterProfit - req.discountAmount);

  function issue() {
    updateRequest(id, { issuedAt: new Date().toISOString() });
    log(id, "کاربر", "صدور پیش‌فاکتور", `مبلغ نهایی: ${formatCompact(finalTotal)}`);
    setIssued(true);
  }

  function approve() {
    approveByCustomer(id);
    goToStage(id, 4);
  }

  function addExtraCost() {
    const amt = Number(extraAmount);
    if (!extraLabel.trim() || !amt || amt <= 0) return;
    addExtra(id, extraLabel.trim(), amt);
    setExtraLabel("");
    setExtraAmount("");
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        {/* parts table */}
        <Panel padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">لیست قطعات محاسبه‌شده</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                برند هر قطعه را از میان کالاهای Vendor List انتخاب کنید
              </p>
            </div>
            <StatusBadge tone={missingBrand ? "amber" : "emerald"}>
              {missingBrand ? "انتخاب برند لازم است" : "تکمیل شد"}
            </StatusBadge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-200/70">
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">قطعه</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">تعداد</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">برند</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">قیمت واحد</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">مبلغ</th>
                </tr>
              </thead>
              <tbody>
                {req.parts.map((p) => {
                  const part = PART_MAP[p.partId];
                  const brand = p.brandId
                    ? part.brands.find((b) => b.id === p.brandId)
                    : null;
                  const lineTotal = brand ? brand.price * p.qty : 0;
                  return (
                    <tr key={p.partId} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 text-right">
                        <div className="font-medium text-slate-800">{part.name}</div>
                        <div className="text-[10px] text-slate-400">{p.formula}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700">
                        {p.qty.toLocaleString("fa-IR")}
                        <span className="mr-1 text-[10px] font-normal text-slate-400">{part.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <select
                          value={p.brandId ?? ""}
                          onChange={(e) => setPartBrand(id, p.partId, e.target.value || null)}
                          className="w-full max-w-[180px] rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        >
                          <option value="">— انتخاب برند —</option>
                          {part.brands.map((b) => (
                            <option key={b.id} value={b.id} disabled={!b.inStock}>
                              {b.name} {!b.inStock ? "(ناموجود)" : ""}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-slate-600">
                        {brand ? formatCompact(brand.price) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-800">
                        {brand ? formatCompact(lineTotal) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* extras */}
        <Panel className="p-5">
          <h3 className="mb-3 text-sm font-bold text-slate-900">هزینه‌های جانبی</h3>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={extraLabel}
              onChange={(e) => setExtraLabel(e.target.value)}
              placeholder="عنوان (حمل، نصب، خدمات...)"
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
            <input
              type="number"
              value={extraAmount}
              onChange={(e) => setExtraAmount(e.target.value)}
              placeholder="مبلغ (ریال)"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 sm:w-40"
            />
            <button
              onClick={addExtraCost}
              className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              <Plus className="size-4" />
              افزودن
            </button>
          </div>
          {req.extras.length > 0 ? (
            <div className="mt-3 space-y-2">
              {req.extras.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span className="text-xs text-slate-600">{e.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">
                      {formatCompact(e.amount)}
                    </span>
                    <button
                      onClick={() => removeExtra(id, e.id)}
                      className="text-slate-400 transition hover:text-rose-500"
                      aria-label="حذف"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </Panel>
      </div>

      {/* summary */}
      <div className="space-y-5">
        <Panel className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Calculator className="size-4 text-emerald-600" />
            محاسبه قیمت نهایی
          </h3>
          <div className="mt-4 space-y-3 text-xs">
            <Line label="جمع قطعات" value={formatCompact(partsTotal)} />
            <Line label="هزینه‌های جانبی" value={formatCompact(extrasTotal)} />
            <div className="border-t border-slate-100 pt-3">
              <Line label="جمع کل" value={formatCompact(subtotal)} strong />
            </div>

            {/* profit */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-slate-500">درصد سود</span>
                <span className="font-bold text-emerald-600">
                  {req.profitPercent.toLocaleString("fa-IR")}٪
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={req.profitPercent}
                onChange={(e) => setProfit(id, Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>۰٪</span>
                <span>۲۵٪</span>
                <span>۵۰٪</span>
              </div>
            </div>

            <Line label="مبلغ سود" value={formatCompact(profit)} />

            <div>
              <label className="mb-1.5 block text-slate-500">تخفیف (ریال)</label>
              <input
                type="number"
                value={req.discountAmount || ""}
                onChange={(e) => setDiscount(id, Number(e.target.value))}
                placeholder="۰"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="rounded-xl bg-emerald-50 p-3">
              <div className="text-xs text-emerald-700">قیمت نهایی</div>
              <div className="mt-1 text-xl font-extrabold text-emerald-700">
                {formatCompact(finalTotal)}
              </div>
              <div className="text-[10px] text-emerald-600/70">{formatRial(finalTotal)}</div>
            </div>
          </div>
        </Panel>

        {/* actions */}
        <div className="space-y-2">
          {!issued ? (
            <button
              onClick={issue}
              disabled={missingBrand}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Printer className="size-4" />
              صدور و چاپ پیش‌فاکتور
            </button>
          ) : (
            <>
              <button
                onClick={() => window.print()}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Printer className="size-4" />
                چاپ مجدد
              </button>
              <button
                onClick={() => log(id, "کاربر", "ارسال پیش‌فاکتور برای مشتری")}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Send className="size-4" />
                ارسال برای مشتری
              </button>
              <button
                onClick={approve}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <CheckCircle2 className="size-4" />
                تأیید مشتری و تبدیل به قرارداد
              </button>
            </>
          )}
          <button
            onClick={() => goToStage(id, 2)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowRight className="size-4" />
            بازگشت به برداشت
          </button>
        </div>
      </div>
    </div>
  );
}

function Line({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span
        className={cn(
          "text-slate-700",
          strong ? "font-bold" : "font-semibold"
        )}
      >
        {value}
      </span>
    </div>
  );
}
