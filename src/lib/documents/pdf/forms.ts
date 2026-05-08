import type { FormData } from "@/types";
import type { PDFSection } from "./pdf-builder";
import { formHeader, bodyText, bulletItem, checkboxItem, dualSignatureBlock, emptyLine } from "./pdf-builder";
import { formatMonthDay, electionFormBenefits, planTypeLabelShort, planTypeLabelFull } from "../helpers";

export function buildElectionToParticipatePDF(data: FormData): PDFSection {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = electionFormBenefits(data);
  const shortLabel = planTypeLabelShort(data);
  const fullLabel = planTypeLabelFull(data);

  return { build: (ctx) => {
    formHeader(ctx, name, "Election to Participate", pyStart, pyEnd, fullLabel);
    bodyText(ctx, "As an eligible employee, I acknowledge that I have received and read the Summary Plan Description and understand the benefits available to me and the other rights and obligations I have under the Plan.");
    emptyLine(ctx);
    bodyText(ctx, "Coverage Tier (check one):", { bold: true });
    checkboxItem(ctx, "Employee Only");
    checkboxItem(ctx, "Employee + Spouse");
    checkboxItem(ctx, "Employee + Child(ren)");
    checkboxItem(ctx, "Family");
    emptyLine(ctx);
    bodyText(ctx, `I elect to receive the following coverage(s) under the ${shortLabel} and authorize the per-pay-period salary redirection amount indicated for each:`, { bold: true });
    emptyLine(ctx);
    benefits.forEach((b) => checkboxItem(ctx, `${b}    Per Pay Period: $______________`, { bold: true }));
    emptyLine(ctx);
    bodyText(ctx, "Total per-pay-period salary redirection: $______________");
    emptyLine(ctx);
    bodyText(ctx, "I understand that:", { bold: true });
    bulletItem(ctx, "If I do not specify dollar amounts above, I authorize salary redirections in the amounts of the current premiums for the coverage(s) and tier elected.");
    bulletItem(ctx, "If premiums change, my redirection will automatically adjust.");
    bulletItem(ctx, "I cannot change elections unless I have a qualifying change in status.");
    bulletItem(ctx, "Unused amounts will be forfeited.");
    bulletItem(ctx, "I will be offered the opportunity to change elections before each Plan Year.");
    bulletItem(ctx, "My Social Security benefits may be slightly reduced.");
    dualSignatureBlock(ctx);
  }};
}

export function buildWaiverOfParticipationPDF(data: FormData): PDFSection {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const shortLabel = planTypeLabelShort(data);
  const fullLabel = planTypeLabelFull(data);
  const planName = `${name} ${shortLabel}`;

  return { build: (ctx) => {
    formHeader(ctx, name, "Waiver of Participation", pyStart, pyEnd, fullLabel);
    bodyText(ctx, `To be completed if any eligible employee is declining coverage under the ${planName}.`);
    emptyLine(ctx);
    bodyText(ctx, `I, ______________________________, elect to waive coverage under the ${planName} at this time. I understand that my decision is for the length of the plan year, and only in the event of a life change would I be eligible to change my election prior to the next plan year.`);
    emptyLine(ctx);
    bodyText(ctx, "I have read and I understand the Summary Plan Description and the related Adoption Agreement, which were provided to me by my employer. I have been given the opportunity to apply for the available benefits and have elected not to enroll.");
    dualSignatureBlock(ctx);
  }};
}

export function buildRevocationFormPDF(data: FormData): PDFSection {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = electionFormBenefits(data);
  const shortLabel = planTypeLabelShort(data);
  const fullLabel = planTypeLabelFull(data);

  return { build: (ctx) => {
    formHeader(ctx, name, "Revocation of Benefit Election Form", pyStart, pyEnd, fullLabel);
    bodyText(ctx, `Effective____________, I hereby revoke my benefit election under the ${shortLabel} with respect to the following:`);
    emptyLine(ctx);
    benefits.forEach((b) => checkboxItem(ctx, b, { bold: true }));
    emptyLine(ctx);
    bodyText(ctx, "My election shall remain in effect for coverages not checked above.");
    dualSignatureBlock(ctx);
    emptyLine(ctx);
    bodyText(ctx, "This revocation may not be effective prior to the next Plan Year unless made because of a change in status.");
  }};
}

export function buildChangeInStatusFormPDF(data: FormData): PDFSection {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const shortLabel = planTypeLabelShort(data);
  const fullLabel = planTypeLabelFull(data);

  const reasons = [
    "Marriage", "Divorce, Legal Separation, or Annulment",
    "Birth, adoption, or placement for adoption of a child",
    "Death of my spouse and/or dependent",
    "Termination or commencement of employment by spouse or dependent",
    "A judgment, decree, or order affecting eligibility",
    "Change in employment status affecting eligibility",
    "Change in residence or worksite affecting eligibility",
    "Unpaid leave of absence affecting eligibility",
    "Dependent eligibility change (age, student status)",
    "Cost or coverage change in benefits",
    "Change under spouse/dependent employer benefits plan",
  ];
  if (data.elections.allowChangeBelow30Hours) reasons.push("Employment status change to less than 30 hours/week");
  if (data.elections.allowChangeMarketplace) {
    reasons.push("Eligible for Special Enrollment in a Marketplace Qualified Health Plan");
    reasons.push("Eligible for Marketplace annual open enrollment");
  }

  return { build: (ctx) => {
    formHeader(ctx, name, "Change in Status Election Form", pyStart, pyEnd, fullLabel);
    bodyText(ctx, `As a participant in the ${shortLabel}, I am entitled to revoke my prior election due to a change in status.`);
    emptyLine(ctx);
    bodyText(ctx, "I certify that I have incurred the following change in status:", { bold: true });
    emptyLine(ctx);
    reasons.forEach((r) => checkboxItem(ctx, r));
    emptyLine(ctx);
    bodyText(ctx, "The Administrator may require evidence to document the event.");
    dualSignatureBlock(ctx);
  }};
}
