"use client";

import {
  Plus,
  Receipt,
  Clock,
  CheckCircle2,
  Wallet,
  ArrowLeft,
} from "lucide-react";
import {
  PageHeader,
  Toolbar,
  FilterSelect,
  DataTable,
  StatusBadge,
  type Column,
} from "@/components/easy-lift";
import { KpiCard } from "@/components/easy-lift/kpi-card";
import {
  useQuotations,
  STAGE_LABELS,
  STAGE_SHORT,
  type QuotationRequest,
} from "@/lib/quotations-store";

interface Row {
  id: string;
  code: string;
  customer: string;
  elevators: number;
  floors: number;
  stage: number;
  status: string;
  createdAt: string;
}

export function RequestListView() {
  const requests = useQuotations((s) => s.requests);
  const select = useQuotations((s) => s.select);
  const createRequest = useQuotations((s) => s.createRequest);

  const rows: Row[] = requests.map((r) => ({
    id: r.id,
    code: r.code,
    customer: r.customer,
    elevators: r.building.elevatorCount,
    floors: r.building.floors,
    stage: r.stage,
    status: r.status,
    createdAt: r.createdAt,
  }));

  const active = requests.filter((r) => r.status === "active").length;
  const draft = requests.filter((r) => r.status === "draft").length;
  const inProgress = requests.filter((r) => r.stage > 1 && r.stage < 5).length;

  const columns: Column<Row>[] = [
    {
      key: "code",
      header: "شماره",
      align: "right",
      render: (r) => (
        <span className="font-mono font-bold text-emerald-600">{r.code}</span>
      ),
    },
    {
      key: "customer",
      header: "مشتری",
      align: "right",
      render: (r) => (
        <span className="font-semibold text-slate-800">{r.customer}</span>
      ),
    },
    { key: "floors", header: "طبقات", align: "center" },
    { key: "elevators", header: "آسانسور", align: "center" },
    {
      key: "stage",
      header: "مرحله",
      align: "center",
      render: (r) => (
        <StatusBadge tone={stageTone(r.stage)}>
          {r.stage.toLocaleString("fa-IR")} — {STAGE_SHORT[r.stage as 1 | 2 | 3 | 4 | 5]}
        </StatusBadge>
      ),
    },
    {
      key: "status",
      header: "وضعیت پروژه",
      align: "center",
      render: (r) =>
        r.status === "active" ? (
          <StatusBadge tone="emerald">Active</StatusBadge>
        ) : (
          <StatusBadge tone="slate">Draft</StatusBadge>
        ),
    },
  ];

  function newRequest() {
    const id = createRequest({
      requester: "internal",
      requesterName: "احمدی",
      customer: "",
      address: "",
      buildingType: "مسکونی",
      building: { floors: 8, unitsPerFloor: 4, elevatorCount: 1 },
    });
    select(id);
  }

  return (
    <div>
      <PageHeader
        icon={Receipt}
        title="مدیریت پیش‌فاکتورها"
        subtitle="گردش‌کار کامل: از ثبت درخواست تا تبدیل به پروژه اجرایی"
        searchPlaceholder="جستجوی شماره یا مشتری..."
        actionLabel="درخواست پیش‌فاکتور جدید"
        onAction={newRequest}
      />

      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        {/* KPI */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard tone="hero" label="کل درخواست‌ها" value={requests.length.toLocaleString("fa-IR")} icon={Receipt} />
          <KpiCard tone="amber" label="در حال انجام" value={inProgress.toLocaleString("fa-IR")} icon={Clock} />
          <KpiCard tone="emerald" label="تبدیل به پروژه" value={active.toLocaleString("fa-IR")} icon={CheckCircle2} />
          <KpiCard tone="sky" label="پیش‌نویس" value={draft.toLocaleString("fa-IR")} icon={Wallet} />
        </section>

        {/* workflow legend */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/70 bg-white p-3 text-xs">
          <span className="font-semibold text-slate-600">گردش‌کار:</span>
          {([1, 2, 3, 4, 5] as const).map((s, i) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className="grid size-5 place-items-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700">
                {s.toLocaleString("fa-IR")}
              </span>
              <span className="text-slate-500">{STAGE_LABELS[s]}</span>
              {i < 4 ? <span className="text-slate-300">←</span> : null}
            </span>
          ))}
        </div>

        <Toolbar
          filters={
            <>
              <FilterSelect>
                <option>همه مراحل</option>
                <option>ثبت درخواست</option>
                <option>برداشت اطلاعات</option>
                <option>صدور پیش‌فاکتور</option>
                <option>قرارداد</option>
                <option>پروژه اجرایی</option>
              </FilterSelect>
              <FilterSelect>
                <option>همه وضعیت‌ها</option>
                <option>Draft</option>
                <option>Active</option>
              </FilterSelect>
            </>
          }
        />

        <DataTable
          columns={columns}
          data={rows}
          onRowClick={(r) => select(r.id)}
          emptyText="هنوز درخواستی ثبت نشده است"
        />

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ArrowLeft className="size-3" />
          برای مشاهده گردش‌کار، روی هر ردیف کلیک کنید
        </div>
      </div>
    </div>
  );
}

function stageTone(stage: number): "emerald" | "amber" | "sky" | "violet" | "slate" {
  switch (stage) {
    case 1:
      return "slate";
    case 2:
      return "sky";
    case 3:
      return "amber";
    case 4:
      return "violet";
    case 5:
      return "emerald";
    default:
      return "slate";
  }
}
