import type { FormData } from "@/types";
import type { PDFSection } from "./pdf-builder";
import {
  formHeader,
  bodyText,
  bulletItem,
  checkboxItem,
  dualSignatureBlock,
  emptyLine,
} from "./pdf-builder";
import { formatMonthDay, benefitsList } from "../helpers";

export function buildElectionToParticipatePDF(data: FormData): PDFSection {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = benefitsList(data.benefits);

  return {
    build: (doc) => {
      formHeader(doc, name, "Election to Participate", pyStart, pyEnd);
      bodyText(doc, "As an eligible employee in the above plan, I acknowledge that I have received the Summary Plan Description and understand the benefits available to me.");
      emptyLine(doc);
      bodyText(doc, "I elect to receive the following coverage(s) under the Premium Only Plan:");
      emptyLine(doc);
      benefits.forEach((b) => checkboxItem(doc, b, { bold: true }));
      emptyLine(doc);
      bodyText(doc, "I understand that:", { bold: true });
      bulletItem(doc, "I authorize salary redirections in the amounts of the current premiums being charged.");
      bulletItem(doc, "If premium contributions change, my redirection will automatically be adjusted.");
      bulletItem(doc, "I cannot change or revoke elections unless I have a \u201cchange in status.\u201d");
      bulletItem(doc, "Unused amounts will be forfeited and may not be carried over.");
      bulletItem(doc, "I will be offered the opportunity to change elections before each Plan Year.");
      bulletItem(doc, "My Social Security benefits may be slightly reduced.");
      dualSignatureBlock(doc);
    },
  };
}

export function buildElectionToNotParticipatePDF(data: FormData): PDFSection {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);

  return {
    build: (doc) => {
      formHeader(doc, name, "Election to not Participate", pyStart, pyEnd);
      bodyText(doc, "I understand all the benefit options available under the Premium Only Plan.");
      emptyLine(doc);
      bodyText(doc, "I elect NOT to participate in the Premium Only Plan and instead to receive my full compensation in taxable compensation.");
      emptyLine(doc);
      bodyText(doc, "I understand that:", { bold: true });
      bulletItem(doc, "I cannot change or revoke elections unless I have a \u201cchange in status.\u201d");
      bulletItem(doc, "Prior to each Plan Year I will be offered the opportunity to change my election.");
      dualSignatureBlock(doc);
    },
  };
}

export function buildRevocationFormPDF(data: FormData): PDFSection {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = benefitsList(data.benefits);

  return {
    build: (doc) => {
      formHeader(doc, name, "Revocation of Benefit Election Form", pyStart, pyEnd);
      bodyText(doc, "Effective____________, I hereby revoke my benefit election and compensation redirection agreement under the Premium Only Plan with respect to the following benefit coverage(s):");
      emptyLine(doc);
      benefits.forEach((b) => checkboxItem(doc, b, { bold: true }));
      emptyLine(doc);
      bodyText(doc, "My benefit election shall remain in effect as to my benefit coverages which are not checked above.");
      dualSignatureBlock(doc);
      emptyLine(doc);
      bodyText(doc, "This revocation may not be effective prior to the first day of the next Plan Year unless it is made because of a change in status as defined in the Plan.");
    },
  };
}

export function buildChangeInStatusFormPDF(data: FormData): PDFSection {
  const name = data.employer.legalBusinessName;
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);

  const reasons = [
    "Marriage",
    "Divorce, Legal Separation, or Annulment",
    "Birth, or adoption, or placement for adoption of a child",
    "Death of my spouse and/or dependent",
    "Termination or commencement of employment by my spouse or dependent",
    "A judgment, decree, or order that affected eligibility for benefits",
    "Change in employment status (part-time/full-time, strike, lockout) affecting eligibility",
    "Change in residence or worksite affecting eligibility",
    "Unpaid leave of absence affecting eligibility",
    "Dependent satisfies or ceases to satisfy eligibility requirements",
    "A cost or coverage change in benefits affecting eligibility",
    "A change under spouse\u2019s or dependent\u2019s employer benefits plan",
  ];
  if (data.elections.allowChangeBelow30Hours) {
    reasons.push("Change in employment status to less than 30 hours of service per week");
  }
  if (data.elections.allowChangeMarketplace) {
    reasons.push("Eligible for Special Enrollment Period in a Qualified Health Plan through a Marketplace");
    reasons.push("Eligible to enroll in a Marketplace during annual open enrollment period");
  }

  return {
    build: (doc) => {
      formHeader(doc, name, "Change in Status Election Form", pyStart, pyEnd);
      bodyText(doc, "As a participant in the Premium Only Plan, I am entitled to revoke my prior benefit election and enter into a new election in the event of certain changes in status.");
      emptyLine(doc);
      bodyText(doc, "I certify that I have incurred the following change in status:", { bold: true });
      emptyLine(doc);
      reasons.forEach((r) => checkboxItem(doc, r));
      emptyLine(doc);
      bodyText(doc, "The Administrator may require you to provide evidence to document the event which requires the change of election.");
      dualSignatureBlock(doc);
    },
  };
}
