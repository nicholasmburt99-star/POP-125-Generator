import type { FormData } from "@/types";
import type { PDFSection } from "./pdf-builder";
import { formHeader, bodyText, bulletItem, checkboxItem, dualSignatureBlock, emptyLine } from "./pdf-builder";
import { formatMonthDay, benefitsList } from "../helpers";

export function buildElectionToParticipatePDF(data: FormData): PDFSection {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = benefitsList(data.benefits);

  return { build: (ctx) => {
    formHeader(ctx, name, "Election to Participate", pyStart, pyEnd);
    bodyText(ctx, "As an eligible employee, I acknowledge that I have received and understand the Summary Plan Description.");
    emptyLine(ctx);
    bodyText(ctx, "I elect to receive the following coverage(s) under the Premium Only Plan:");
    emptyLine(ctx);
    benefits.forEach((b) => checkboxItem(ctx, b, { bold: true }));
    emptyLine(ctx);
    bodyText(ctx, "I understand that:", { bold: true });
    bulletItem(ctx, "I authorize salary redirections in the amounts of the current premiums.");
    bulletItem(ctx, "If premiums change, my redirection will automatically adjust.");
    bulletItem(ctx, "I cannot change elections unless I have a qualifying change in status.");
    bulletItem(ctx, "Unused amounts will be forfeited.");
    bulletItem(ctx, "I will be offered the opportunity to change elections before each Plan Year.");
    bulletItem(ctx, "My Social Security benefits may be slightly reduced.");
    dualSignatureBlock(ctx);
  }};
}

export function buildElectionToNotParticipatePDF(data: FormData): PDFSection {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);

  return { build: (ctx) => {
    formHeader(ctx, name, "Election to not Participate", pyStart, pyEnd);
    bodyText(ctx, "I understand all benefit options available under the Premium Only Plan.");
    emptyLine(ctx);
    bodyText(ctx, "I elect NOT to participate and instead receive my full compensation in taxable compensation.");
    emptyLine(ctx);
    bodyText(ctx, "I understand that:", { bold: true });
    bulletItem(ctx, "I cannot change elections unless I have a qualifying change in status.");
    bulletItem(ctx, "Prior to each Plan Year I will be offered the opportunity to change my election.");
    dualSignatureBlock(ctx);
  }};
}

export function buildRevocationFormPDF(data: FormData): PDFSection {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = benefitsList(data.benefits);

  return { build: (ctx) => {
    formHeader(ctx, name, "Revocation of Benefit Election Form", pyStart, pyEnd);
    bodyText(ctx, "Effective____________, I hereby revoke my benefit election with respect to the following:");
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
    formHeader(ctx, name, "Change in Status Election Form", pyStart, pyEnd);
    bodyText(ctx, "As a participant, I am entitled to revoke my prior election due to a change in status.");
    emptyLine(ctx);
    bodyText(ctx, "I certify that I have incurred the following change in status:", { bold: true });
    emptyLine(ctx);
    reasons.forEach((r) => checkboxItem(ctx, r));
    emptyLine(ctx);
    bodyText(ctx, "The Administrator may require evidence to document the event.");
    dualSignatureBlock(ctx);
  }};
}
