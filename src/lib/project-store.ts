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

  return { projects, elevators };
}

interface ProjectState {
  projects: Project[];
  elevators: Elevator[];
  selectedProjectId: string | null;
  selectedElevatorId: string | null;
  selectProject: (id: string | null) => void;
  selectElevator: (id: string | null) => void;
  createDraftProject: (input: {
    customer: string;
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
  selectedProjectId: null,
  selectedElevatorId: null,
  selectProject: (id) => set({ selectedProjectId: id }),
  selectElevator: (id) => set({ selectedElevatorId: id }),
  createDraftProject: (input) => {
    const id = uid();
    const existing = get().projects.length;
    const codeNum = 140504 + existing;
    const project: Project = {
      id,
      code: `P-${codeNum.toLocaleString("fa-IR")}`,
      name: `پروژه ${input.customer}`,
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
