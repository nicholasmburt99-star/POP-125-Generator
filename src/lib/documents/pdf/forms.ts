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

  const hsaEnabled = data.plan.planType === "cafeteria" && !!data.cafeteria?.features.hsa;

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
    bodyText(ctx, "Payroll Deduction Authorization:", { bold: true });
    bodyText(ctx, "I expressly authorize my Employer to deduct from each of my paychecks the per-pay-period salary redirection amount(s) elected above, beginning with the first pay period on or after the effective date of this election and continuing for the duration of the Plan Year or until I revoke this election as permitted by the Plan. I consent to receive Plan-related notices, election confirmations, and other communications electronically where permitted by applicable law.");
    emptyLine(ctx);
    bodyText(ctx, "Acknowledgments — Premium Conversion and FSA Elections:", { bold: true });
    bulletItem(ctx, "If I do not specify dollar amounts above, I authorize salary redirections in the amounts of the current premiums for the coverage(s) and tier elected.");
    bulletItem(ctx, "If premiums change, my redirection will automatically adjust.");
    bulletItem(ctx, "Other than as permitted under the HSA acknowledgments below (if applicable), I cannot change my Premium Conversion or FSA elections unless I have a qualifying change in status.");
    bulletItem(ctx, "Any FSA amounts not used during the Plan Year (and any applicable run-out, grace period, or carryover) will be forfeited. This rule does NOT apply to HSA contributions.");
    bulletItem(ctx, "I will be offered the opportunity to change elections before each Plan Year.");
    bulletItem(ctx, "My Social Security benefits may be slightly reduced.");
    if (hsaEnabled) {
      emptyLine(ctx);
      bodyText(ctx, "Additional Acknowledgments — Health Savings Account (HSA):", { bold: true });
      bulletItem(ctx, "My HSA is owned by me. Unused HSA balances roll over from year to year and never forfeit.");
      bulletItem(ctx, "My HSA salary-reduction election is NOT locked in. I may start, stop, increase, or decrease my HSA contributions prospectively at any time during the Plan Year, per IRS Notice 2004-50.");
      bulletItem(ctx, "My HSA eligibility depends on my enrollment in an HDHP and the absence of disqualifying coverage. I am responsible for monitoring my own HSA eligibility and ensuring contributions do not exceed the annual IRS limit.");
    }
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
