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
import { formatMonthDay, benefitsList } from "../helpers";

// ===== ELECTION TO PARTICIPATE =====
export function buildElectionToParticipateParagraphs(data: FormData): Paragraph[] {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = benefitsList(data.benefits);

  return [
    ...formHeader(name, "Election to Participate", pyStart, pyEnd),

    body(`As an eligible employee in the above plan, I acknowledge that I have received the Summary Plan Description. I have read the Summary Plan Description and understand the benefits available to me as well as the other rights and obligations which I have under the Plan.`),
    emptyLine(),
    body(`In accordance with my rights under the Plan, I elect the benefits that I have selected below for the plan year specified above. The Employer and I agree that my cash compensation will be redirected by the amounts set forth below for each pay period of the plan year (or during such portion of the plan year as remains after the date of this Election to Participate).`),
    emptyLine(),
    body(`On the appropriate benefit enrollment form(s), I have enrolled for certain insurance coverages. I elect to receive the following coverage(s) under the Premium Only Plan:`),
    emptyLine(),
    ...benefits.map((b) => checkboxItem(b, { bold: true })),
    emptyLine(),
    bodyBold("I understand that:"),
    bullet("In lieu of specific dollar amounts, I hereby elect the above specified insurance coverages and authorize salary redirections in the amounts of the current premiums being charged."),
    bullet("If my required contributions to pay premiums for the elected benefits are increased or decreased while this Election remains in effect, my compensation redirection will automatically be adjusted to reflect that increase or decrease."),
    bullet("I cannot change or revoke any of my elections under this Plan at any time during the Plan Year unless I have a \u201cchange in status\u201d and the election change is consistent with the \u201cchange in status.\u201d"),
    bullet("Any amounts that are not used during a Plan Year to provide benefits will be forfeited and may not be paid to me in taxable compensation or used to provide benefits specifically for me in a later Plan Year."),
    bullet("Prior to the first day of each Plan Year I will be offered the opportunity to change my benefit elections for that Plan Year."),
    bullet("My Social Security benefits may be slightly reduced due to my pre-tax contributions to the Plan."),
    ...dualSignatureBlock(),
  ];
}

// ===== ELECTION TO NOT PARTICIPATE =====
export function buildElectionToNotParticipateParagraphs(data: FormData): Paragraph[] {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);

  return [
    ...formHeader(name, "Election to not Participate", pyStart, pyEnd),

    body(`I understand all the benefit options available under the Premium Only Plan.`),
    emptyLine(),
    body(`I elect NOT to participate in the Premium Only Plan and instead to receive my full compensation in taxable compensation. I understand that I will receive the full amount of my salary and other compensation without reduction for benefits available, or any reduction on applicable employment tax costs.`),
    emptyLine(),
    bodyBold("I understand that:"),
    bullet(`I cannot change or revoke any of my elections under the Plan at any time during the Plan Year unless I have a \u201cchange in status\u201d and the election change is consistent with the \u201cchange in status\u201d (including marriage, divorce, death of a spouse or child, birth or adoption of a child, commencement or termination of employment of a spouse, change in employment status from full-time to part-time or vice versa, taking an unpaid leave of absence, or such other events as the Plan Administrator determines will permit a change or revocation of an election).`),
    bullet(`Prior to each Plan Year I will be offered the opportunity to change my benefit election for the following Plan Year. If I do not complete and return a new election form at that time, I will be treated as having elected to continue my election to receive full cash compensation in effect for the new Plan Year.`),
    ...dualSignatureBlock(),
  ];
}

// ===== REVOCATION OF BENEFIT ELECTION =====
export function buildRevocationFormParagraphs(data: FormData): Paragraph[] {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = benefitsList(data.benefits);

  return [
    ...formHeader(name, "Revocation of Benefit Election Form", pyStart, pyEnd),

    body(`Effective____________, I hereby revoke my benefit election and compensation redirection agreement under the Premium Only Plan with respect to the following benefit coverage(s):`),
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

  const reasons = [
    "Marriage",
    "Divorce, Legal Separation, or Annulment",
    "Birth, or adoption, or placement for adoption of a child",
    "Death of my spouse and/or dependent",
    "Termination or commencement of employment by my spouse or dependent",
    "A judgment, decree, or order (\u201corder\u201d) that affected eligibility for benefits",
    "I, my spouse, or dependent have had a change in employment status, including switching from part-time to full-time (or vice versa) or reduction or increase in hours, a strike or lockout, that affected eligibility for benefits",
    "A change in the residence or worksite of myself, my spouse, or dependent that affected eligibility for benefits",
    "I, my spouse, or dependent have taken an unpaid leave of absence that affected eligibility for benefits",
    "My dependent satisfies or ceases to satisfy the requirements for coverage due to attainment of age, student status, or any similar circumstance",
    "A cost or coverage change in benefits that affected eligibility for me, my spouse, or dependent",
    "A change made under my spouse\u2019s or dependent\u2019s employer benefits plan if the election for a period of coverage for my Plan is different from the period of coverage (open enrollment) under the other cafeteria plan or qualified benefits plan",
  ];

  if (data.elections.allowChangeBelow30Hours) {
    reasons.push("A change in my employment status in which I am reasonably expected to average less than 30 hours of service per week");
  }
  if (data.elections.allowChangeMarketplace) {
    reasons.push("I am eligible for a Special Enrollment Period to enroll in a Qualified Health Plan through a Marketplace");
    reasons.push("I am eligible to enroll in a Qualified Health Plan through a Marketplace during the Marketplace\u2019s annual open enrollment period");
  }

  return [
    ...formHeader(name, "Change in Status Election Form", pyStart, pyEnd),

    body(`As a participant in the Premium Only Plan, I am entitled to revoke my prior benefit election and enter into a new election in the event of certain changes in status.`),
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
