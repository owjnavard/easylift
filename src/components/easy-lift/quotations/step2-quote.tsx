"use client";

import { useState, useMemo } from "react";
import {
  ArrowRight,
  Printer,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Calculator,
  Clock,
  ExternalLink,
  Info,
} from "lucide-react";
import { Panel, StatusBadge } from "@/components/easy-lift";
import { useQuotations } from "@/lib/quotations-store";
import { useProjectStore } from "@/lib/project-store";
import { useNav } from "@/lib/nav-store";
import { PART_MAP, formatRial, formatCompact } from "@/lib/vendor-data";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";

export function Step2Quote({ id }: { id: string }) {
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

  const project = useProjectStore((s) =>
    s.projects.find((p) => p.id === req.projectId)
  );
  const elevators = useProjectStore(
    useShallow((s) => s.elevators.filter((e) => e.projectId === req.projectId))
  );
  const selectElevator = useProjectStore((s) => s.selectElevator);
  const setPage = useNav((s) => s.setPage);

  const parts = useMemo(() => {
    const map = new Map<string, { partId: string; qty: number; formula: string }>();
    for (const e of elevators) {
      for (const p of e.parts) {
        const cur = map.get(p.partId);
        if (cur) cur.qty += p.qty;
        else map.set(p.partId, { partId: p.partId, qty: p.qty, formula: p.formula });
      }
    }
    return Array.from(map.values());
  }, [elevators]);

  const surveyed = elevators.filter((e) => e.survey?.completedAt).length;
  const allSurveyed = elevators.length > 0 && surveyed === elevators.length;
  const waitingForSurvey = !allSurveyed;

  const [extraLabel, setExtraLabel] = useState("");
  const [extraAmount, setExtraAmount] = useState("");
  const [issued, setIssued] = useState(!!req.issuedAt);

  const partsTotal = parts.reduce((sum, p) => {
    const brandId = req.partBrands[p.partId];
    const brand = brandId
      ? PART_MAP[p.partId]?.brands.find((b) => b.id === brandId)
      : null;
    if (!brand) return sum;
    return sum + brand.price * p.qty;
  }, 0);

  const missingBrand = parts.some((p) => !req.partBrands[p.partId]);
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
    goToStage(id, 3);
  }
  function addExtraCost() {
    const amt = Number(extraAmount);
    if (!extraLabel.trim() || !amt || amt <= 0) return;
    addExtra(id, extraLabel.trim(), amt);
    setExtraLabel("");
    setExtraAmount("");
  }
  function openElevator(elevId: string) {
    selectElevator(elevId);
    setPage("elevator");
  }
  function goTechnical() {
    setPage("technical");
  }

  // ===== Waiting-for-survey state =====
  if (waitingForSurvey) {
    return (
      <div className="space-y-4">
        <Panel className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="size-6" />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900">
                در انتظار برداشت اطلاعات
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                پیش‌فاکتور تا زمان تکمیل برداشت اطلاعات همه آسانسورها توسط واحد فنی،
                در وضعیت انتظار قرار دارد. پس از تکمیل برداشت، قطعات به‌صورت خودکار
                محاسبه و در این صفحه نمایش داده می‌شوند.
              </p>
            </div>
          </div>

          {/* progress */}
          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-slate-500">پیشرفت برداشت</span>
              <span className="font-semibold text-slate-700">
                {surveyed.toLocaleString("fa-IR")} از{" "}
                {elevators.length.toLocaleString("fa-IR")} آسانسور
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200/70">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{
                  width: `${elevators.length > 0 ? (surveyed / elevators.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </Panel>

        {/* elevators list */}
        <Panel padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              آسانسورهای پروژه
            </h3>
            <button
              onClick={goTechnical}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <ExternalLink className="size-3.5" />
              رفتن به فنی و مهندسی
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {elevators.map((e) => {
              const done = !!e.survey?.completedAt;
              return (
                <div
                  key={e.id}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                        done
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <Clock className="size-5" />
                      )}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-800">{e.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {done
                          ? `برداشت تکمیل • ${e.parts.length.toLocaleString("fa-IR")} نوع قطعه`
                          : "در انتظار برداشت اطلاعات"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openElevator(e.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    {done ? "ویرایش برداشت" : "برداشت اطلاعات"}
                  </button>
                </div>
              );
            })}
          </div>
        </Panel>

        <button
          onClick={() => goToStage(id, 1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <ArrowRight className="size-4" />
          بازگشت به درخواست
        </button>
      </div>
    );
  }

  // ===== Quote issue — vertical stacked layout =====
  return (
    <div className="space-y-5">
      {/* survey completed banner */}
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">
        <CheckCircle2 className="size-4 shrink-0" />
        برداشت اطلاعات همه آسانسورها تکمیل شد — {parts.length.toLocaleString("fa-IR")}{" "}
        نوع قطعه محاسبه و در ادامه نمایش داده می‌شود.
      </div>

      {/* 1) Parts panel */}
      <Panel padded={false} className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <Calculator className="size-4" />
              </span>
              قطعات محاسبه‌شده
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              تجمیعی از برداشت اطلاعات آسانسورهای پروژه — برند هر قطعه را از Vendor List انتخاب کنید
            </p>
          </div>
          <StatusBadge tone={missingBrand ? "amber" : "emerald"}>
            {parts.length.toLocaleString("fa-IR")} نوع قطعه
          </StatusBadge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-slate-50/80">
              <tr className="border-b border-slate-200/70">
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">قطعه</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">تعداد کل</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">برند</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">قیمت واحد</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p) => {
                const part = PART_MAP[p.partId];
                if (!part) return null;
                const brandId = req.partBrands[p.partId];
                const brand = brandId
                  ? part.brands.find((b) => b.id === brandId)
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
                        value={brandId ?? ""}
                        onChange={(e) =>
                          setPartBrand(id, p.partId, e.target.value || null)
                        }
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

      {/* 2) Extras panel */}
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

      {/* 3) Final price panel */}
      <Panel className="p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
          <Calculator className="size-4 text-emerald-600" />
          محاسبه قیمت نهایی
        </h3>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* left: breakdown */}
          <div className="space-y-3 text-sm">
            <Line label="جمع قطعات" value={formatCompact(partsTotal)} />
            <Line label="هزینه‌های جانبی" value={formatCompact(extrasTotal)} />
            <div className="border-t border-slate-100 pt-3">
              <Line label="جمع کل" value={formatCompact(subtotal)} strong />
            </div>
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
              <label className="mb-1.5 block text-xs text-slate-500">
                تخفیف (ریال)
              </label>
              <input
                type="number"
                value={req.discountAmount || ""}
                onChange={(e) => setDiscount(id, Number(e.target.value))}
                placeholder="۰"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* right: final total + actions */}
          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <div className="text-xs text-emerald-700">قیمت نهایی</div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-700">
                {formatCompact(finalTotal)}
              </div>
              <div className="text-[10px] text-emerald-600/70">
                {formatRial(finalTotal)}
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              <span>
                برای صدور پیش‌فاکتور، برند همه قطعات باید انتخاب شود.
              </span>
            </div>

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
                onClick={() => goToStage(id, 1)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <ArrowRight className="size-4" />
                بازگشت به درخواست
              </button>
            </div>
          </div>
        </div>
      </Panel>
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
