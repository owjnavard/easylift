"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FileSignature,
  Printer,
  PenTool,
  CheckCircle2,
} from "lucide-react";
import { Panel } from "@/components/easy-lift";
import { useQuotations, type ContractData } from "@/lib/quotations-store";
import { formatCompact } from "@/lib/vendor-data";

export function Step3Contract({ id }: { id: string }) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id)!);
  const saveContract = useQuotations((s) => s.saveContract);
  const signContract = useQuotations((s) => s.signContract);
  const goToStage = useQuotations((s) => s.goToStage);

  const [form, setForm] = useState<ContractData>(
    req.contract ?? {
      commitments: "",
      conditions: "",
      duration: "۶ ماه",
      prepayment: 0,
      paymentTerms: "",
      finalSpecs: "",
    }
  );

  const set = (k: keyof ContractData, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canSave = form.commitments.trim() && form.conditions.trim();
  const signed = !!req.contractSignedAt;

  function save() {
    saveContract(id, form);
  }
  function sign() {
    save();
    signContract(id);
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Panel className="p-5 sm:p-6">
          <div className="mb-5">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <FileSignature className="size-4" />
              </span>
              ایجاد قرارداد
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              تعهدات طرفین، شرایط و اطلاعات نهایی پروژه را وارد کنید.
            </p>
          </div>

          <div className="space-y-4">
            <Field label="تعهدات طرفین">
              <textarea
                value={form.commitments}
                onChange={(e) => set("commitments", e.target.value)}
                placeholder="تعهدات پیمانکار و کارفرما..."
                rows={3}
                className={taCls}
              />
            </Field>

            <Field label="شرایط قرارداد">
              <textarea
                value={form.conditions}
                onChange={(e) => set("conditions", e.target.value)}
                placeholder="شرایط عمومی و خاص قرارداد..."
                rows={3}
                className={taCls}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="مدت اجرا">
                <input
                  value={form.duration}
                  onChange={(e) => set("duration", e.target.value)}
                  placeholder="مثال: ۶ ماه"
                  className={inputCls}
                />
              </Field>
              <Field label="پیش‌پرداخت (ریال)">
                <input
                  type="number"
                  value={form.prepayment || ""}
                  onChange={(e) => set("prepayment", Number(e.target.value))}
                  placeholder="۰"
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="شرایط پرداخت">
              <input
                value={form.paymentTerms}
                onChange={(e) => set("paymentTerms", e.target.value)}
                placeholder="مثال: ۳۰٪ پیش‌پرداخت، ۴۰٪ حین اجرا، ۳۰٪ تحویل"
                className={inputCls}
              />
            </Field>

            <Field label="مشخصات نهایی پروژه">
              <textarea
                value={form.finalSpecs}
                onChange={(e) => set("finalSpecs", e.target.value)}
                placeholder="مشخصات فنی نهایی آسانسورها..."
                rows={3}
                className={taCls}
              />
            </Field>
          </div>
        </Panel>
      </div>

      {/* summary + actions */}
      <div className="space-y-5">
        <Panel className="p-5">
          <h3 className="text-sm font-bold text-slate-900">اطلاعات مالی</h3>
          <div className="mt-4 space-y-3 text-xs">
            <Row label="مشتری" value={req.customer} />
            <Row label="تعداد آسانسور" value={req.building.elevatorCount.toLocaleString("fa-IR")} />
            <Row
              label="پیش‌پرداخت"
              value={form.prepayment ? formatCompact(form.prepayment) : "تعیین نشده"}
            />
          </div>
        </Panel>

        <div className="space-y-2">
          {signed ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="size-4" />
              قرارداد امضا شد — آماده فعال‌سازی پروژه
            </div>
          ) : null}
          <button
            onClick={save}
            disabled={!canSave}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Printer className="size-4" />
            ذخیره و چاپ قرارداد
          </button>
          <button
            onClick={sign}
            disabled={!canSave || signed}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PenTool className="size-4" />
            {signed ? "امضا شده" : "ارسال برای امضای الکترونیکی"}
          </button>
          <button
            onClick={() => goToStage(id, signed ? 4 : 2)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {signed ? "تبدیل به پروژه اجرایی" : "بازگشت به پیش‌فاکتور"}
            {signed ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
          </button>
          {!signed ? (
            <button
              onClick={() => goToStage(id, 2)}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowRight className="size-4" />
              بازگشت به پیش‌فاکتور
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";
const taCls =
  "w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-700">{value}</span>
    </div>
  );
}
