"use client";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Cog,
  CheckCircle2,
  ExternalLink,
  ClipboardCheck,
  Info,
} from "lucide-react";
import { Panel, StatusBadge } from "@/components/easy-lift";
import { useQuotations } from "@/lib/quotations-store";
import { useProjectStore } from "@/lib/project-store";
import { useNav } from "@/lib/nav-store";
import { useShallow } from "zustand/react/shallow";

export function Step2Refer({ id }: { id: string }) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id)!);
  const goToStage = useQuotations((s) => s.goToStage);
  const log = useQuotations((s) => s.log);

  const project = useProjectStore((s) =>
    s.projects.find((p) => p.id === req.projectId)
  );
  const elevators = useProjectStore(
    useShallow((s) => s.elevators.filter((e) => e.projectId === req.projectId))
  );
  const selectElevator = useProjectStore((s) => s.selectElevator);
  const setPage = useNav((s) => s.setPage);

  const surveyed = elevators.filter((e) => e.survey?.completedAt).length;
  const allSurveyed =
    elevators.length > 0 && surveyed === elevators.length;

  function openElevator(elevId: string) {
    selectElevator(elevId);
    setPage("elevator");
  }

  function goTechnical() {
    setPage("technical");
  }

  function proceed() {
    log(
      id,
      "کاربر",
      "تأیید تکمیل برداشت اطلاعات آسانسورها",
      `${surveyed.toLocaleString("fa-IR")} از ${elevators.length.toLocaleString("fa-IR")} آسانسور`
    );
    goToStage(id, 3);
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        {/* referral banner */}
        <Panel className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <ExternalLink className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900">
                ارجاع به بخش فنی و مهندسی
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                پروژه موقت و آسانسورهای آن در بخش «فنی و مهندسی» ایجاد شدند.
                برای برداشت اطلاعات، وارد تب «برداشت اطلاعات» هر آسانسور شوید.
                پس از تکمیل برداشت همه آسانسورها، قطعات به‌صورت خودکار محاسبه و
                به این پیش‌فاکتور منتقل می‌شوند.
              </p>
            </div>
          </div>

          {/* project card */}
          {project ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <Building2 className="size-5" />
                </span>
                <div>
                  <div className="font-bold text-slate-900">{project.name}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    کد: {project.code} • {project.customer}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-lg bg-white px-2.5 py-1 font-medium text-slate-600">
                  {project.floors.toLocaleString("fa-IR")} طبقه
                </span>
                <span className="rounded-lg bg-white px-2.5 py-1 font-medium text-slate-600">
                  {project.elevatorCount.toLocaleString("fa-IR")} آسانسور
                </span>
                <StatusBadge tone={project.status === "active" ? "emerald" : "slate"}>
                  {project.status === "active" ? "فعال" : "Draft"}
                </StatusBadge>
              </div>
            </div>
          ) : null}

          <button
            onClick={goTechnical}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <ExternalLink className="size-4" />
            رفتن به بخش فنی و مهندسی
          </button>
        </Panel>

        {/* elevators list */}
        <Panel padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Cog className="size-4 text-emerald-600" />
              آسانسورهای پروژه
            </h3>
            <StatusBadge tone={allSurveyed ? "emerald" : "amber"}>
              {surveyed.toLocaleString("fa-IR")} از{" "}
              {elevators.length.toLocaleString("fa-IR")} تکمیل
            </StatusBadge>
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
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <Cog className="size-5" />
                      )}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-800">{e.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {done
                          ? `برداشت تکمیل • ${e.parts.length.toLocaleString("fa-IR")} نوع قطعه محاسبه شد`
                          : "در انتظار برداشت اطلاعات"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openElevator(e.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <ClipboardCheck className="size-3.5" />
                    {done ? "ویرایش برداشت" : "برداشت اطلاعات"}
                  </button>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* summary + nav */}
      <div className="space-y-5">
        <Panel className="p-5">
          <h3 className="text-sm font-bold text-slate-900">وضعیت برداشت</h3>
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-slate-500">پیشرفت برداشت</span>
              <span className="font-semibold text-slate-700">
                {elevators.length > 0
                  ? Math.round((surveyed / elevators.length) * 100).toLocaleString(
                      "fa-IR"
                    )
                  : "۰"}
                ٪
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200/70">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${elevators.length > 0 ? (surveyed / elevators.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-sky-50 p-3 text-xs text-sky-700">
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              قطعات هر آسانسور پس از تکمیل برداشت، به‌صورت خودکار محاسبه و در
              مرحله صدور پیش‌فاکتور تجمیع می‌شوند.
            </span>
          </div>
        </Panel>

        <div className="space-y-2">
          <button
            onClick={proceed}
            disabled={!allSurveyed}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            تأیید و صدور پیش‌فاکتور
            <ArrowLeft className="size-4" />
          </button>
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
  );
}
