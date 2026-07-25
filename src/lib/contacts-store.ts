import { create } from "zustand";
import { DEFAULT_GROUPS, type PersonType } from "./contact-groups";
import type { ContactFormData } from "@/components/easy-lift/contacts/contact-form-dialog";

export interface Contact {
  id: string;
  name: string;
  group: string;
  groupIds: string[];
  phone: string;
  mobile: string;
  email: string;
  city: string;
  address: string;
  projects: number;
  status: "active" | "partner";
  personType: PersonType;
  formData: ContactFormData;
}

const groupLabel = (groupIds: string[]) =>
  groupIds
    .map((gid) => DEFAULT_GROUPS.find((g) => g.id === gid)?.label ?? gid)
    .join("، ") || "—";

export function contactNameFromForm(data: ContactFormData): string {
  return data.personType === "individual"
    ? `${data.firstName} ${data.lastName}`.trim() || "بدون نام"
    : data.companyName || "بدون نام";
}

function makeFormData(
  name: string,
  groupIds: string[],
  phone: string,
  city: string,
  personType: PersonType
): ContactFormData {
  return {
    personType,
    groups: groupIds,
    firstName: personType === "individual" ? name.split(" ")[0] : "",
    lastName: personType === "individual" ? name.split(" ")[1] ?? "" : "",
    fatherName: "",
    companyName: personType === "legal" ? name : "",
    customerType: "عادی",
    description: "",
    taxType: "",
    taxCode: "",
    postalCode: "",
    idNumber: "",
    nationalId: "",
    accountNumber: "",
    iban: "",
    phone,
    mobile: "",
    email: "",
    city,
    address: "",
  };
}

function seedContacts(): Contact[] {
  const mk = (
    id: string,
    name: string,
    groupIds: string[],
    phone: string,
    city: string,
    projects: number,
    status: "active" | "partner",
    personType: PersonType = "legal"
  ): Contact => ({
    id,
    name,
    group: groupLabel(groupIds),
    groupIds,
    phone,
    mobile: "",
    email: "",
    city,
    address: "",
    projects,
    status,
    personType,
    formData: makeFormData(name, groupIds, phone, city, personType),
  });

  return [
    mk("1", "شرکت پارسیان", ["customer"], "02188776655", "تهران", 8, "active"),
    mk("2", "آسانبر نوین", ["supplier"], "02122334455", "اصفهان", 12, "partner"),
    mk("3", "برج آریا", ["customer"], "02144556677", "تهران", 3, "active"),
    mk("4", "سپهر آسانسور", ["supplier"], "03155667788", "اصفهان", 9, "partner"),
    mk("5", "پارس لیفت", ["supplier"], "02166778899", "کرج", 6, "active"),
    mk("6", "محمد احمدی", ["staff", "marketer"], "09123456789", "تهران", 0, "active", "individual"),
  ];
}

function contactFromForm(data: ContactFormData, id: string): Contact {
  return {
    id,
    name: contactNameFromForm(data),
    group: groupLabel(data.groups),
    groupIds: data.groups,
    phone: data.phone || data.mobile || "—",
    mobile: data.mobile,
    email: data.email,
    city: data.city || "—",
    address: data.address,
    projects: 0,
    status: "active",
    personType: data.personType,
    formData: data,
  };
}

interface ContactsState {
  contacts: Contact[];
  addContact: (data: ContactFormData) => Contact;
  updateContact: (id: string, data: ContactFormData) => void;
}

export const useContacts = create<ContactsState>((set) => ({
  contacts: seedContacts(),
  addContact: (data) => {
    const contact = contactFromForm(data, `c-${Date.now()}`);
    set((s) => ({ contacts: [contact, ...s.contacts] }));
    return contact;
  },
  updateContact: (id, data) =>
    set((s) => ({
      contacts: s.contacts.map((c) =>
        c.id === id ? { ...contactFromForm(data, id), projects: c.projects, status: c.status } : c
      ),
    })),
}));
