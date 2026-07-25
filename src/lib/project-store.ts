import { create } from "zustand";
import {
  computeParts,
  type SurveyData,
  type PartRequirement,
} from "./parts-engine";

export interface ElevatorSurvey extends SurveyData {
  note?: string;
  completedAt?: string;
}

export type ElevatorStatus =
  | "design"
  | "surveying"
  | "calculated"
  | "executing"
  | "delivered";

export interface Elevator {
  id: string;
  code: string; // A1, A2...
  name: string;
  projectId: string;
  status: ElevatorStatus;
  progress: number;
  survey?: ElevatorSurvey;
  parts: PartRequirement[];
}

// وضعیت تأمین کالا برای انبار پروژه
export type SupplyStatus =
  | "main-stock" // موجود در انبار اصلی
  | "transfer-requested" // درخواست انتقال به انبار پروژه (در انتظار تأیید مدیر)
  | "project-stock" // منتقل به انبار پروژه
  | "delivered" // تحویل پروژه شده
  | "purchase-request" // درخواست خرید داده شده
  | "return-requested"; // درخواست برگشت به انبار اصلی

export interface PartSupply {
  elevatorId: string;
  partId: string;
  qtyNeeded: number;
  qtySupplied: number;
  qtyDelivered: number;
  status: SupplyStatus;
}

// وظیفه
export interface Task {
  id: string;
  elevatorId: string; // آسانسور مربوطه
  title: string;
  assignee: string;
  type: "instruction" | "task"; // دستورالعمل یا وظیفه
  status: "pending" | "in-progress" | "done";
  dueDate: string;
  description: string;
  stageId?: number; // مرحله برداشت که وظیفه به آن مربوط است
  report?: string; // گزارش انجام
}

// الگوی وظیفه — برای ساخت خودکار وظایف بر اساس مرحله
export interface TaskTemplate {
  id: string;
  title: string;
  type: "instruction" | "task";
  stageId: number; // مرحله‌ای که این الگو به آن مربوط است
  description: string;
  defaultAssignee: string;
}

// تعهدات قرارداد
export interface Commitment {
  id: string;
  projectId: string;
  party: "contractor" | "employer"; // پیمانکار یا کارفرما
  title: string;
  description: string;
  status: "pending" | "in-progress" | "done";
}

export type ProjectStatus = "draft" | "active";

export interface ProjectHistoryEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail?: string;
}

export interface Project {
  id: string;
  code: string; // P-۱۴۰۵۰۱
  name: string;
  customer: string;
  address: string;
  buildingType: string;
  floors: number;
  unitsPerFloor: number;
  elevatorCount: number;
  status: ProjectStatus;
  quotationId?: string;
  createdAt: string;
  history: ProjectHistoryEntry[];
}

const now = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);

function makeElevators(projectId: string, count: number): Elevator[] {
  const letters = "ABCDEFGH";
  return Array.from({ length: count }, (_, i) => {
    const code = `${letters[i]}${i + 1}`;
    return {
      id: uid(),
      code,
      name: `آسانسور ${code}`,
      projectId,
      status: "design" as ElevatorStatus,
      progress: 0,
      parts: [],
    };
  });
}

function seed(): { projects: Project[]; elevators: Elevator[] } {
  const projects: Project[] = [];
  const elevators: Elevator[] = [];

  const mk = (
    id: string,
    code: string,
    name: string,
    customer: string,
    floors: number,
    elevCount: number,
    status: ProjectStatus,
    quotationId: string
  ): Project => ({
    id,
    code,
    name,
    customer,
    address: "تهران، شهرک غرب",
    buildingType: "مسکونی",
    floors,
    unitsPerFloor: 4,
    elevatorCount: elevCount,
    status,
    quotationId,
    createdAt: now(),
    history: [
      { id: uid(), at: now(), actor: "احمدی", action: "ایجاد پروژه موقت از پیش‌فاکتور", detail: `کد پیش‌فاکتور: ${quotationId.toUpperCase()}` },
    ],
  });

  // پارسیان — draft، تمام آسانسورها برداشت شده (برای PF-14025 مرحله ۲)
  const p1 = mk("p-parsian", "P-۱۴۰۵۰۱", "پروژه پارسیان", "شرکت پارسیان", 12, 4, "draft", "q-14025");
  p1.history.push({ id: uid(), at: now(), actor: "مدیر فنی", action: "تکمیل برداشت اطلاعات ۴ آسانسور" });
  projects.push(p1);
  const p1Elev = makeElevators(p1.id, 4);
  p1Elev.forEach((e) => {
    e.survey = {
      pitWidth: 170,
      pitDepth: 1.6,
      floorHeight: 3.2,
      headroom: 3.8,
      note: "چاه استاندارد مسکونی",
      completedAt: now(),
    };
    e.parts = computeParts(
      { floors: p1.floors, unitsPerFloor: p1.unitsPerFloor, elevatorCount: 1 },
      e.survey
    );
    e.status = "calculated";
    e.progress = 25;
  });
  elevators.push(...p1Elev);

  // الماس — draft، برداشت نشده (برای PF-14024 مرحله ۱)
  const p2 = mk("p-almas", "P-۱۴۰۵۰۲", "پروژه الماس", "برج الماس", 8, 2, "draft", "q-14024");
  projects.push(p2);
  elevators.push(...makeElevators(p2.id, 2));

  // سپهر — active (برای PF-14023 مرحله ۴)
  const p3 = mk("p-sepehr", "P-۱۴۰۵۰۳", "پروژه سپهر", "سپهر گروپ", 6, 1, "active", "q-14023");
  p3.history.push({ id: uid(), at: now(), actor: "مدیر فنی", action: "تکمیل برداشت اطلاعات آسانسور" });
  p3.history.push({ id: uid(), at: now(), actor: "سیستم", action: "تبدیل به پروژه اجرایی فعال", detail: "وضعیت از Draft به Active تغییر یافت" });
  projects.push(p3);
  const p3Elev = makeElevators(p3.id, 1);
  p3Elev.forEach((e) => {
    e.survey = {
      pitWidth: 160,
      pitDepth: 1.5,
      floorHeight: 3.0,
      headroom: 3.5,
      completedAt: now(),
    };
    e.parts = computeParts(
      { floors: p3.floors, unitsPerFloor: p3.unitsPerFloor, elevatorCount: 1 },
      e.survey
    );
    e.status = "executing";
    e.progress = 95;
  });
  elevators.push(...p3Elev);

  // وظایف نمونه
  const tasks: Task[] = [
    { id: "t1", elevatorId: p1Elev[0].id, title: "نصب ریل T90", assignee: "حسین کریمی", type: "task", status: "done", dueDate: "۱۴۰۵/۰۴/۱۰", description: "نصب ۱۲ شاخه ریل T90 در مسیر چپ و راست" },
    { id: "t2", elevatorId: p1Elev[0].id, title: "دستورالعمل ایمنی چاله", assignee: "مدیر فنی", type: "instruction", status: "done", dueDate: "۱۴۰۵/۰۴/۰۵", description: "رعایت اصول ایمنی هنگام کار در چاله" },
    { id: "t3", elevatorId: p1Elev[1].id, title: "نصب کابین", assignee: "علی رضایی", type: "task", status: "in-progress", dueDate: "۱۴۰۵/۰۵/۰۱", description: "نصب کابین آسانسور A2" },
    { id: "t4", elevatorId: p1Elev[1].id, title: "بررسی استاندارد", assignee: "مدیر فنی", type: "instruction", status: "pending", dueDate: "۱۴۰۵/۰۵/۱۰", description: "کنترل تطابق با استانداردهای ایمنی" },
    { id: "t5", elevatorId: p3Elev[0].id, title: "راه‌اندازی نهایی", assignee: "حسین کریمی", type: "task", status: "done", dueDate: "۱۴۰۵/۰۳/۲۰", description: "راه‌اندازی و تست نهایی آسانسور" },
  ];

  // تعهدات قرارداد نمونه برای پارسیان
  const commitments: Commitment[] = [
    { id: "c1", projectId: p1.id, party: "contractor", title: "تأمین موتور گیرلس", description: "تأمین ۴ عدد موتور گیرلس برند آرکل", status: "done" },
    { id: "c2", projectId: p1.id, party: "contractor", title: "نصب و راه‌اندازی", description: "نصب کامل ۴ آسانسور ظرف ۶ ماه", status: "in-progress" },
    { id: "c3", projectId: p1.id, party: "employer", title: "پرداخت پیش‌پرداخت", description: "پرداخت ۳۰٪ مبلغ قرارداد پیش از شروع", status: "done" },
    { id: "c4", projectId: p1.id, party: "employer", title: "تأمین دسترسی محل", description: "فراهم کردن دسترسی به چاه و موتورخانه", status: "done" },
  ];

  // وضعیت تأمین کالا برای آسانسورهای پارسیان
  const supplies: PartSupply[] = [];
  const partIds = ["motor", "rail", "cable", "door", "cabin", "panel", "shoe", "button"];
  const statuses: SupplyStatus[] = ["main-stock", "project-stock", "delivered", "purchase-request"];
  for (const elev of p1Elev) {
    partIds.forEach((pid, i) => {
      supplies.push({
        elevatorId: elev.id,
        partId: pid,
        qtyNeeded: [1, 12, 48, 12, 1, 1, 48, 13][i],
        qtySupplied: Math.floor([1, 12, 48, 12, 1, 1, 48, 13][i] * 0.7),
        qtyDelivered: Math.floor([1, 12, 48, 12, 1, 1, 48, 13][i] * 0.3),
        status: statuses[i % 4],
      });
    });
  }

  // الگوهای وظایف نمونه
  const taskTemplates: TaskTemplate[] = [
    { id: "tpl1", title: "بررسی ابعاد چاه", type: "task", stageId: 1, description: "بررسی و ثبت ابعاد چاه قبل از شروع", defaultAssignee: "مدیر فنی" },
    { id: "tpl2", title: "دستورالعمل ایمنی چاله", type: "instruction", stageId: 1, description: "رعایت اصول ایمنی هنگام کار در چاله", defaultAssignee: "مدیر فنی" },
    { id: "tpl3", title: "نصب تیرآهن‌ها", type: "task", stageId: 2, description: "نصب تیرآهن‌های آهنکشی موتورخانه", defaultAssignee: "پیمانکار" },
    { id: "tpl4", title: "نصب ریل‌ها", type: "task", stageId: 3, description: "نصب ریل‌های T90 در مسیر چپ و راست", defaultAssignee: "پیمانکار" },
    { id: "tpl5", title: "دستورالعمل تراز ریل", type: "instruction", stageId: 3, description: "کنترل تراز ریل‌ها با تراز لیزری", defaultAssignee: "مدیر فنی" },
    { id: "tpl6", title: "نصب درب‌های طبقات", type: "task", stageId: 4, description: "نصب درب‌های اتوماتیک در تمام طبقات", defaultAssignee: "پیمانکار" },
    { id: "tpl7", title: "نصب کابین", type: "task", stageId: 5, description: "نصب کابین و اتصال به ریل", defaultAssignee: "پیمانکار" },
    { id: "tpl8", title: "نصب موتور و تابلو", type: "task", stageId: 6, description: "نصب موتور گیرلس و تابلو فرمان", defaultAssignee: "پیمانکار" },
    { id: "tpl9", title: "تست راه‌اندازی", type: "task", stageId: 7, description: "تست کامل راه‌اندازی و کنترل ایمنی", defaultAssignee: "مدیر فنی" },
    { id: "tpl10", title: "دستورالعمل تحویل موقت", type: "instruction", stageId: 7, description: "آماده‌سازی مدارک تحویل موقت", defaultAssignee: "مدیر فنی" },
  ];

  return { projects, elevators, tasks, commitments, supplies, taskTemplates };
}

interface ProjectState {
  projects: Project[];
  elevators: Elevator[];
  tasks: Task[];
  taskTemplates: TaskTemplate[];
  commitments: Commitment[];
  supplies: PartSupply[];
  selectedProjectId: string | null;
  selectedElevatorId: string | null;
  selectProject: (id: string | null) => void;
  selectElevator: (id: string | null) => void;
  // تأمین کالا
  requestTransferToProject: (supplyId: string) => void;
  approveTransferToProject: (supplyId: string) => void;
  deliverToProject: (supplyId: string) => void;
  returnToMainStock: (supplyId: string) => void;
  requestPurchase: (supplyId: string) => void;
  // وظایف
  addTask: (task: Omit<Task, "id">) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, status: Task["status"]) => void;
  addTaskReport: (taskId: string, report: string) => void;
  // الگوی وظایف
  addTaskTemplate: (tpl: Omit<TaskTemplate, "id">) => void;
  deleteTaskTemplate: (tplId: string) => void;
  applyTemplateToElevator: (elevatorId: string, stageId: number) => void;
  createDraftProject: (input: {
    customer: string;
    projectName?: string;
    address: string;
    buildingType: string;
    floors: number;
    unitsPerFloor: number;
    elevatorCount: number;
    quotationId: string;
  }) => string;
  getProjectElevators: (projectId: string) => Elevator[];
  getProjectParts: (projectId: string) => PartRequirement[];
  saveElevatorSurvey: (
    elevatorId: string,
    survey: SurveyData,
    note?: string
  ) => void;
  activateProject: (projectId: string) => void;
}

const seedData = seed();

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: seedData.projects,
  elevators: seedData.elevators,
  tasks: seedData.tasks,
  taskTemplates: seedData.taskTemplates,
  commitments: seedData.commitments,
  supplies: seedData.supplies,
  selectedProjectId: null,
  selectedElevatorId: null,
  selectProject: (id) => set({ selectedProjectId: id }),
  selectElevator: (id) => set({ selectedElevatorId: id }),
  // تأمین کالا — گردش کار انتقال
  requestTransferToProject: (supplyId) =>
    set((s) => ({
      supplies: s.supplies.map((sp) =>
        sp.elevatorId + sp.partId === supplyId && sp.status === "main-stock"
          ? { ...sp, status: "transfer-requested" as SupplyStatus }
          : sp
      ),
    })),
  approveTransferToProject: (supplyId) =>
    set((s) => ({
      supplies: s.supplies.map((sp) =>
        sp.elevatorId + sp.partId === supplyId && sp.status === "transfer-requested"
          ? {
              ...sp,
              status: "project-stock" as SupplyStatus,
              qtySupplied: sp.qtySupplied + sp.qtyNeeded,
            }
          : sp
      ),
    })),
  deliverToProject: (supplyId) =>
    set((s) => ({
      supplies: s.supplies.map((sp) =>
        sp.elevatorId + sp.partId === supplyId && sp.status === "project-stock"
          ? {
              ...sp,
              status: "delivered" as SupplyStatus,
              qtyDelivered: sp.qtyNeeded,
            }
          : sp
      ),
    })),
  returnToMainStock: (supplyId) =>
    set((s) => ({
      supplies: s.supplies.map((sp) =>
        sp.elevatorId + sp.partId === supplyId &&
        (sp.status === "project-stock" || sp.status === "delivered")
          ? {
              ...sp,
              status: "return-requested" as SupplyStatus,
            }
          : sp
      ),
    })),
  requestPurchase: (supplyId) =>
    set((s) => ({
      supplies: s.supplies.map((sp) =>
        sp.elevatorId + sp.partId === supplyId && sp.status === "main-stock"
          ? { ...sp, status: "purchase-request" as SupplyStatus }
          : sp
      ),
    })),
  // وظایف — CRUD
  addTask: (task) =>
    set((s) => ({
      tasks: [...s.tasks, { ...task, id: uid() }],
    })),
  deleteTask: (taskId) =>
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== taskId),
    })),
  updateTaskStatus: (taskId, status) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, status } : t
      ),
    })),
  addTaskReport: (taskId, report) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId
          ? { ...t, report, status: "done" as const }
          : t
      ),
    })),
  // الگوی وظایف
  addTaskTemplate: (tpl) =>
    set((s) => ({
      taskTemplates: [...s.taskTemplates, { ...tpl, id: uid() }],
    })),
  deleteTaskTemplate: (tplId) =>
    set((s) => ({
      taskTemplates: s.taskTemplates.filter((t) => t.id !== tplId),
    })),
  applyTemplateToElevator: (elevatorId, stageId) =>
    set((s) => {
      const templates = s.taskTemplates.filter((t) => t.stageId === stageId);
      const newTasks: Task[] = templates.map((tpl) => ({
        id: uid(),
        elevatorId,
        title: tpl.title,
        assignee: tpl.defaultAssignee,
        type: tpl.type,
        status: "pending",
        dueDate: "",
        description: tpl.description,
        stageId,
      }));
      return { tasks: [...s.tasks, ...newTasks] };
    }),
  createDraftProject: (input) => {
    const id = uid();
    const existing = get().projects.length;
    const codeNum = 140504 + existing;
    const project: Project = {
      id,
      code: `P-${codeNum.toLocaleString("fa-IR")}`,
      name: input.projectName?.trim() || `پروژه ${input.customer}`,
      customer: input.customer,
      address: input.address,
      buildingType: input.buildingType,
      floors: input.floors,
      unitsPerFloor: input.unitsPerFloor,
      elevatorCount: input.elevatorCount,
      status: "draft",
      quotationId: input.quotationId,
      createdAt: now(),
      history: [
        { id: uid(), at: now(), actor: "سیستم", action: "ایجاد پروژه موقت از پیش‌فاکتور", detail: `${input.elevatorCount.toLocaleString("fa-IR")} آسانسور` },
      ],
    };
    const elevators = makeElevators(id, input.elevatorCount);
    set((s) => ({
      projects: [project, ...s.projects],
      elevators: [...elevators, ...s.elevators],
    }));
    return id;
  },
  getProjectElevators: (projectId) =>
    get().elevators.filter((e) => e.projectId === projectId),
  getProjectParts: (projectId) => {
    const elevs = get().elevators.filter((e) => e.projectId === projectId);
    const map = new Map<string, PartRequirement>();
    for (const e of elevs) {
      for (const p of e.parts) {
        const cur = map.get(p.partId);
        if (cur) cur.qty += p.qty;
        else map.set(p.partId, { ...p });
      }
    }
    return Array.from(map.values());
  },
  saveElevatorSurvey: (elevatorId, survey, note) =>
    set((s) => {
      const elev = s.elevators.find((e) => e.id === elevatorId);
      const projectId = elev?.projectId;
      const project = projectId
        ? s.projects.find((p) => p.id === projectId)
        : undefined;
      const parts = computeParts(
        {
          floors: project?.floors ?? 8,
          unitsPerFloor: project?.unitsPerFloor ?? 4,
          elevatorCount: 1,
        },
        survey
      );
      return {
        elevators: s.elevators.map((e) =>
          e.id === elevatorId
            ? {
                ...e,
                survey: { ...survey, note, completedAt: now() },
                parts,
                status: "calculated" as ElevatorStatus,
                progress: Math.max(e.progress, 25),
              }
            : e
        ),
        projects: projectId
          ? s.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    history: [
                      ...p.history,
                      {
                        id: uid(),
                        at: now(),
                        actor: "مدیر فنی",
                        action: `ثبت برداشت اطلاعات ${elev?.name ?? "آسانسور"}`,
                        detail: `${parts.length.toLocaleString("fa-IR")} نوع قطعه محاسبه شد`,
                      },
                    ],
                  }
                : p
            )
          : s.projects,
      };
    }),
  activateProject: (projectId) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status: "active",
              history: [
                ...p.history,
                {
                  id: uid(),
                  at: now(),
                  actor: "سیستم",
                  action: "تبدیل به پروژه اجرایی فعال",
                  detail: "وضعیت از Draft به Active تغییر یافت",
                },
              ],
            }
          : p
      ),
    })),
}));
