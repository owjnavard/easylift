"use client";

import { useState } from "react";
import {
  Search,
  FolderOpen,
  ChevronDown,
  ChevronLeft,
  Building2,
  Calculator,
  ClipboardCheck,
  Plus,
  ListChecks,
  Trash2,
  Cog,
  ArrowLeft,
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
import { SURVEY_STAGES } from "@/lib/survey-stages";
import { cn } from "@/lib/utils";

export function TechnicalPage() {
  const [activeModule, setActiveModule] = useState<
    "projects" | "parts-calc" | "standard-calc" | "task-templates"
  >("projects");

  const MODULES = [
    { id: "projects" as const, label: "پروژه‌ها", icon: Building2, desc: "لیست پروژه‌ها" },
    { id: "parts-calc" as const, label: "محاسبات کالا", icon: Calculator, desc: "تعداد و نوع کالا" },
    { id: "standard-calc" as const, label: "محاسبات استاندارد", icon: ClipboardCheck, desc: "اورهد، پیت، ظرفیت" },
    { id: "task-templates" as const, label: "وظایف و الگوها", icon: ListChecks, desc: "الگوی وظایف آسانسور" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">فنی و مهندسی</h1>
        <p className="text-sm text-slate-500">مدیریت پروژه‌ها، محاسبات و استانداردهای فنی</p>
      </div>

      {/* Module selector cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map((m) => {
          const Icon = m.icon;
          const active = activeModule === m.id;
          return (
            <button key={m.id} onClick={() => setActiveModule(m.id)} className={cn("flex items-center gap-3 rounded-2xl border p-4 text-right transition", active ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-slate-200/70 bg-white hover:border-slate-300 hover:shadow-sm")}>
              <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl transition", active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500")}>
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className={cn("text-sm font-bold", active ? "text-emerald-700" : "text-slate-800")}>{m.label}</div>
                <div className="mt-0.5 truncate text-[11px] text-slate-500">{m.desc}</div>
              </div>
              {active ? <ChevronLeft className="size-4 shrink-0 text-emerald-500" /> : null}
            </button>
          );
        })}
      </div>

      {activeModule === "projects" && <ProjectsModule />}
      {activeModule === "parts-calc" && <PartsCalcModule />}
      {activeModule === "standard-calc" && <StandardCalcModule />}
      {activeModule === "task-templates" && <TaskTemplatesModule />}
    </div>
  );
}

/* ===== ماژول ۱: پروژه‌ها (فقط پروژه‌ها، بدون زیرسطر آسانسور) ===== */
function ProjectsModule() {
  const projects = useProjectStore((s) => s.projects);
  const elevators = useProjectStore((s) => s.elevators);
  const selectProject = useProjectStore((s) => s.selectProject);
  const setPage = useNav((s) => s.setPage);
  const [query, setQuery] = useState("");

  const filtered = projects.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.customer.toLowerCase().includes(q);
  });

  const totalElevators = filtered.reduce((sum, p) => sum + elevators.filter((e) => e.projectId === p.id).length, 0);

  function openProject(id: string) {
    selectProject(id);
    setPage("project");
  }

  return (
    <Panel className="overflow-hidden p-0">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">پروژه‌ها</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{filtered.length.toLocaleString("fa-IR")} پروژه • {totalElevators.toLocaleString("fa-IR")} آسانسور</span>
        </div>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجو در پروژه‌ها..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100" />
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">نتیجه‌ای یافت نشد</div>
        ) : (
          filtered.map((p) => {
            const projElevs = elevators.filter((e) => e.projectId === p.id);
            return (
              <button key={p.id} onClick={() => openProject(p.id)} className="flex w-full items-center gap-3 p-4 text-right transition hover:bg-slate-50/50">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FolderOpen className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold text-slate-900">{p.name}</div>
                  <div className="mt-0.5 truncate text-[11px] text-slate-500">{p.code} • {p.customer} • {p.floors.toLocaleString("fa-IR")} طبقه • {projElevs.length.toLocaleString("fa-IR")} آسانسور</div>
                </div>
                <StatusBadge tone={p.status === "active" ? "emerald" : "slate"}>{p.status === "active" ? "فعال" : "Draft"}</StatusBadge>
                <ArrowLeft className="size-4 shrink-0 text-slate-300" />
              </button>
            );
          })
        )}
      </div>
    </Panel>
  );
}

/* ===== ماژول ۲: محاسبات کالا ===== */
function PartsCalcModule() {
  const [elevatorType, setElevatorType] = useState("");
  const [items, setItems] = useState<PartCalcItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ partName: "", unit: "عدد", formula: "" });
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  function addField(field: string) {
    setSelectedFields((prev) => prev.includes(field) ? prev : [...prev, field]);
    setNewItem((n) => ({ ...n, formula: n.formula.includes(`{${field}}`) ? n.formula : n.formula + (n.formula ? " + " : "") + `{${field}}` }));
  }
  function addItem() {
    if (!newItem.partName.trim()) return;
    setItems((prev) => [...prev, { id: Math.random().toString(36).slice(2, 8), partName: newItem.partName.trim(), unit: newItem.unit, formula: newItem.formula || "—", surveyFields: [...selectedFields] }]);
    setNewItem({ partName: "", unit: "عدد", formula: "" });
    setSelectedFields([]);
    setShowAddForm(false);
    setSaved(false);
  }
  const elevType = ELEVATOR_TYPES.find((t) => t.id === elevatorType);

  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">۱</span>
          <h3 className="text-sm font-bold text-slate-900">انتخاب نوع آسانسور</h3>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">نوع آسانسور</label>
            <div className="relative">
              <select value={elevatorType} onChange={(e) => { setElevatorType(e.target.value); setSaved(false); }} className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 pl-8 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100">
                <option value="">— انتخاب نوع آسانسور —</option>
                {ELEVATOR_TYPES.map((t) => (<option key={t.id} value={t.id}>{t.label}</option>))}
              </select>
              <ChevronDown className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          {elevType ? (
            <div className="flex gap-3">
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-center"><div className="text-[10px] text-slate-400">ظرفیت</div><div className="text-sm font-bold text-slate-800">{elevType.capacity}</div></div>
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-center"><div className="text-[10px] text-slate-400">سرعت</div><div className="text-sm font-bold text-slate-800">{elevType.speed}</div></div>
            </div>
          ) : null}
        </div>
      </Panel>

      <Panel padded={false} className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">۲</span>
            <h3 className="text-sm font-bold text-slate-900">کالاها و فرمول محاسبه</h3>
            {items.length > 0 ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{items.length.toLocaleString("fa-IR")} کالا</span> : null}
          </div>
          {elevatorType && !showAddForm ? <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"><Plus className="size-3.5" /> افزودن کالا</button> : null}
        </div>
        {!elevatorType ? <div className="p-10 text-center text-sm text-slate-400">ابتدا نوع آسانسور را انتخاب کنید</div> : showAddForm ? (
          <div className="space-y-4 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">نام کالا</label><input value={newItem.partName} onChange={(e) => setNewItem((n) => ({ ...n, partName: e.target.value }))} placeholder="مثال: ریل T90" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100" /></div>
              <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">واحد</label><input value={newItem.unit} onChange={(e) => setNewItem((n) => ({ ...n, unit: e.target.value }))} placeholder="عدد، شاخه، متر..." className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100" /></div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">فرمول محاسبه (با کلیک روی فیلدها اضافه کنید)</label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {SURVEY_FIELD_OPTIONS.map((f) => (<button key={f.value} onClick={() => addField(f.value)} className={cn("rounded-md border px-2 py-1 text-[11px] font-medium transition", selectedFields.includes(f.value) ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")}>{f.label}<code className="ms-1 text-[9px] text-slate-400">{`{${f.value}}`}</code></button>))}
                </div>
                <input value={newItem.formula} onChange={(e) => setNewItem((n) => ({ ...n, formula: e.target.value }))} placeholder="مثال: {floors} * {elevatorCount}" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" dir="ltr" />
              </div>
            </div>
            <div className="flex gap-2"><button onClick={addItem} disabled={!newItem.partName.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"><Plus className="size-3.5" /> افزودن به لیست</button><button onClick={() => { setShowAddForm(false); setNewItem({ partName: "", unit: "عدد", formula: "" }); setSelectedFields([]); }} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">انصراف</button></div>
          </div>
        ) : items.length === 0 ? <div className="p-10 text-center text-sm text-slate-400">هنوز کالایی اضافه نشده است</div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-slate-50/80"><tr className="border-b border-slate-200/70"><th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">کالا</th><th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">واحد</th><th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">فرمول</th><th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">فیلدها</th><th className="px-4 py-2.5"></th></tr></thead>
              <tbody>
                {items.map((item) => (<tr key={item.id} className="border-b border-slate-100 last:border-0"><td className="px-4 py-3 font-medium text-slate-800">{item.partName}</td><td className="px-4 py-3 text-center text-xs text-slate-600">{item.unit}</td><td className="px-4 py-3"><code className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700" dir="ltr">{item.formula}</code></td><td className="px-4 py-3"><div className="flex flex-wrap gap-1">{item.surveyFields.map((f) => { const opt = SURVEY_FIELD_OPTIONS.find((o) => o.value === f); return <span key={f} className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-600">{opt?.label ?? f}</span>; })}</div></td><td className="px-4 py-3 text-left"><button onClick={() => { setItems((prev) => prev.filter((i) => i.id !== item.id)); setSaved(false); }} className="text-slate-400 transition hover:text-rose-500" aria-label="حذف"><Trash2 className="size-4" /></button></td></tr>))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ===== ماژول ۳: محاسبات استاندارد ===== */
function StandardCalcModule() {
  const [calcType, setCalcType] = useState("");
  const [conditions, setConditions] = useState<StandardCondition[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCond, setNewCond] = useState({ param: "", operator: ">=", value: "", result: "", unit: "" });
  const calcTypeObj = STANDARD_CALC_TYPES.find((t) => t.id === calcType);

  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">۱</span><h3 className="text-sm font-bold text-slate-900">انتخاب نوع محاسبه استاندارد</h3></div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STANDARD_CALC_TYPES.map((t) => { const active = calcType === t.id; return (
            <button key={t.id} onClick={() => setCalcType(t.id)} className={cn("flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition", active ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50")}>
              <span className="text-2xl">{t.icon}</span><span className={cn("text-xs font-bold", active ? "text-emerald-700" : "text-slate-700")}>{t.label}</span>
            </button>
          ); })}
        </div>
        {calcTypeObj ? <div className="mt-3 flex items-start gap-2 rounded-lg bg-sky-50 p-3 text-xs text-sky-700"><ClipboardCheck className="mt-0.5 size-4 shrink-0" /><span>{calcTypeObj.description}</span></div> : null}
      </Panel>

      {calcType && (
        <Panel padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">۲</span><h3 className="text-sm font-bold text-slate-900">شرایط و محاسبات — {calcTypeObj?.label}</h3>{conditions.length > 0 ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{conditions.length.toLocaleString("fa-IR")} شرط</span> : null}</div>
            {!showAddForm ? <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"><Plus className="size-3.5" /> افزودن شرط</button> : null}
          </div>
          {showAddForm ? (
            <div className="space-y-3 p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">پارامتر</label><input value={newCond.param} onChange={(e) => setNewCond((c) => ({ ...c, param: e.target.value }))} placeholder="مثال: سرعت آسانسور" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100" /></div>
                <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">عملگر</label><select value={newCond.operator} onChange={(e) => setNewCond((c) => ({ ...c, operator: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"><option value=">=">≥ بزرگتر مساوی</option><option value=">">&gt; بزرگتر</option><option value="<=">≤ کوچکتر مساوی</option><option value="<">&lt; کوچکتر</option><option value="=">= مساوی</option></select></div>
                <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">مقدار</label><input value={newCond.value} onChange={(e) => setNewCond((c) => ({ ...c, value: e.target.value }))} placeholder="مثال: 1.6" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100" dir="ltr" /></div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">نتیجه محاسبه</label><input value={newCond.result} onChange={(e) => setNewCond((c) => ({ ...c, result: e.target.value }))} placeholder="مثال: 3.8 متر" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100" /></div>
                <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">واحد نتیجه</label><input value={newCond.unit} onChange={(e) => setNewCond((c) => ({ ...c, unit: e.target.value }))} placeholder="مثال: متر" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100" /></div>
              </div>
              <div className="flex gap-2"><button onClick={() => { if (newCond.param.trim() && newCond.result.trim()) { setConditions((prev) => [...prev, { id: Math.random().toString(36).slice(2, 8), ...newCond }]); setNewCond({ param: "", operator: ">=", value: "", result: "", unit: "" }); setShowAddForm(false); } }} disabled={!newCond.param.trim() || !newCond.result.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"><Plus className="size-3.5" /> افزودن</button><button onClick={() => setShowAddForm(false)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">انصراف</button></div>
            </div>
          ) : conditions.length === 0 ? <div className="p-10 text-center text-sm text-slate-400">هنوز شرطی ثبت نشده است</div> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-slate-50/80"><tr className="border-b border-slate-200/70"><th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">پارامتر</th><th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">عملگر</th><th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">مقدار</th><th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">→</th><th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">نتیجه</th><th className="px-4 py-2.5"></th></tr></thead>
                <tbody>
                  {conditions.map((c) => (<tr key={c.id} className="border-b border-slate-100 last:border-0"><td className="px-4 py-3 font-medium text-slate-800">{c.param}</td><td className="px-4 py-3 text-center font-mono text-xs text-slate-600">{c.operator}</td><td className="px-4 py-3 text-center text-slate-700" dir="ltr">{c.value}</td><td className="px-4 py-3 text-center text-slate-400"><ArrowLeft className="mx-auto size-3.5" /></td><td className="px-4 py-3 font-semibold text-emerald-600">{c.result}{c.unit ? <span className="ms-1 text-[10px] font-normal text-slate-400">{c.unit}</span> : null}</td><td className="px-4 py-3 text-left"><button onClick={() => setConditions((prev) => prev.filter((x) => x.id !== c.id))} className="text-slate-400 transition hover:text-rose-500" aria-label="حذف"><Trash2 className="size-4" /></button></td></tr>))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}

/* ===== ماژول ۴: الگوی وظایف و دستورالعمل‌ها ===== */
function TaskTemplatesModule() {
  const taskTemplates = useProjectStore((s) => s.taskTemplates);
  const addTaskTemplate = useProjectStore((s) => s.addTaskTemplate);
  const deleteTaskTemplate = useProjectStore((s) => s.deleteTaskTemplate);
  const [showAdd, setShowAdd] = useState(false);
  const [newTpl, setNewTpl] = useState({ title: "", type: "task" as "task" | "instruction", stageId: 1, description: "", defaultAssignee: "" });

  function handleAdd() {
    if (!newTpl.title.trim()) return;
    addTaskTemplate(newTpl);
    setNewTpl({ title: "", type: "task", stageId: 1, description: "", defaultAssignee: "" });
    setShowAdd(false);
  }

  return (
    <Panel padded={false} className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">الگوی وظایف و دستورالعمل‌ها</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{taskTemplates.length.toLocaleString("fa-IR")} الگو</span>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"><Plus className="size-3.5" /> الگوی جدید</button>
      </div>

      {showAdd ? (
        <div className="space-y-3 border-b border-slate-100 bg-slate-50/30 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">عنوان</label><input value={newTpl.title} onChange={(e) => setNewTpl((n) => ({ ...n, title: e.target.value }))} placeholder="مثال: نصب ریل" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" /></div>
            <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">مسئول پیش‌فرض</label><input value={newTpl.defaultAssignee} onChange={(e) => setNewTpl((n) => ({ ...n, defaultAssignee: e.target.value }))} placeholder="مثال: پیمانکار" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" /></div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">نوع</label><select value={newTpl.type} onChange={(e) => setNewTpl((n) => ({ ...n, type: e.target.value as any }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"><option value="task">وظیفه</option><option value="instruction">دستورالعمل</option></select></div>
            <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">مرحله</label><select value={newTpl.stageId} onChange={(e) => setNewTpl((n) => ({ ...n, stageId: Number(e.target.value) }))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none">{SURVEY_STAGES.filter((s) => s.id > 0).map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}</select></div>
          </div>
          <div><label className="mb-1.5 block text-xs font-semibold text-slate-600">توضیحات</label><textarea value={newTpl.description} onChange={(e) => setNewTpl((n) => ({ ...n, description: e.target.value }))} placeholder="توضیحات الگو..." className="h-16 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" /></div>
          <div className="flex gap-2"><button onClick={handleAdd} disabled={!newTpl.title.trim()} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"><Plus className="size-3.5" /> افزودن الگو</button><button onClick={() => setShowAdd(false)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">انصراف</button></div>
        </div>
      ) : null}

      {/* گروه‌بندی بر اساس مرحله */}
      {SURVEY_STAGES.filter((s) => s.id > 0).map((stage) => {
        const stageTpls = taskTemplates.filter((t) => t.stageId === stage.id);
        if (stageTpls.length === 0) return null;
        return (
          <div key={stage.id} className="border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-2 bg-slate-50/50 px-5 py-2.5">
              <span className="text-base">{stage.icon}</span>
              <span className="text-xs font-bold text-slate-700">{stage.label}</span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-500">{stageTpls.length.toLocaleString("fa-IR")}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {stageTpls.map((tpl) => (
                <div key={tpl.id} className="flex items-start gap-3 p-4">
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", tpl.type === "instruction" ? "bg-violet-50 text-violet-600" : "bg-sky-50 text-sky-600")}>
                    {tpl.type === "instruction" ? <ClipboardCheck className="size-4" /> : <ListChecks className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-800">{tpl.title}</div>
                    <p className="mt-0.5 text-xs text-slate-500">{tpl.description}</p>
                    <div className="mt-1 text-[10px] text-slate-400">مسئول پیش‌فرض: {tpl.defaultAssignee}</div>
                  </div>
                  <button onClick={() => deleteTaskTemplate(tpl.id)} className="grid size-7 place-items-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 className="size-4" /></button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {taskTemplates.length === 0 && !showAdd ? <div className="p-10 text-center text-sm text-slate-400">هنوز الگویی ثبت نشده است</div> : null}
    </Panel>
  );
}

void Cog;
