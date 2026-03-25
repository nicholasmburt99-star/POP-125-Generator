import { format, parse } from "date-fns";
import type { FormData, PlanBenefits } from "@/types";
import { ENTITY_TYPE_LABELS, US_STATES } from "@/types";

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = parse(dateStr, "yyyy-MM-dd", new Date());
    return format(date, "MMMM dd, yyyy");
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = parse(dateStr, "yyyy-MM-dd", new Date());
    return format(date, "MMMM dd");
  } catch {
    return dateStr;
  }
}

export function formatMonthDay(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = parse(dateStr, "yyyy-MM-dd", new Date());
    return format(date, "MMMM dd");
  } catch {
    return dateStr;
  }
}

export function formatYear(dateStr: string): string {
  if (!dateStr) return "";
  return dateStr.substring(0, 4);
}

export function stateName(code: string): string {
  return US_STATES.find((s) => s.value === code)?.label || code;
}

export function entityLabel(data: FormData): string {
  return ENTITY_TYPE_LABELS[data.employer.entityType];
}

export function benefitsList(benefits: PlanBenefits): string[] {
  const list: string[] = [];
  if (benefits.groupMedical) list.push("Group Medical Plan");
  if (benefits.groupDental) list.push("Group Dental Plan");
  if (benefits.groupVision) list.push("Group Vision Plan");
  return list;
}

export function employerAddress(data: FormData): string {
  return `${data.employer.streetAddress}\n${data.employer.city}, ${data.employer.state} ${data.employer.zipCode}`;
}

export function planYearDescription(data: FormData): string {
  const start = formatMonthDay(data.plan.planYearStart);
  const end = formatMonthDay(data.plan.planYearEnd);
  return `${start} through ${end}`;
}
