"use client";

import { useState } from "react";
import {
  Search,
  FolderOpen,
  Cog,
  ChevronDown,
  ChevronLeft,
  Layers,
  Calculator,
  ClipboardCheck,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { Panel, StatusBadge } from "@/components/easy-lift";
import { useProjectStore } from "@/lib/project-store";
import { useNav } from "@/lib/nav-store";
import {
  ELEVATOR_TYPES,
  SURVEY_FIELD_OPTIONS,
  STANDARD_CALC_TYPES,
  type PartCalcItem,
  type StandardCondition,
} from "@/lib/technical-modules";
import { cn } from "@/lib/utils";

export function TechnicalPage() {
  const [activeModule, setActiveModule] = useState<
    "projects" | "parts-calc" | "standard-calc"
  >("projects");

  const MODULES = [
    {
      id: "projects" as const,
      label: "پروژه‌ها",
      icon: Building2,
      desc: "لیست پروژه‌ها و آسانسورها",
    },
    {
      id: "parts-calc" as const,
      label: "محاسبات کالا",
      icon: Calculator,
      desc: "تعداد و نوع کالا",
    },
    {
      id: "standard-calc" as const,
      label: "محاسبات استاندارد",
      icon: ClipboardCheck,
      desc: "اورهد، پیت، ظرفیت، ریل",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          فنی و مهندسی
        </h1>
        <p className="text-sm text-slate-500">
          مدیریت پروژه‌ها، محاسبات کالا و استانداردهای فنی
        </p>
      </div>

      {/* Module selector cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {MODULES.map((m) => {
          const Icon = m.icon;
          const active = activeModule === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-4 text-right transition",
                active
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-slate-200/70 bg-white hover:border-slate-300 hover:shadow-sm"
              )}
            >
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-xl transition",
                  active
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "text-sm font-bold",
                    active ? "text-emerald-700" : "text-slate-800"
                  )}
                >
                  {m.label}
                </div>
                <div className="mt-0.5 truncate text-[11px] text-slate-500">
                  {m.desc}
                </div>
              </div>
              {active ? (
                <ChevronLeft className="size-4 shrink-0 text-emerald-500" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Active module content */}
      {activeModule === "projects" && <ProjectsModule />}
      {activeModule === "parts-calc" && <PartsCalcModule />}
      {activeModule === "standard-calc" && <StandardCalcModule />}
    </div>
  );
}

/* ============================================================
   ماژول ۱: پروژه‌ها — لیست با جستجو + زیرسطر آسانسورهای جمع‌شونده
   ============================================================ */

function ProjectsModule() {
  const projects = useProjectStore((s) => s.projects);
  const elevators = useProjectStore((s) => s.elevators);
  const selectProject = useProjectStore((s) => s.selectProject);
  const selectElevator = useProjectStore((s) => s.selectElevator);
  const setPage = useNav((s) => s.setPage);

  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    // اولین پروژه باز باشد
    return new Set(projects.length > 0 ? [projects[0].id] : []);
  });

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // فیلتر پروژه‌ها و آسانسورها بر اساس جستجو
  const filteredProjects = projects.filter((p) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    // جستجو در نام/کد/مشتری پروژه
    if (
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.customer.toLowerCase().includes(q)
    ) {
      return true;
    }
    // جستجو در آسانسورهای پروژه
    const projElevs = elevators.filter((e) => e.projectId === p.id);
    return projElevs.some(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q)
    );
  });

  function openProject(id: string) {
    selectProject(id);
    setPage("project");
  }
  function openElevator(id: string) {
    selectElevator(id);
    setPage("elevator");
  }

  const totalElevators = filteredProjects.reduce(
    (sum, p) => sum + elevators.filter((e) => e.projectId === p.id).length,
    0
  );

  return (
    <Panel className="overflow-hidden p-0">
      {/* header + search */}
      <div className="border-b border-slate-100 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">پروژه‌ها</h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              {filteredProjects.length.toLocaleString("fa-IR")} پروژه •{" "}
              {totalElevators.toLocaleString("fa-IR")} آسانسور
            </span>
          </div>
        </div>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در پروژه‌ها و آسانسورها..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* tree list */}
      <div className="divide-y divide-slate-100">
        {filteredProjects.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            نتیجه‌ای یافت نشد
          </div>
        ) : (
          filteredProjects.map((p) => {
            const projElevs = elevators.filter((e) => e.projectId === p.id);
            const isOpen = expanded.has(p.id);
            // اگر جستجو انجام شده و آسانسوری منطبق است، باز نگه‌دار
            const forceOpen =
              query.trim() &&
              projElevs.some(
                (e) =>
                  e.name.toLowerCase().includes(query.toLowerCase()) ||
                  e.code.toLowerCase().includes(query.toLowerCase())
              );
            const show = isOpen || forceOpen;

            return (
              <div key={p.id}>
                {/* project row */}
                <div className="flex items-center gap-2 p-3 hover:bg-slate-50/50">
                  <button
                    onClick={() => toggleExpand(p.id)}
                    className="grid size-7 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100"
                    aria-label={show ? "جمع کردن" : "باز کردن"}
                  >
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        show && "rotate-180"
                      )}
                    />
                  </button>
                  <button
                    onClick={() => openProject(p.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-right"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                      <FolderOpen className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-bold text-slate-900">
                        {highlight(p.name, query)}
                      </div>
                      <div className="mt-0.5 truncate text-[11px] text-slate-500">
                        {highlight(p.code, query)} • {p.customer} •{" "}
                        {p.floors.toLocaleString("fa-IR")} طبقه •{" "}
                        {projElevs.length.toLocaleString("fa-IR")} آسانسور
                      </div>
                    </div>
                  </button>
                  <StatusBadge
                    tone={p.status === "active" ? "emerald" : "slate"}
                  >
                    {p.status === "active" ? "فعال" : "Draft"}
                  </StatusBadge>
                </div>

                {/* elevators sub-rows */}
                {show && (
                  <div className="bg-slate-50/40">
                    {projElevs.map((e) => {
                      const done = !!e.survey?.completedAt;
                      return (
                        <button
                          key={e.id}
                          onClick={() => openElevator(e.id)}
                          className="flex w-full items-center gap-3 pr-12 py-2.5 text-right transition hover:bg-slate-100/60"
                        >
                          <span
                            className={cn(
                              "grid size-8 shrink-0 place-items-center rounded-lg",
                              done
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-slate-200 text-slate-400"
                            )}
                          >
                            <Cog className="size-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-slate-800">
                              {highlight(e.name, query)}
                            </div>
                            <div className="truncate text-[11px] text-slate-500">
                              {done
                                ? `برداشت تکمیل • ${e.parts.length.toLocaleString("fa-IR")} قطعه`
                                : "در انتظار برداشت"}
                            </div>
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-slate-600">
                            {e.progress.toLocaleString("fa-IR")}٪
                          </span>
                          <ArrowLeft className="size-3.5 shrink-0 text-slate-300" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}

// هایلایت کلمه جستجو
function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const q = query.trim();
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-amber-200/70 px-0.5 text-slate-900">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

/* ============================================================
   ماژول ۲: محاسبات تعداد و نوع کالا
   ============================================================ */

function PartsCalcModule() {
  const [elevatorType, setElevatorType] = useState("");
  const [items, setItems] = useState<PartCalcItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    partName: "",
    unit: "عدد",
    formula: "",
  });
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  function addField(field: string) {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev : [...prev, field]
    );
    setNewItem((n) => ({
      ...n,
      formula: n.formula.includes(`{${field}}`)
        ? n.formula
        : n.formula + (n.formula ? " + " : "") + `{${field}}`,
    }));
  }

  function addItem() {
    if (!newItem.partName.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2, 8),
        partName: newItem.partName.trim(),
        unit: newItem.unit,
        formula: newItem.formula || "—",
        surveyFields: [...selectedFields],
      },
    ]);
    setNewItem({ partName: "", unit: "عدد", formula: "" });
    setSelectedFields([]);
    setShowAddForm(false);
    setSaved(false);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSaved(false);
  }

  function save() {
    setSaved(true);
  }

  const elevType = ELEVATOR_TYPES.find((t) => t.id === elevatorType);

  return (
    <div className="space-y-4">
      {/* step 1: elevator type */}
      <Panel className="p-5">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
            ۱
          </span>
          <h3 className="text-sm font-bold text-slate-900">
            انتخاب نوع آسانسور
          </h3>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              نوع آسانسور
            </label>
            <div className="relative">
              <select
                value={elevatorType}
                onChange={(e) => {
                  setElevatorType(e.target.value);
                  setSaved(false);
                }}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 pl-8 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">— انتخاب نوع آسانسور —</option>
                {ELEVATOR_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          {elevType ? (
            <div className="flex gap-3">
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                <div className="text-[10px] text-slate-400">ظرفیت</div>
                <div className="text-sm font-bold text-slate-800">
                  {elevType.capacity}
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                <div className="text-[10px] text-slate-400">سرعت</div>
                <div className="text-sm font-bold text-slate-800">
                  {elevType.speed}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Panel>

      {/* step 2: parts list */}
      <Panel padded={false} className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
              ۲
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              کالاها و فرمول محاسبه
            </h3>
            {items.length > 0 ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                {items.length.toLocaleString("fa-IR")} کالا
              </span>
            ) : null}
          </div>
          {elevatorType && !showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus className="size-3.5" />
              افزودن کالا
            </button>
          ) : null}
        </div>

        {!elevatorType ? (
          <div className="p-10 text-center text-sm text-slate-400">
            ابتدا نوع آسانسور را انتخاب کنید
          </div>
        ) : showAddForm ? (
          <div className="space-y-4 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  نام کالا
                </label>
                <input
                  value={newItem.partName}
                  onChange={(e) =>
                    setNewItem((n) => ({ ...n, partName: e.target.value }))
                  }
                  placeholder="مثال: ریل T90"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  واحد
                </label>
                <input
                  value={newItem.unit}
                  onChange={(e) =>
                    setNewItem((n) => ({ ...n, unit: e.target.value }))
                  }
                  placeholder="عدد، شاخه، متر..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* formula builder */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                فرمول محاسبه (با کلیک روی فیلدها اضافه کنید)
              </label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {SURVEY_FIELD_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => addField(f.value)}
                      className={cn(
                        "rounded-md border px-2 py-1 text-[11px] font-medium transition",
                        selectedFields.includes(f.value)
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {f.label}
                      <code className="ms-1 text-[9px] text-slate-400">
                        {`{${f.value}}`}
                      </code>
                    </button>
                  ))}
                </div>
                <input
                  value={newItem.formula}
                  onChange={(e) =>
                    setNewItem((n) => ({ ...n, formula: e.target.value }))
                  }
                  placeholder="مثال: {floors} * {elevatorCount}"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={addItem}
                disabled={!newItem.partName.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"
              >
                <Plus className="size-3.5" />
                افزودن به لیست
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewItem({ partName: "", unit: "عدد", formula: "" });
                  setSelectedFields([]);
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                انصراف
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            هنوز کالایی اضافه نشده است — روی «افزودن کالا» کلیک کنید
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-200/70">
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">
                    کالا
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">
                    واحد
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">
                    فرمول محاسبه
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">
                    فیلدها
                  </th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {item.partName}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-slate-600">
                      {item.unit}
                    </td>
                    <td className="px-4 py-3">
                      <code
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
                        dir="ltr"
                      >
                        {item.formula}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {item.surveyFields.map((f) => {
                          const opt = SURVEY_FIELD_OPTIONS.find(
                            (o) => o.value === f
                          );
                          return (
                            <span
                              key={f}
                              className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-600"
                            >
                              {opt?.label ?? f}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-left">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 transition hover:text-rose-500"
                        aria-label="حذف"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-slate-100 p-4">
              <button
                onClick={save}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                <Save className="size-3.5" />
                ذخیره محاسبات
              </button>
              {saved ? (
                <span className="ms-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="size-3.5" />
                  ذخیره شد
                </span>
              ) : null}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ============================================================
   ماژول ۳: محاسبات استاندارد
   ============================================================ */

function StandardCalcModule() {
  const [calcType, setCalcType] = useState("");
  const [conditions, setConditions] = useState<StandardCondition[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCond, setNewCond] = useState({
    param: "",
    operator: ">=",
    value: "",
    result: "",
    unit: "",
  });
  const [saved, setSaved] = useState(false);

  const calcTypeObj = STANDARD_CALC_TYPES.find((t) => t.id === calcType);

  function addCondition() {
    if (!newCond.param.trim() || !newCond.result.trim()) return;
    setConditions((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2, 8),
        ...newCond,
      },
    ]);
    setNewCond({
      param: "",
      operator: ">=",
      value: "",
      result: "",
      unit: "",
    });
    setShowAddForm(false);
    setSaved(false);
  }

  function removeCondition(id: string) {
    setConditions((prev) => prev.filter((c) => c.id !== id));
    setSaved(false);
  }

  function save() {
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      {/* step 1: calc type */}
      <Panel className="p-5">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
            ۱
          </span>
          <h3 className="text-sm font-bold text-slate-900">
            انتخاب نوع محاسبه استاندارد
          </h3>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STANDARD_CALC_TYPES.map((t) => {
            const active = calcType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setCalcType(t.id);
                  setSaved(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition",
                  active
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <span className="text-2xl">{t.icon}</span>
                <span
                  className={cn(
                    "text-xs font-bold",
                    active ? "text-emerald-700" : "text-slate-700"
                  )}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
        {calcTypeObj ? (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-sky-50 p-3 text-xs text-sky-700">
            <ClipboardCheck className="mt-0.5 size-4 shrink-0" />
            <span>{calcTypeObj.description}</span>
          </div>
        ) : null}
      </Panel>

      {/* step 2: conditions */}
      {calcType && (
        <Panel padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
                ۲
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                شرایط و محاسبات — {calcTypeObj?.label}
              </h3>
              {conditions.length > 0 ? (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  {conditions.length.toLocaleString("fa-IR")} شرط
                </span>
              ) : null}
            </div>
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                <Plus className="size-3.5" />
                افزودن شرط
              </button>
            ) : null}
          </div>

          {showAddForm ? (
            <div className="space-y-3 p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    پارامتر
                  </label>
                  <input
                    value={newCond.param}
                    onChange={(e) =>
                      setNewCond((c) => ({ ...c, param: e.target.value }))
                    }
                    placeholder="مثال: سرعت آسانسور"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    عملگر
                  </label>
                  <select
                    value={newCond.operator}
                    onChange={(e) =>
                      setNewCond((c) => ({ ...c, operator: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value=">=">≥ بزرگتر مساوی</option>
                    <option value=">">&gt; بزرگتر</option>
                    <option value="<=">≤ کوچکتر مساوی</option>
                    <option value="<">&lt; کوچکتر</option>
                    <option value="=">= مساوی</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    مقدار
                  </label>
                  <input
                    value={newCond.value}
                    onChange={(e) =>
                      setNewCond((c) => ({ ...c, value: e.target.value }))
                    }
                    placeholder="مثال: 1.6"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    نتیجه محاسبه
                  </label>
                  <input
                    value={newCond.result}
                    onChange={(e) =>
                      setNewCond((c) => ({ ...c, result: e.target.value }))
                    }
                    placeholder="مثال: 3.8 متر"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    واحد نتیجه
                  </label>
                  <input
                    value={newCond.unit}
                    onChange={(e) =>
                      setNewCond((c) => ({ ...c, unit: e.target.value }))
                    }
                    placeholder="مثال: متر"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addCondition}
                  disabled={!newCond.param.trim() || !newCond.result.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"
                >
                  <Plus className="size-3.5" />
                  افزودن شرط
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCond({
                      param: "",
                      operator: ">=",
                      value: "",
                      result: "",
                      unit: "",
                    });
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  انصراف
                </button>
              </div>
            </div>
          ) : conditions.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">
              هنوز شرطی ثبت نشده است — روی «افزودن شرط» کلیک کنید
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-slate-50/80">
                  <tr className="border-b border-slate-200/70">
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">
                      پارامتر
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">
                      عملگر
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">
                      مقدار
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">
                      →
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">
                      نتیجه
                    </th>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {conditions.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {c.param}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-xs text-slate-600">
                        {c.operator}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-700" dir="ltr">
                        {c.value}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-400">
                        <ArrowLeft className="mx-auto size-3.5" />
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">
                        {c.result}
                        {c.unit ? (
                          <span className="ms-1 text-[10px] font-normal text-slate-400">
                            {c.unit}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-left">
                        <button
                          onClick={() => removeCondition(c.id)}
                          className="text-slate-400 transition hover:text-rose-500"
                          aria-label="حذف"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-slate-100 p-4">
                <button
                  onClick={save}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Save className="size-3.5" />
                  ذخیره محاسبات استاندارد
                </button>
                {saved ? (
                  <span className="ms-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle2 className="size-3.5" />
                    ذخیره شد
                  </span>
                ) : null}
              </div>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}

void Layers;
