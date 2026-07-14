"use client";

import {
  ArrowRight,
  Rocket,
  CheckCircle2,
  Building2,
  Cog,
  ClipboardCheck,
  FileSignature,
  Receipt,
  PartyPopper,
} from "lucide-react";
import { Panel, StatusBadge } from "@/components/easy-lift";
import { useQuotations } from "@/lib/quotations-store";
import { useProjectStore } from "@/lib/project-store";
import { PART_MAP, formatCompact } from "@/lib/vendor-data";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";

export function Step4Activate({ id }: { id: string }) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id)!);
  const activate = useQuotations((s) => s.activate);
  const goToStage = useQuotations((s) => s.goToStage);

  const project = useProjectStore((s) =>
    s.projects.find((p) => p.id === req.projectId)
  );
  const elevators = useProjectStore(
    useShallow((s) => s.elevators.filter((e) => e.projectId === req.projectId))
  );
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

  const isActive = req.status === "active";

  const partsTotal = parts.reduce((sum, p) => {
    const brandId = req.partBrands[p.partId];
    const brand = brandId
      ? PART_MAP[p.partId]?.brands.find((b) => b.id === brandId)
      : null;
    if (!brand) return sum;
    return sum + brand.price * p.qty;
  }, 0);
  const extrasTotal = req.extras.reduce((s, e) => s + e.amount, 0);
  const subtotal = partsTotal + extrasTotal;
  const profit = Math.round((subtotal * req.profitPercent) / 100);
  const finalTotal = Math.max(0, subtotal + profit - req.discountAmount);

  const surveyedCount = elevators.filter((e) => e.survey?.completedAt).length;

  return (
    <div className="space-y-5">
      {isActive ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <PartyPopper className="size-8 text-emerald-600" />
          <div>
            <h3 className="text-base font-bold text-emerald-800">
              پروژه با موفقیت فعال شد!
            </h3>
            <p className="mt-0.5 text-xs text-emerald-700">
              پروژه موقت به پروژه اجرایی تبدیل شد و در لیست پروژه‌های بخش «فنی و مهندسی» به‌صورت فعال نمایش داده می‌شود. تمام اطلاعات مراحل قبل حفظ شده است.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panel className="p-5 sm:p-6">
            <h3 className="text-base font-bold text-slate-900">خلاصه کل فرآیند</h3>
            <p className="mt-1 text-xs text-slate-500">
              تمام اطلاعات ثبت‌شده در مراحل قبل، بدون نیاز به ورود مجدد، به پروژه اجرایی منتقل می‌شود.
            </p>

            <div className="mt-5 space-y-3">
              <SummaryItem
                icon={Receipt}
                label="مرحله ۱ — درخواست"
                value={`${req.customer} • ${req.building.floors} طبقه • ${req.building.elevatorCount} آسانسور`}
                done
              />
              <SummaryItem
                icon={ClipboardCheck}
                label="برداشت (در فنی و مهندسی)"
                value={`${surveyedCount.toLocaleString("fa-IR")} از ${elevators.length.toLocaleString("fa-IR")} آسانسور برداشت شد • ${parts.length.toLocaleString("fa-IR")} نوع قطعه محاسبه شد`}
                done={surveyedCount === elevators.length}
              />
              <SummaryItem
                icon={Cog}
                label="مرحله ۲ — پیش‌فاکتور"
                value={`${parts.length.toLocaleString("fa-IR")} نوع قطعه • مبلغ نهایی ${formatCompact(finalTotal)}`}
                done={!!req.issuedAt}
              />
              <SummaryItem
                icon={FileSignature}
                label="مرحله ۳ — قرارداد"
                value={
                  req.contract
                    ? `مدت: ${req.contract.duration} • ${req.contractSignedAt ? "امضا شده" : "در انتظار امضا"}`
                    : "ثبت نشده"
                }
                done={!!req.contract}
              />
              <SummaryItem
                icon={Rocket}
                label="مرحله ۴ — فعال‌سازی"
                value={isActive ? "پروژه فعال شد" : "در انتظار فعال‌سازی"}
                done={isActive}
              />
            </div>
          </Panel>

          <Panel className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
              <Building2 className="size-4 text-emerald-600" />
              مشخصات پروژه اجرایی
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Info label="کد پروژه" value={project?.code ?? req.code} />
              <Info label="مشتری" value={req.customer} />
              <Info label="آدرس" value={req.address} />
              <Info label="کاربری" value={req.buildingType} />
              <Info label="طبقات" value={req.building.floors.toLocaleString("fa-IR")} />
              <Info label="آسانسور" value={req.building.elevatorCount.toLocaleString("fa-IR")} />
              <Info label="وضعیت" value={isActive ? "Active" : "Draft"} />
              <Info label="مبلغ قرارداد" value={formatCompact(finalTotal)} />
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel className="p-5">
            <h3 className="text-sm font-bold text-slate-900">وضعیت نهایی</h3>
            <div className="mt-4">
              {isActive ? (
                <StatusBadge tone="emerald" className="px-3 py-1.5">
                  پروژه فعال
                </StatusBadge>
              ) : (
                <StatusBadge tone="amber" className="px-3 py-1.5">
                  آماده فعال‌سازی
                </StatusBadge>
              )}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              با فعال‌سازی، وضعیت پروژه از <strong>Draft</strong> به <strong>Active</strong> تغییر می‌کند و در لیست پروژه‌های در حال اجرای بخش «فنی و مهندسی» نمایش داده می‌شود.
            </p>
          </Panel>

          <div className="space-y-2">
            {!isActive ? (
              <button
                onClick={() => activate(id)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Rocket className="size-4" />
                فعال‌سازی پروژه اجرایی
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="size-4" />
                پروژه در حال اجراست
              </div>
            )}
            <button
              onClick={() => goToStage(id, 3)}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowRight className="size-4" />
              بازگشت به قرارداد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
  done,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-lg ${
          done ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
        }`}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-slate-700">{label}</div>
        <div className="truncate text-[11px] text-slate-500">{value}</div>
      </div>
      {done ? <CheckCircle2 className="size-4 shrink-0 text-emerald-600" /> : null}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="text-[10px] text-slate-500">{label}</div>
      <div className="mt-0.5 truncate text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}
