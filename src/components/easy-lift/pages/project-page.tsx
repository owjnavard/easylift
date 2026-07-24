"use client";

import { useState } from "react";
import {
  ArrowRight,
  Plus,
  Building2,
  Warehouse,
  User,
  FileText,
  FolderOpen,
  History,
  Cog,
  ClipboardCheck,
  Calculator,
  ChevronDown,
  ListChecks,
  ScrollText,
  PackageCheck,
  Truck,
  ShoppingCart,
  Boxes,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRightLeft,
  Save,
  ClipboardList,
} from "lucide-react";
import { useNav } from "@/lib/nav-store";
import { useProjectStore, type SupplyStatus } from "@/lib/project-store";
import { Panel, StatusBadge, StatBar } from "@/components/easy-lift";
import { PART_MAP } from "@/lib/vendor-data";
import { SURVEY_STAGES } from "@/lib/survey-stages";
import { ELEVATOR_TYPES, STANDARD_CALC_TYPES } from "@/lib/technical-modules";
import { SurveyEditor } from "@/components/easy-lift/project/survey-editor";
import { cn } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";

const TABS = [
  { id: "info", label: "اطلاعات عمومی", icon: Building2 },
  { id: "elevators", label: "اطلاعات آسانسورها", icon: Cog },
  { id: "warehouse", label: "انبار پروژه", icon: Warehouse },
  { id: "tasks", label: "وظایف و دستورالعمل‌ها", icon: ListChecks },
  { id: "commitments", label: "تعهدات فنی", icon: ScrollText },
  { id: "survey", label: "برداشت اطلاعات", icon: ClipboardCheck },
  { id: "calc", label: "محاسبات فنی", icon: Calculator },
  { id: "standard", label: "استاندارد", icon: FileText },
  { id: "history", label: "تاریخچه پروژه", icon: History },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ProjectPage() {
  const setPage = useNav((s) => s.setPage);
  const [tab, setTab] = useState<TabId>("info");
  const projectId = useProjectStore((s) => s.selectedProjectId);
  const project = useProjectStore((s) =>
    s.projects.find((p) => p.id === projectId)
  );

  if (!project) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <button onClick={() => setPage("technical")} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-700">
          <ArrowRight className="size-4" /> بازگشت به فنی و مهندسی
        </button>
        <Panel className="p-10 text-center">
          <FolderOpen className="mx-auto size-12 text-slate-300" />
          <h2 className="mt-4 text-base font-bold text-slate-600">پروژه‌ای انتخاب نشده است</h2>
          <button onClick={() => setPage("technical")} className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
            رفتن به فنی و مهندسی
          </button>
        </Panel>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <button onClick={() => setPage("technical")} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-700">
        <ArrowRight className="size-4" /> بازگشت به فنی و مهندسی
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <FolderOpen className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{project.name}</h1>
            <p className="mt-0.5 text-xs text-slate-500">کد پروژه: {project.code} • {project.customer}</p>
          </div>
        </div>
        <StatusBadge tone={project.status === "active" ? "emerald" : "slate"} className="px-3 py-1.5 text-xs">
          {project.status === "active" ? "فعال" : "Draft"}
        </StatusBadge>
      </div>

      <div className="el-tabs-row mt-6 flex gap-5 overflow-x-auto border-b border-slate-200">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn("el-tab inline-flex items-center gap-1.5 pb-3 pt-1 text-sm text-slate-500", active && "active !text-emerald-700")}>
              <Icon className="size-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-h-[400px]">
        {tab === "info" && <InfoTab projectId={project.id} />}
        {tab === "elevators" && <ElevatorsTab projectId={project.id} />}
        {tab === "warehouse" && <WarehouseTab projectId={project.id} />}
        {tab === "tasks" && <TasksTab projectId={project.id} />}
        {tab === "commitments" && <CommitmentsTab projectId={project.id} />}
        {tab === "survey" && <SurveyTab projectId={project.id} />}
        {tab === "calc" && <CalcTab projectId={project.id} />}
        {tab === "standard" && <StandardTab projectId={project.id} />}
        {tab === "history" && <HistoryTab projectId={project.id} />}
      </div>
    </div>
  );
}

/* ===== Elevator Selector ===== */
function ElevatorSelector({ projectId, value, onChange, allowAll = false }: {
  projectId: string; value: string; onChange: (id: string) => void; allowAll?: boolean;
}) {
  const elevators = useProjectStore(
    useShallow((s) => s.elevators.filter((e) => e.projectId === projectId))
  );
  return (
    <div className="mb-4 flex items-center gap-2">
      <label className="text-xs font-bold text-slate-500">انتخاب آسانسور:</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-8 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100">
          {allowAll ? <option value="">همه آسانسورها</option> : null}
          {elevators.map((e) => (<option key={e.id} value={e.id}>{e.name} ({e.code})</option>))}
        </select>
        <ChevronDown className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

/* ===== Tab: اطلاعات عمومی ===== */
function InfoTab({ projectId }: { projectId: string }) {
  const project = useProjectStore((s) => s.projects.find((p) => p.id === projectId))!;
  const elevators = useProjectStore(useShallow((s) => s.elevators.filter((e) => e.projectId === projectId)));
  const avgProgress = elevators.length > 0 ? Math.round(elevators.reduce((s, e) => s + e.progress, 0) / elevators.length) : 0;
  return (
    <Panel className="p-5 sm:p-6">
      <h3 className="mb-4 text-sm font-bold text-slate-900">اطلاعات عمومی پروژه</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { l: "نام پروژه", v: project.name },
          { l: "کد پروژه", v: project.code },
          { l: "مشتری", v: project.customer },
          { l: "مکان", v: project.address },
          { l: "کاربری", v: project.buildingType },
          { l: "تعداد طبقات", v: project.floors.toLocaleString("fa-IR") },
          { l: "واحد در طبقه", v: project.unitsPerFloor.toLocaleString("fa-IR") },
          { l: "تعداد آسانسور", v: project.elevatorCount.toLocaleString("fa-IR") },
          { l: "وضعیت", v: project.status === "active" ? "فعال" : "Draft" },
        ].map((f) => (
          <div key={f.l} className="rounded-xl bg-slate-50 p-4">
            <div className="text-[11px] text-slate-500">{f.l}</div>
            <div className="mt-1 text-sm font-semibold text-slate-800">{f.v}</div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="text-slate-500">پیشرفت کلی پروژه</span>
          <span className="font-bold text-emerald-600">{avgProgress.toLocaleString("fa-IR")}٪</span>
        </div>
        <StatBar percent={avgProgress} barClass="bg-emerald-500" />
      </div>
    </Panel>
  );
}

/* ===== Tab: اطلاعات آسانسورها ===== */
function ElevatorsTab({ projectId }: { projectId: string }) {
  const elevators = useProjectStore(useShallow((s) => s.elevators.filter((e) => e.projectId === projectId)));
  const [selectedId, setSelectedId] = useState(elevators[0]?.id ?? "");
  const elevator = elevators.find((e) => e.id === selectedId);
  if (elevators.length === 0) return <Panel className="p-8 text-center text-sm text-slate-400">آسانسوری ثبت نشده است</Panel>;
  return (
    <Panel className="p-5 sm:p-6">
      <ElevatorSelector projectId={projectId} value={selectedId} onChange={setSelectedId} />
      {elevator ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { l: "کد آسانسور", v: elevator.code },
              { l: "نام", v: elevator.name },
              { l: "وضعیت", v: elevator.status },
              { l: "پیشرفت", v: `${elevator.progress.toLocaleString("fa-IR")}٪` },
              { l: "برداشت اطلاعات", v: elevator.survey ? "تکمیل شده" : "در انتظار" },
              { l: "قطعات محاسبه‌شده", v: `${elevator.parts.length.toLocaleString("fa-IR")} نوع` },
            ].map((f) => (
              <div key={f.l} className="rounded-xl bg-slate-50 p-4">
                <div className="text-[11px] text-slate-500">{f.l}</div>
                <div className="mt-1 text-sm font-semibold text-slate-800">{f.v}</div>
              </div>
            ))}
          </div>
          {elevator.survey ? (
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="mb-3 text-xs font-bold text-slate-600">مشخصات برداشت‌شده</h4>
              <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <div><span className="text-slate-400">عرض چاه:</span> <span className="font-semibold">{elevator.survey.pitWidth.toLocaleString("fa-IR")} cm</span></div>
                <div><span className="text-slate-400">عمق چاله:</span> <span className="font-semibold">{elevator.survey.pitDepth.toLocaleString("fa-IR")} m</span></div>
                <div><span className="text-slate-400">ارتفاع طبقه:</span> <span className="font-semibold">{elevator.survey.floorHeight.toLocaleString("fa-IR")} m</span></div>
                <div><span className="text-slate-400">اورهد:</span> <span className="font-semibold">{elevator.survey.headroom.toLocaleString("fa-IR")} m</span></div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </Panel>
  );
}

/* ===== Tab: انبار پروژه (با گردش کار انتقال) ===== */
function WarehouseTab({ projectId }: { projectId: string }) {
  const elevators = useProjectStore(useShallow((s) => s.elevators.filter((e) => e.projectId === projectId)));
  const supplies = useProjectStore((s) => s.supplies);
  const [selectedId, setSelectedId] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const projectSupplies = selectedId
    ? supplies.filter((s) => s.elevatorId === selectedId)
    : supplies.filter((s) => elevators.some((e) => e.id === s.elevatorId));

  const statusConfig: Record<SupplyStatus, { label: string; tone: any; icon: any }> = {
    "main-stock": { label: "موجود در انبار اصلی", tone: "sky", icon: Boxes },
    "transfer-requested": { label: "درخواست انتقال (در انتظار تأیید)", tone: "amber", icon: Clock },
    "project-stock": { label: "منتقل به انبار پروژه", tone: "amber", icon: PackageCheck },
    "delivered": { label: "تحویل پروژه شده", tone: "emerald", icon: Truck },
    "purchase-request": { label: "درخواست خرید", tone: "violet", icon: ShoppingCart },
    "return-requested": { label: "درخواست برگشت", tone: "rose", icon: ArrowRightLeft },
  };

  function toggleItem(id: string) {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function toggleAll() {
    if (selectedItems.size === projectSupplies.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(projectSupplies.map((s) => s.elevatorId + s.partId)));
    }
  }

  if (elevators.length === 0) return <Panel className="p-8 text-center text-sm text-slate-400">آسانسوری ثبت نشده است</Panel>;

  return (
    <Panel className="p-5 sm:p-6">
      <ElevatorSelector projectId={projectId} value={selectedId} onChange={(v) => { setSelectedId(v); setSelectedItems(new Set()); }} allowAll />

      {/* خلاصه وضعیت */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const count = projectSupplies.filter((s) => s.status === key).length;
          const Icon = cfg.icon;
          return (
            <div key={key} className="rounded-xl border border-slate-200 p-2.5">
              <div className="flex items-center gap-1.5">
                <Icon className="size-3.5 text-slate-400" />
                <span className="text-[9px] text-slate-500">{cfg.label}</span>
              </div>
              <div className="mt-1 text-base font-extrabold text-slate-800">{count.toLocaleString("fa-IR")}</div>
            </div>
          );
        })}
      </div>

      {/* عملیات گروهی */}
      {selectedItems.size > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <span className="text-xs font-bold text-emerald-700">{selectedItems.size.toLocaleString("fa-IR")} کالا انتخاب شده</span>
          <button onClick={() => { selectedItems.forEach((id) => useProjectStore.getState().requestTransferToProject(id)); setSelectedItems(new Set()); }} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700">
            <ArrowLeft className="size-3.5" /> درخواست انتقال به انبار پروژه
          </button>
          <button onClick={() => { selectedItems.forEach((id) => useProjectStore.getState().returnToMainStock(id)); setSelectedItems(new Set()); }} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
            <ArrowRightLeft className="size-3.5" /> برگشت به انبار اصلی
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-slate-200/70">
              <th className="px-3 py-2.5 text-center"><input type="checkbox" checked={selectedItems.size === projectSupplies.length && projectSupplies.length > 0} onChange={toggleAll} className="accent-emerald-600" /></th>
              <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-500">کالا</th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500">آسانسور</th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500">مورد نیاز</th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500">تأمین</th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500">تحویل</th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500">وضعیت</th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {projectSupplies.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">کالایی ثبت نشده است</td></tr>
            ) : (
              projectSupplies.map((s) => {
                const part = PART_MAP[s.partId];
                const elev = elevators.find((e) => e.id === s.elevatorId);
                const cfg = statusConfig[s.status];
                const Icon = cfg.icon;
                const id = s.elevatorId + s.partId;
                const isSelected = selectedItems.has(id);
                return (
                  <tr key={id} className={cn("border-b border-slate-100 last:border-0", isSelected && "bg-emerald-50/30")}>
                    <td className="px-3 py-3 text-center"><input type="checkbox" checked={isSelected} onChange={() => toggleItem(id)} className="accent-emerald-600" /></td>
                    <td className="px-3 py-3 font-medium text-slate-800">{part?.name ?? s.partId}</td>
                    <td className="px-3 py-3 text-center text-xs text-slate-500">{elev?.name ?? "—"}</td>
                    <td className="px-3 py-3 text-center font-bold text-slate-700">{s.qtyNeeded.toLocaleString("fa-IR")}</td>
                    <td className="px-3 py-3 text-center text-slate-600">{s.qtySupplied.toLocaleString("fa-IR")}</td>
                    <td className="px-3 py-3 text-center text-slate-600">{s.qtyDelivered.toLocaleString("fa-IR")}</td>
                    <td className="px-3 py-3 text-center"><StatusBadge tone={cfg.tone}><Icon className="me-1 inline size-3" />{cfg.label}</StatusBadge></td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {s.status === "main-stock" && (
                          <button onClick={() => useProjectStore.getState().requestTransferToProject(id)} title="درخواست انتقال" className="grid size-7 place-items-center rounded-md text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600">
                            <ArrowLeft className="size-3.5" />
                          </button>
                        )}
                        {s.status === "transfer-requested" && (
                          <button onClick={() => useProjectStore.getState().approveTransferToProject(id)} title="تأیید انتقال" className="grid size-7 place-items-center rounded-md text-amber-500 transition hover:bg-amber-50">
                            <CheckCircle2 className="size-3.5" />
                          </button>
                        )}
                        {s.status === "project-stock" && (
                          <button onClick={() => useProjectStore.getState().deliverToProject(id)} title="تحویل به پروژه" className="grid size-7 place-items-center rounded-md text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600">
                            <Truck className="size-3.5" />
                          </button>
                        )}
                        {(s.status === "project-stock" || s.status === "delivered") && (
                          <button onClick={() => useProjectStore.getState().returnToMainStock(id)} title="برگشت به انبار اصلی" className="grid size-7 place-items-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600">
                            <ArrowRightLeft className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ===== Tab: وظایف و دستورالعمل‌ها ===== */
function TasksTab({ projectId }: { projectId: string }) {
  const elevators = useProjectStore(useShallow((s) => s.elevators.filter((e) => e.projectId === projectId)));
  const allTasks = useProjectStore((s) => s.tasks);
  const addTask = useProjectStore((s) => s.addTask);
  const deleteTask = useProjectStore((s) => s.deleteTask);
  const updateTaskStatus = useProjectStore((s) => s.updateTaskStatus);
  const addTaskReport = useProjectStore((s) => s.addTaskReport);
  const taskTemplates = useProjectStore((s) => s.taskTemplates);
  const applyTemplate = useProjectStore((s) => s.applyTemplateToElevator);

  const [filterElev, setFilterElev] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", assignee: "", type: "task" as "task" | "instruction", dueDate: "", description: "", stageId: 0 });
  const [reportTask, setReportTask] = useState<string | null>(null);
  const [reportText, setReportText] = useState("");

  const projectTasks = allTasks.filter((t) => elevators.some((e) => e.id === t.elevatorId));
  const filtered = filterElev ? projectTasks.filter((t) => t.elevatorId === filterElev) : projectTasks;
  const statusTone = { done: "emerald", "in-progress": "amber", pending: "slate" } as const;

  function handleAdd() {
    if (!newTask.title.trim() || !filterElev) return;
    addTask({ elevatorId: filterElev, title: newTask.title, assignee: newTask.assignee || "—", type: newTask.type, status: "pending", dueDate: newTask.dueDate, description: newTask.description, stageId: newTask.stageId });
    setNewTask({ title: "", assignee: "", type: "task", dueDate: "", description: "", stageId: 0 });
    setShowAdd(false);
  }

  function handleReport() {
    if (!reportTask || !reportText.trim()) return;
    addTaskReport(reportTask, reportText);
    setReportTask(null);
    setReportText("");
  }

  return (
    <Panel className="p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ElevatorSelector projectId={projectId} value={filterElev} onChange={setFilterElev} allowAll />
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{filtered.length.toLocaleString("fa-IR")} مورد</span>
          {filterElev ? (
            <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700">
              <Plus className="size-3.5" /> وظیفه جدید
            </button>
          ) : null}
        </div>
      </div>

      {/* اعمال الگو بر اساس مرحله */}
      {filterElev ? (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 p-3">
          <ClipboardList className="size-4 text-violet-600" />
          <span className="text-xs font-semibold text-violet-700">اعمال الگوی وظایف بر اساس مرحله:</span>
          <select onChange={(e) => { if (e.target.value && filterElev) { applyTemplate(filterElev, Number(e.target.value)); e.target.value = ""; } }} className="appearance-none rounded-lg border border-violet-200 bg-white py-1 pr-2 pl-7 text-xs text-slate-700 outline-none">
            <option value="">انتخاب مرحله...</option>
            {SURVEY_STAGES.filter((s) => s.id > 0).map((s) => (
              <option key={s.id} value={s.id}>{s.icon} {s.label} ({taskTemplates.filter((t) => t.stageId === s.id).length.toLocaleString("fa-IR")} الگو)</option>
            ))}
          </select>
        </div>
      ) : null}

      {/* فرم افزودن */}
      {showAdd && filterElev ? (
        <div className="mb-4 space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/30 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input value={newTask.title} onChange={(e) => setNewTask((n) => ({ ...n, title: e.target.value }))} placeholder="عنوان وظیفه..." className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
            <input value={newTask.assignee} onChange={(e) => setNewTask((n) => ({ ...n, assignee: e.target.value }))} placeholder="مسئول..." className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select value={newTask.type} onChange={(e) => setNewTask((n) => ({ ...n, type: e.target.value as any }))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
              <option value="task">وظیفه</option>
              <option value="instruction">دستورالعمل</option>
            </select>
            <input value={newTask.dueDate} onChange={(e) => setNewTask((n) => ({ ...n, dueDate: e.target.value }))} placeholder="سررسید (۱۴۰۵/۰۴/۱۰)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
            <select value={newTask.stageId} onChange={(e) => setNewTask((n) => ({ ...n, stageId: Number(e.target.value) }))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
              <option value={0}>بدون مرحله</option>
              {SURVEY_STAGES.filter((s) => s.id > 0).map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
            </select>
          </div>
          <textarea value={newTask.description} onChange={(e) => setNewTask((n) => ({ ...n, description: e.target.value }))} placeholder="توضیحات..." className="h-16 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"><Plus className="size-3.5" /> افزودن</button>
            <button onClick={() => setShowAdd(false)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">انصراف</button>
          </div>
        </div>
      ) : null}

      {/* لیست وظایف */}
      {filtered.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-400">وظیفه‌ای ثبت نشده است</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => {
            const elev = elevators.find((e) => e.id === t.elevatorId);
            return (
              <div key={t.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", t.type === "instruction" ? "bg-violet-50 text-violet-600" : "bg-sky-50 text-sky-600")}>
                    {t.type === "instruction" ? <FileText className="size-4" /> : <ListChecks className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{t.title}</span>
                      <span className="text-[10px] text-slate-400">{elev?.name ?? "—"}</span>
                      {t.stageId ? <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">{SURVEY_STAGES.find((s) => s.id === t.stageId)?.label}</span> : null}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-400">
                      <span>مسئول: {t.assignee}</span>
                      {t.dueDate ? <><span>•</span><span>سررسید: {t.dueDate}</span></> : null}
                    </div>
                    {t.report ? <div className="mt-2 rounded-lg bg-emerald-50 p-2 text-[11px] text-emerald-700"><strong>گزارش:</strong> {t.report}</div> : null}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge tone={statusTone[t.status]}>
                      {t.status === "done" ? "انجام شد" : t.status === "in-progress" ? "در حال انجام" : "در انتظار"}
                    </StatusBadge>
                    {t.status !== "done" ? (
                      <button onClick={() => setReportTask(t.id)} title="ثبت گزارش/انجام" className="grid size-7 place-items-center rounded-md text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600">
                        <CheckCircle2 className="size-4" />
                      </button>
                    ) : null}
                    <button onClick={() => deleteTask(t.id)} title="حذف" className="grid size-7 place-items-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                {/* فرم گزارش */}
                {reportTask === t.id ? (
                  <div className="mt-3 flex flex-col gap-2 rounded-lg border border-emerald-200 bg-emerald-50/30 p-3 sm:flex-row">
                    <textarea value={reportText} onChange={(e) => setReportText(e.target.value)} placeholder="گزارش انجام کار..." className="h-16 flex-1 resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                    <div className="flex gap-2">
                      <button onClick={handleReport} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"><Save className="size-3.5" /> ثبت</button>
                      <button onClick={() => { setReportTask(null); setReportText(""); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">لغو</button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

/* ===== Tab: تعهدات فنی ===== */
function CommitmentsTab({ projectId }: { projectId: string }) {
  const commitments = useProjectStore(useShallow((s) => s.commitments.filter((c) => c.projectId === projectId)));
  const statusTone = { done: "emerald", "in-progress": "amber", pending: "slate" } as const;
  return (
    <Panel className="p-5 sm:p-6">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3 text-center"><div className="text-xs text-slate-500">تعهدات پیمانکار</div><div className="mt-1 text-xl font-extrabold text-slate-800">{commitments.filter((c) => c.party === "contractor").length.toLocaleString("fa-IR")}</div></div>
        <div className="rounded-xl bg-slate-50 p-3 text-center"><div className="text-xs text-slate-500">تعهدات کارفرما</div><div className="mt-1 text-xl font-extrabold text-slate-800">{commitments.filter((c) => c.party === "employer").length.toLocaleString("fa-IR")}</div></div>
      </div>
      {commitments.length === 0 ? <div className="py-8 text-center text-sm text-slate-400">تعهداتی ثبت نشده است</div> : (
        <div className="space-y-3">
          {commitments.map((c) => (
            <div key={c.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", c.party === "contractor" ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600")}>
                {c.party === "contractor" ? <Building2 className="size-4" /> : <User className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><span className="font-bold text-slate-800">{c.title}</span><span className="text-[10px] text-slate-400">{c.party === "contractor" ? "پیمانکار" : "کارفرما"}</span></div>
                <p className="mt-0.5 text-xs text-slate-500">{c.description}</p>
              </div>
              <StatusBadge tone={statusTone[c.status]}>{c.status === "done" ? "انجام شد" : c.status === "in-progress" ? "در حال انجام" : "در انتظار"}</StatusBadge>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ===== Tab: برداشت اطلاعات (استفاده از SurveyEditor) ===== */
function SurveyTab({ projectId }: { projectId: string }) {
  const elevators = useProjectStore(useShallow((s) => s.elevators.filter((e) => e.projectId === projectId)));
  const project = useProjectStore((s) => s.projects.find((p) => p.id === projectId));
  const [selectedId, setSelectedId] = useState(elevators[0]?.id ?? "");
  const elevator = elevators.find((e) => e.id === selectedId);
  if (elevators.length === 0) return <Panel className="p-8 text-center text-sm text-slate-400">آسانسوری ثبت نشده است</Panel>;
  return (
    <div>
      <div className="mb-4">
        <ElevatorSelector projectId={projectId} value={selectedId} onChange={setSelectedId} />
      </div>
      {elevator ? <SurveyEditor elevator={elevator} project={project} /> : null}
    </div>
  );
}

/* ===== Tab: محاسبات فنی ===== */
function CalcTab({ projectId }: { projectId: string }) {
  const elevators = useProjectStore(useShallow((s) => s.elevators.filter((e) => e.projectId === projectId)));
  const floors = useProjectStore((s) => s.projects.find((p) => p.id === projectId))?.floors ?? 8;
  const [selectedId, setSelectedId] = useState(elevators[0]?.id ?? "");
  const [elevType, setElevType] = useState("");
  const elevator = elevators.find((e) => e.id === selectedId);
  if (elevators.length === 0) return <Panel className="p-8 text-center text-sm text-slate-400">آسانسوری ثبت نشده است</Panel>;
  const survey = elevator?.survey;
  const travel = survey ? floors * survey.floorHeight : 0;
  const calcs = survey ? [
    { l: "ارتفاع کل سفر", v: `${travel.toLocaleString("fa-IR")} متر`, d: `${floors.toLocaleString("fa-IR")} طبقه × ${survey.floorHeight}م` },
    { l: "طول ریل کل", v: `${((travel + survey.pitDepth + survey.headroom) * 2).toLocaleString("fa-IR")} متر`, d: "۲ مسیر × (سفر + چاله + اورهد)" },
    { l: "طول سیم بکسل", v: `${(travel * 2).toLocaleString("fa-IR")} متر`, d: "۲ × ارتفاع سفر" },
    { l: "تعداد درب", v: floors.toLocaleString("fa-IR"), d: "به ازای هر طبقه" },
    { l: "قطعات محاسبه‌شده", v: `${elevator?.parts.length.toLocaleString("fa-IR") ?? "۰"} نوع`, d: "از فرمول‌های ثبت‌شده" },
  ] : [];
  return (
    <Panel className="p-5 sm:p-6">
      <ElevatorSelector projectId={projectId} value={selectedId} onChange={setSelectedId} />
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-bold text-slate-600">نوع آسانسور</label>
        <div className="relative inline-block w-full max-w-xs">
          <select value={elevType} onChange={(e) => setElevType(e.target.value)} className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pl-8 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100">
            <option value="">— انتخاب —</option>
            {ELEVATOR_TYPES.map((t) => (<option key={t.id} value={t.id}>{t.label}</option>))}
          </select>
          <ChevronDown className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>
      {!survey ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
          <Calculator className="mx-auto size-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">ابتدا برداشت اطلاعات این آسانسور را تکمیل کنید</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {calcs.map((c) => (
            <div key={c.l} className="rounded-xl border border-slate-200 p-4">
              <div className="text-[11px] text-slate-500">{c.l}</div>
              <div className="mt-1 text-base font-bold text-slate-900">{c.v}</div>
              <div className="mt-0.5 text-[11px] text-slate-400">{c.d}</div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ===== Tab: استاندارد ===== */
function StandardTab({ projectId }: { projectId: string }) {
  const elevators = useProjectStore(useShallow((s) => s.elevators.filter((e) => e.projectId === projectId)));
  const [selectedId, setSelectedId] = useState(elevators[0]?.id ?? "");
  const [calcType, setCalcType] = useState("");
  if (elevators.length === 0) return <Panel className="p-8 text-center text-sm text-slate-400">آسانسوری ثبت نشده است</Panel>;
  const calcTypeObj = STANDARD_CALC_TYPES.find((t) => t.id === calcType);
  return (
    <Panel className="p-5 sm:p-6">
      <ElevatorSelector projectId={projectId} value={selectedId} onChange={setSelectedId} />
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STANDARD_CALC_TYPES.map((t) => {
          const active = calcType === t.id;
          return (
            <button key={t.id} onClick={() => setCalcType(t.id)} className={cn("flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition", active ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50")}>
              <span className="text-2xl">{t.icon}</span>
              <span className={cn("text-xs font-bold", active ? "text-emerald-700" : "text-slate-700")}>{t.label}</span>
            </button>
          );
        })}
      </div>
      {calcTypeObj ? (
        <div className="rounded-xl bg-sky-50 p-3 text-xs text-sky-700">{calcTypeObj.description}</div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
          <FileText className="mx-auto size-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">یک نوع محاسبه استاندارد انتخاب کنید</p>
        </div>
      )}
    </Panel>
  );
}

/* ===== Tab: تاریخچه پروژه ===== */
function HistoryTab({ projectId }: { projectId: string }) {
  const project = useProjectStore((s) => s.projects.find((p) => p.id === projectId))!;
  const elevators = useProjectStore(useShallow((s) => s.elevators.filter((e) => e.projectId === projectId)));
  const [filterElev, setFilterElev] = useState("");
  const events = [...project.history].reverse();
  const filtered = filterElev ? events.filter((e) => e.detail?.includes(elevators.find((x) => x.id === filterElev)?.name ?? "___")) : events;
  function timeAgo(iso: string): string {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "همین حالا";
    if (m < 60) return `${m.toLocaleString("fa-IR")} دقیقه پیش`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h.toLocaleString("fa-IR")} ساعت پیش`;
    return `${Math.floor(h / 24).toLocaleString("fa-IR")} روز پیش`;
  }
  return (
    <Panel className="p-5 sm:p-6">
      <ElevatorSelector projectId={projectId} value={filterElev} onChange={setFilterElev} allowAll />
      {filtered.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-400">رویدادی برای این فیلتر یافت نشد</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((e) => (
            <div key={e.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><History className="size-4" /></span>
                <span className="mt-1 w-px flex-1 bg-slate-200" />
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-800">{e.action}</span>
                  <span className="shrink-0 text-[11px] text-slate-400">{timeAgo(e.at)}</span>
                </div>
                {e.detail ? <p className="mt-0.5 text-xs text-slate-500">{e.detail}</p> : null}
                <div className="mt-0.5 text-[10px] text-slate-400">توسط {e.actor}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
