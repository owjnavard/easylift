"use client";

import { useState } from "react";
import {
  Plus,
  Receipt,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowLeft,
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  type Column,
} from "@/components/easy-lift";
import { KpiCard } from "@/components/easy-lift/kpi-card";
import {
  useQuotations,
  STAGE_LABELS,
  STAGE_SHORT,
  REQUESTER_LABELS,
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_TONE,
  type QuoteStatus,
} from "@/lib/quotations-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Row {
  id: string;
  code: string;
  customer: string;
  projectName: string;
  requester: string;
  stage: number;
  quoteStatus: QuoteStatus;
  elevatorCount: number;
  createdAt: string;
}

// ------ ویرایش سریع (نام مشتری + پروژه) ------
function EditDialog({
  id,
  open,
  onOpenChange,
}: {
  id: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id));
  const updateRequest = useQuotations((s) => s.updateRequest);

  const [customer, setCustomer] = useState(req?.customer ?? "");
  const [projectName, setProjectName] = useState(req?.projectName ?? "");

  if (!req) return null;

  function save() {
    updateRequest(id, { customer, projectName });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-slate-100 p-5">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Pencil className="size-4 text-emerald-600" />
            ویرایش پیش‌فاکتور
            <span className="font-mono text-xs font-normal text-slate-400">{req.code}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">نام مشتری</label>
            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">نام پروژه</label>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>
        <DialogFooter className="border-t border-slate-100 p-4">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            انصراف
          </button>
          <button
            onClick={save}
            disabled={!customer.trim() || !projectName.trim()}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"
          >
            ذخیره تغییرات
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RequestListView() {
  const requests = useQuotations((s) => s.requests);
  const select = useQuotations((s) => s.select);
  const createRequest = useQuotations((s) => s.createRequest);
  const deleteRequest = useQuotations((s) => s.deleteRequest);

  // فیلتر
  const [filterStatus, setFilterStatus] = useState<QuoteStatus | "all">("all");

  // دیالوگ ویرایش و حذف
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // اعمال فیلتر
  const filtered = requests.filter((r) => {
    if (filterStatus !== "all" && r.quoteStatus !== filterStatus) return false;
    return true;
  });

  const rows: Row[] = filtered.map((r) => ({
    id: r.id,
    code: r.code,
    customer: r.customer || "—",
    projectName: r.projectName || "—",
    requester: `${REQUESTER_LABELS[r.requester]}${r.requesterName ? ` — ${r.requesterName}` : ""}`,
    stage: r.stage,
    quoteStatus: r.quoteStatus,
    elevatorCount: r.elevators?.length ?? r.building.elevatorCount,
    createdAt: r.createdAt,
  }));

  // KPI
  const draft = requests.filter((r) => r.quoteStatus === "draft").length;
  const inProgress = requests.filter((r) => r.quoteStatus === "in_progress").length;
  const approved = requests.filter((r) => r.quoteStatus === "approved").length;
  const rejected = requests.filter((r) => r.quoteStatus === "rejected").length;

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
    {
      key: "projectName",
      header: "نام پروژه",
      align: "center",
      render: (r) => <span className="text-slate-600">{r.projectName}</span>,
    },
    {
      key: "elevatorCount",
      header: "آسانسور",
      align: "center",
      render: (r) => (
        <span className="text-xs font-semibold text-slate-700">
          {r.elevatorCount.toLocaleString("fa-IR")} دستگاه
        </span>
      ),
    },
    {
      key: "quoteStatus",
      header: "وضعیت",
      align: "center",
      render: (r) => (
        <StatusBadge tone={QUOTE_STATUS_TONE[r.quoteStatus]}>
          {QUOTE_STATUS_LABELS[r.quoteStatus]}
        </StatusBadge>
      ),
    },
    {
      key: "stage",
      header: "مرحله",
      align: "center",
      render: (r) => (
        <StatusBadge tone={stageTone(r.stage)}>
          {r.stage.toLocaleString("fa-IR")} — {STAGE_SHORT[r.stage as 1 | 2 | 3 | 4]}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "center",
      render: (r) => (
        <div
          className="flex items-center justify-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setEditId(r.id)}
            className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            title="ویرایش"
            aria-label="ویرایش پیش‌فاکتور"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            onClick={() => setDeleteId(r.id)}
            className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
            title="حذف"
            aria-label="حذف پیش‌فاکتور"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
    },
  ];

  function newRequest() {
    const id = createRequest({
      requester: "internal",
      requesterName: "احمدی",
      customer: "",
      projectName: "",
      elevators: [{ id: Math.random().toString(36).slice(2, 10), name: "آسانسور ۱" }],
      address: "",
      representatives: [],
    });
    select(id);
  }

  const deleteTarget = requests.find((r) => r.id === deleteId);

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
        {/* KPI — وضعیت‌های پیش‌فاکتور (کلیک برای فیلتر) */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => setFilterStatus(filterStatus === "draft" ? "all" : "draft")}
            className="text-right transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl"
            style={{ opacity: filterStatus !== "all" && filterStatus !== "draft" ? 0.45 : 1 }}
          >
            <KpiCard
              tone="slate"
              label="پیش‌نویس"
              value={draft.toLocaleString("fa-IR")}
              icon={FileText}
              active={filterStatus === "draft"}
            />
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus(filterStatus === "in_progress" ? "all" : "in_progress")}
            className="text-right transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl"
            style={{ opacity: filterStatus !== "all" && filterStatus !== "in_progress" ? 0.45 : 1 }}
          >
            <KpiCard
              tone="amber"
              label="در حال انجام"
              value={inProgress.toLocaleString("fa-IR")}
              icon={Clock}
              active={filterStatus === "in_progress"}
            />
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus(filterStatus === "approved" ? "all" : "approved")}
            className="text-right transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl"
            style={{ opacity: filterStatus !== "all" && filterStatus !== "approved" ? 0.45 : 1 }}
          >
            <KpiCard
              tone="hero"
              label="تایید شده"
              value={approved.toLocaleString("fa-IR")}
              icon={CheckCircle2}
              active={filterStatus === "approved"}
            />
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus(filterStatus === "rejected" ? "all" : "rejected")}
            className="text-right transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl"
            style={{ opacity: filterStatus !== "all" && filterStatus !== "rejected" ? 0.45 : 1 }}
          >
            <KpiCard
              tone="sky"
              label="تایید نشده"
              value={rejected.toLocaleString("fa-IR")}
              icon={XCircle}
              active={filterStatus === "rejected"}
            />
          </button>
        </section>

        {filtered.length === 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <AlertCircle className="size-4 shrink-0" />
            <span>درخواستی با این فیلترها یافت نشد.</span>
            <button
              onClick={() => setFilterStatus("all")}
              className="mr-auto text-xs font-semibold underline underline-offset-2"
            >
              پاک کردن فیلترها
            </button>
          </div>
        )}

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

      {/* دیالوگ ویرایش */}
      {editId && (
        <EditDialog
          id={editId}
          open={Boolean(editId)}
          onOpenChange={(v) => !v && setEditId(null)}
        />
      )}

      {/* دیالوگ تأیید حذف */}
      <AlertDialog open={Boolean(deleteId)} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
              <Trash2 className="size-4" />
              حذف پیش‌فاکتور
            </AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف پیش‌فاکتور{" "}
              <span className="font-mono font-bold text-slate-900">
                {deleteTarget?.code}
              </span>{" "}
              مشتری «{deleteTarget?.customer}» اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) deleteRequest(deleteId);
                setDeleteId(null);
              }}
              className="bg-rose-600 hover:bg-rose-700"
            >
              بله، حذف شود
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function stageTone(stage: number): "emerald" | "amber" | "sky" | "violet" | "slate" {
  switch (stage) {
    case 1: return "slate";
    case 2: return "amber";
    case 3: return "violet";
    case 4: return "emerald";
    default: return "slate";
  }
}
