"use client";

import { useState } from "react";
import { Building2, User, MapPin, Layers, Grid3x3, Cog, ArrowLeft } from "lucide-react";
import { Panel } from "@/components/easy-lift";
import { useQuotations, REQUESTER_LABELS, type RequesterType } from "@/lib/quotations-store";
import { cn } from "@/lib/utils";

export function Step1Request({ id }: { id: string }) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id)!);
  const updateRequest = useQuotations((s) => s.updateRequest);
  const goToStage = useQuotations((s) => s.goToStage);

  const [form, setForm] = useState({
    requester: req.requester,
    requesterName: req.requesterName,
    customer: req.customer,
    address: req.address,
    buildingType: req.buildingType,
    floors: String(req.building.floors),
    unitsPerFloor: String(req.building.unitsPerFloor),
    elevatorCount: String(req.building.elevatorCount),
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canProceed =
    form.customer.trim() &&
    form.address.trim() &&
    Number(form.floors) > 0 &&
    Number(form.elevatorCount) > 0;

  function save() {
    updateRequest(id, {
      requester: form.requester as RequesterType,
      requesterName: form.requesterName || REQUESTER_LABELS[form.requester as RequesterType],
      customer: form.customer,
      address: form.address,
      buildingType: form.buildingType,
      building: {
        floors: Number(form.floors),
        unitsPerFloor: Number(form.unitsPerFloor),
        elevatorCount: Number(form.elevatorCount),
      },
    });
  }

  function next() {
    save();
    goToStage(id, 2);
  }

  return (
    <Panel className="p-5 sm:p-6">
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900">ثبت درخواست پیش‌فاکتور</h3>
        <p className="mt-1 text-xs text-slate-500">
          اطلاعات اولیه ساختمان وارد شود. پس از ثبت، یک پروژه موقت (Draft) به همراه آسانسورهای آن در بخش «فنی و مهندسی» ایجاد می‌گردد.
        </p>
      </div>

      <div className="space-y-5">
        {/* requester */}
        <FieldGroup label="درخواست‌کننده" icon={User}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(REQUESTER_LABELS) as RequesterType[]).map((k) => (
              <button
                key={k}
                onClick={() => set("requester", k)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-xs font-medium transition",
                  form.requester === k
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {REQUESTER_LABELS[k]}
              </button>
            ))}
          </div>
          <input
            value={form.requesterName}
            onChange={(e) => set("requesterName", e.target.value)}
            placeholder="نام درخواست‌کننده"
            className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </FieldGroup>

        {/* customer + address */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup label="نام مشتری" icon={User}>
            <input
              value={form.customer}
              onChange={(e) => set("customer", e.target.value)}
              placeholder="مثال: شرکت پارسیان"
              className={cn(inputCls, !form.customer.trim() && "border-rose-200 bg-rose-50/40")}
            />
          </FieldGroup>
          <FieldGroup label="آدرس ساختمان" icon={MapPin}>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="مثال: تهران، شهرک غرب، پلاک ۱۲"
              className={cn(inputCls, !form.address.trim() && "border-rose-200 bg-rose-50/40")}
            />
          </FieldGroup>
        </div>

        {/* building type */}
        <FieldGroup label="کاربری ساختمان" icon={Building2}>
          <div className="flex flex-wrap gap-2">
            {["مسکونی", "اداری", "تجاری", "هتل", "بیمارستان"].map((t) => (
              <button
                key={t}
                onClick={() => set("buildingType", t)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
                  form.buildingType === t
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </FieldGroup>

        {/* numbers */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FieldGroup label="تعداد طبقات" icon={Layers}>
            <input
              type="number"
              min={1}
              value={form.floors}
              onChange={(e) => set("floors", e.target.value)}
              className={inputCls}
            />
          </FieldGroup>
          <FieldGroup label="تعداد واحد در هر طبقه" icon={Grid3x3}>
            <input
              type="number"
              min={1}
              value={form.unitsPerFloor}
              onChange={(e) => set("unitsPerFloor", e.target.value)}
              className={inputCls}
            />
          </FieldGroup>
          <FieldGroup label="تعداد دستگاه آسانسور" icon={Cog}>
            <input
              type="number"
              min={1}
              value={form.elevatorCount}
              onChange={(e) => set("elevatorCount", e.target.value)}
              className={inputCls}
            />
          </FieldGroup>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">
            {req.code}
          </span>
          <span>•</span>
          <span>وضعیت: Draft</span>
        </div>
        <button
          onClick={next}
          disabled={!canProceed}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ثبت و ارجاع به فنی و مهندسی
          <ArrowLeft className="size-4" />
        </button>
      </div>
    </Panel>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";

function FieldGroup({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        <Icon className="size-3.5 text-emerald-600" />
        {label}
      </label>
      {children}
    </div>
  );
}
