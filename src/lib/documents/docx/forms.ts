import { Paragraph } from "docx";
import type { FormData } from "@/types";
import {
  formHeader,
  body,
  bodyBold,
  bullet,
  checkboxItem,
  dualSignatureBlock,
  emptyLine,
} from "./docx-builder";
import { formatMonthDay, electionFormBenefits, planTypeLabelShort, planTypeLabelFull } from "../helpers";

// ===== ELECTION TO PARTICIPATE =====
export function buildElectionToParticipateParagraphs(data: FormData): Paragraph[] {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = electionFormBenefits(data);
  const shortLabel = planTypeLabelShort(data);
  const fullLabel = planTypeLabelFull(data);
  const hsaEnabled = data.plan.planType === "cafeteria" && !!data.cafeteria?.features.hsa;

  const paragraphs: Paragraph[] = [
    ...formHeader(name, "Election to Participate", pyStart, pyEnd, fullLabel),

    body(`As an eligible employee in the above plan, I acknowledge that I have received the Summary Plan Description. I have read the Summary Plan Description and understand the benefits available to me as well as the other rights and obligations which I have under the Plan.`),
    emptyLine(),
    body(`In accordance with my rights under the Plan, I elect the benefits that I have selected below for the plan year specified above. The Employer and I agree that my cash compensation will be redirected by the amounts set forth below for each pay period of the plan year (or during such portion of the plan year as remains after the date of this Election to Participate).`),
    emptyLine(),
    bodyBold("Coverage Tier (check one):"),
    checkboxItem("Employee Only"),
    checkboxItem("Employee + Spouse"),
    checkboxItem("Employee + Child(ren)"),
    checkboxItem("Family"),
    emptyLine(),
    bodyBold(`I elect to receive the following coverage(s) under the ${shortLabel} and authorize the per-pay-period salary redirection amount indicated for each:`),
    emptyLine(),
    ...benefits.map((b) => checkboxItem(`${b}    Per Pay Period: $______________`, { bold: true })),
    emptyLine(),
    body("Total per-pay-period salary redirection: $______________"),
    emptyLine(),
    bodyBold("Payroll Deduction Authorization:"),
    body("I expressly authorize my Employer to deduct from each of my paychecks the per-pay-period salary redirection amount(s) elected above, beginning with the first pay period on or after the effective date of this election and continuing for the duration of the Plan Year or until I revoke this election as permitted by the Plan. I consent to receive Plan-related notices, election confirmations, and other communications electronically (including by email and the Employer’s benefits portal) where permitted by applicable law."),
    emptyLine(),
    bodyBold("Acknowledgments — Premium Conversion and FSA Elections:"),
    bullet("If I do not specify dollar amounts above, I authorize salary redirections in the amounts of the current premiums being charged for the coverage(s) and tier elected."),
    bullet("If my required contributions to pay premiums for the elected benefits are increased or decreased while this Election remains in effect, my compensation redirection will automatically be adjusted to reflect that increase or decrease."),
    bullet("Other than as permitted under the HSA acknowledgments below (if applicable), I cannot change or revoke any of my Premium Conversion or FSA elections under this Plan at any time during the Plan Year unless I have a “change in status” and the election change is consistent with the “change in status.”"),
    bullet("Any amounts contributed to an FSA that are not used during the Plan Year (and any applicable run-out, grace period, or carryover) will be forfeited as required by IRS rules. This forfeiture rule does NOT apply to HSA contributions; HSA balances are always owned by the participant."),
    bullet("Prior to the first day of each Plan Year I will be offered the opportunity to change my benefit elections for that Plan Year."),
    bullet("My Social Security benefits may be slightly reduced due to my pre-tax contributions to the Plan."),
  ];

  if (hsaEnabled) {
    paragraphs.push(
      emptyLine(),
      bodyBold("Additional Acknowledgments — Health Savings Account (HSA) Contributions:"),
      bullet("My HSA is owned by me. Unused HSA balances roll over from year to year and never forfeit, even if I change employers, change health plans, retire, or leave the workforce."),
      bullet("My HSA salary-reduction election is NOT locked in for the Plan Year. I may start, stop, increase, or decrease my HSA contributions on a prospective basis at any time during the Plan Year, in accordance with the procedures established by the Plan Administrator and consistent with IRS Notice 2004-50."),
      bullet("My HSA eligibility depends on my continued enrollment in an HDHP and the absence of disqualifying coverage (other than permitted insurance and limited-purpose/post-deductible health FSAs). I am solely responsible for monitoring my own HSA eligibility and for ensuring that my total HSA contributions from all sources do not exceed the annual statutory limit set by the IRS."),
    );
  }

  paragraphs.push(...dualSignatureBlock());
  return paragraphs;
}

// ===== WAIVER OF PARTICIPATION =====
export function buildWaiverOfParticipationParagraphs(data: FormData): Paragraph[] {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const shortLabel = planTypeLabelShort(data);
  const fullLabel = planTypeLabelFull(data);
  const planName = `${name} ${shortLabel}`;

  return [
    ...formHeader(name, "Waiver of Participation", pyStart, pyEnd, fullLabel),

    body(`To be completed if any eligible employee is declining coverage under the ${planName}.`),
    emptyLine(),
    body(`I, ______________________________, elect to waive coverage under the ${planName} at this time. I understand that my decision is for the length of the plan year, and only in the event of a life change would I be eligible to change my election prior to the next plan year.`),
    emptyLine(),
    body(`I have read and I understand the Summary Plan Description and the related Adoption Agreement, which were provided to me by my employer. I have been given the opportunity to apply for the available benefits and have elected not to enroll.`),
    ...dualSignatureBlock(),
  ];
}

// ===== REVOCATION OF BENEFIT ELECTION =====
export function buildRevocationFormParagraphs(data: FormData): Paragraph[] {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = electionFormBenefits(data);
  const shortLabel = planTypeLabelShort(data);
  const fullLabel = planTypeLabelFull(data);

  return [
    ...formHeader(name, "Revocation of Benefit Election Form", pyStart, pyEnd, fullLabel),

    body(`Effective____________, I hereby revoke my benefit election and compensation redirection agreement under the ${shortLabel} with respect to the following benefit coverage(s):`),
    emptyLine(),
    ...benefits.map((b) => checkboxItem(b, { bold: true })),
    emptyLine(),
    body(`My benefit election and compensation redirection agreement shall remain in effect as to my benefit coverages, if any, which are not checked above.`),
    ...dualSignatureBlock(),
    emptyLine(),
    body(`This revocation may not be effective prior to the first day of the next Plan Year unless it is made because of a change in status as defined in the Plan. In no event may the revocation be effective prior to the first pay period beginning after this form is completed and returned to the administrator of the Plan.`),
  ];
}

// ===== CHANGE IN STATUS ELECTION FORM =====
export function buildChangeInStatusFormParagraphs(data: FormData): Paragraph[] {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const shortLabel = planTypeLabelShort(data);
  const fullLabel = planTypeLabelFull(data);

  const reasons = [
    "Marriage",
    "Divorce, Legal Separation, or Annulment",
    "Birth, or adoption, or placement for adoption of a child",
    "Death of my spouse and/or dependent",
    "Termination or commencement of employment by my spouse or dependent",
    "A judgment, decree, or order (“order”) that affected eligibility for benefits",
    "I, my spouse, or dependent have had a change in employment status, including switching from part-time to full-time (or vice versa) or reduction or increase in hours, a strike or lockout, that affected eligibility for benefits",
    "A change in the residence or worksite of myself, my spouse, or dependent that affected eligibility for benefits",
    "I, my spouse, or dependent have taken an unpaid leave of absence that affected eligibility for benefits",
    "My dependent satisfies or ceases to satisfy the requirements for coverage due to attainment of age, student status, or any similar circumstance",
    "A cost or coverage change in benefits that affected eligibility for me, my spouse, or dependent",
    "A change made under my spouse’s or dependent’s employer benefits plan if the election for a period of coverage for my Plan is different from the period of coverage (open enrollment) under the other cafeteria plan or qualified benefits plan",
  ];

  if (data.elections.allowChangeBelow30Hours) {
    reasons.push("A change in my employment status in which I am reasonably expected to average less than 30 hours of service per week");
  }
  if (data.elections.allowChangeMarketplace) {
    reasons.push("I am eligible for a Special Enrollment Period to enroll in a Qualified Health Plan through a Marketplace");
    reasons.push("I am eligible to enroll in a Qualified Health Plan through a Marketplace during the Marketplace’s annual open enrollment period");
  }

  return [
    ...formHeader(name, "Change in Status Election Form", pyStart, pyEnd, fullLabel),

    body(`As a participant in the ${shortLabel}, I am entitled to revoke my prior benefit election and enter into a new election in the event of certain changes in status.`),
    emptyLine(),
    body(`I understand that the change in my benefit election must be necessitated by and consistent with the change in status and that the change must be acceptable under the Regulations issued by the Department of Treasury.`),
    emptyLine(),
    bodyBold("I certify that I have incurred the following change in status:"),
    emptyLine(),
    ...reasons.map((r) => checkboxItem(r)),
    emptyLine(),
    body(`The Administrator may require you to provide evidence to document the event which requires the change of election.`),
    ...dualSignatureBlock(),
  ];
}
