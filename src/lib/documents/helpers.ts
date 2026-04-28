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

// Returns "Premium Only Plan" or "Cafeteria Plan" depending on planType
export function planTypeLabelShort(data: FormData): string {
  return data.plan.planType === "cafeteria" ? "Cafeteria Plan" : "Premium Only Plan";
}

// Full Section 125 label used in form headers
export function planTypeLabelFull(data: FormData): string {
  return `Section 125 ${planTypeLabelShort(data)}`;
}

// Returns the list of benefits to show in election forms.
// For POP plans, uses the simple benefits list (medical/dental/vision).
// For cafeteria plans, includes all enabled cafeteria benefits.
export function electionFormBenefits(data: FormData): string[] {
  if (data.plan.planType !== "cafeteria" || !data.cafeteria) {
    return benefitsList(data.benefits);
  }
  const list: string[] = [];
  const f = data.cafeteria.features;
  if (f.premiumConversion) list.push("Premium Conversion (Group Medical / Dental / Vision premiums)");
  if (f.healthFSA) list.push("Health Flexible Spending Account");
  if (f.limitedPurposeFSA) list.push("Limited Purpose HSA-Compatible Health FSA");
  if (f.postDeductibleFSA) list.push("Post-Deductible HSA-Compatible Health FSA");
  if (f.dcap) list.push("Dependent Care Assistance Plan Account (DCAP)");
  if (f.adoptionAssistanceFSA) list.push("Adoption Assistance Flexible Spending Account");
  if (f.hsa) list.push("Health Savings Account");
  if (f.flexCredits) list.push("Flexible Benefit Credits");
  if (f.ptoPurchaseSale) list.push("PTO Purchase / Sale");
  return list;
}
