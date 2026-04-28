import { Paragraph, TextRun, AlignmentType } from "docx";
import type { FormData, CafeteriaConfig, EntityType } from "@/types";
import { ENTITY_TYPE_LABELS } from "@/types";
import {
  body, bodyBold, signatureBlock, pageBreak, emptyLine,
  centeredText, checkboxLine, numberedLine, legalSection, subheading, noteText,
  FONT, FONT_SIZE, TITLE_SIZE, SUBHEADING_SIZE,
} from "./docx-builder";
import { formatDate, formatMonthDay, stateName } from "../helpers";

// All entity types in the order they should appear in the JT2 template
const ENTITY_TYPE_ORDER: EntityType[] = [
  "c_corp", "s_corp", "non_profit", "partnership", "llc", "llp",
  "sole_proprietorship", "union", "government", "other",
];

export function buildCafeteriaPlanParagraphs(data: FormData): Paragraph[] {
  const cafe = data.cafeteria;
  if (!cafe) {
    // Should never happen but guard against
    return [body("Error: Cafeteria configuration is missing.")];
  }

  const name = data.employer.legalBusinessName;
  const effective = formatDate(data.plan.effectiveDate);
  const govLaw = stateName(data.employer.stateOfGoverningLaw);
  const stateOfOrg = stateName(data.employer.stateOfOrganization);
  const fullName = `${cafe.identity.planNameLine1} ${cafe.identity.planNameLine2}`.trim();
  const features = cafe.features;
  const anyFSA = features.healthFSA || features.limitedPurposeFSA || features.postDeductibleFSA || features.dcap || features.adoptionAssistanceFSA;

  const p: Paragraph[] = [];

  // ===== TITLE PAGE =====
  p.push(emptyLine());
  p.push(centeredText(name.toUpperCase() || "EMPLOYER NAME", TITLE_SIZE, true));
  p.push(emptyLine());
  p.push(centeredText("CAFETERIA PLAN", SUBHEADING_SIZE, true));
  p.push(emptyLine());
  p.push(centeredText("ADOPTION AGREEMENT", SUBHEADING_SIZE, true));
  p.push(emptyLine());
  p.push(emptyLine());
  p.push(centeredText("TABLE OF CONTENTS", FONT_SIZE, true));
  p.push(emptyLine());

  const tocItems = [
    "COMPANY INFORMATION",
    "PLAN INFORMATION",
    "A.  GENERAL INFORMATION AND DEFINITIONS",
    "B.  ELIGIBILITY",
    "C.  PARTICIPATION ELECTIONS",
    ...(features.premiumConversion ? ["D.  PREMIUM CONVERSION ACCOUNT"] : []),
    ...(anyFSA ? ["E.  FLEXIBLE SPENDING ACCOUNTS"] : []),
    ...(features.hsa ? ["F.  HEALTH SAVINGS ACCOUNT (HSA Account)"] : []),
    ...(features.flexCredits ? ["G.  FLEXIBLE BENEFIT CREDITS (Flex Credits)"] : []),
    ...(features.ptoPurchaseSale ? ["H.  PURCHASE AND SALE OF PAID TIME OFF (PTO)"] : []),
    "I.  MISCELLANEOUS",
    "J.  EXECUTION PAGE",
  ];
  for (const item of tocItems) {
    p.push(body(item));
  }
  p.push(pageBreak());

  // ===== HEADER =====
  p.push(centeredText("ADOPTION AGREEMENT", SUBHEADING_SIZE, true));
  p.push(centeredText("CAFETERIA PLAN", SUBHEADING_SIZE, true));
  p.push(emptyLine());
  p.push(body("The undersigned adopting employer hereby adopts this Plan. The Plan is intended to qualify as a cafeteria plan under Code section 125. The Plan shall consist of this Adoption Agreement, its related Basic Plan Document and any related Appendix and Addendum to the Adoption Agreement. Unless otherwise indicated, all Section references are to Sections in the Basic Plan Document."));
  p.push(emptyLine());

  // ===== COMPANY INFORMATION =====
  p.push(centeredText("COMPANY INFORMATION", FONT_SIZE, true));
  p.push(emptyLine());
  p.push(numberedLine("1", "Name of adopting employer (Plan Sponsor)", name));
  p.push(numberedLine("2", "Address", data.employer.streetAddress));
  p.push(numberedLine("3", "City", data.employer.city));
  p.push(numberedLine("4", "State", stateName(data.employer.state)));
  p.push(numberedLine("5", "Zip", data.employer.zipCode));
  p.push(numberedLine("6", "Phone number", data.employer.phone));
  p.push(numberedLine("7", "Fax number", cafe.identity.faxNumber));
  p.push(numberedLine("8", "Plan Sponsor EIN", data.employer.ein));
  p.push(numberedLine("9", "Plan Sponsor fiscal year end", data.employer.fiscalYearEnd));

  // 10. Entity Type
  p.push(new Paragraph({
    spacing: { before: 100, after: 40 },
    children: [
      new TextRun({ text: "10.  Entity Type:", font: FONT, size: FONT_SIZE, bold: true }),
    ],
  }));
  p.push(body("a.  Plan Sponsor entity type:", { indent: true }));
  ENTITY_TYPE_ORDER.forEach((et, idx) => {
    const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"][idx];
    p.push(checkboxLine(
      data.employer.entityType === et,
      `${roman}.  ${ENTITY_TYPE_LABELS[et]}`,
      { indent: 1 }
    ));
  });

  p.push(numberedLine("11", "State of organization of Plan Sponsor", stateOfOrg));

  p.push(subheading("12.  Controlled Groups / Affiliated Service Groups"));
  p.push(checkboxLine(
    cafe.identity.affiliatedServiceGroup,
    "The Plan Sponsor is a member of an affiliated service group. List members:",
    { indent: 1 }
  ));
  if (cafe.identity.affiliatedServiceGroup && cafe.identity.affiliatedServiceGroupMembers) {
    p.push(body(cafe.identity.affiliatedServiceGroupMembers, { indent: true }));
  }

  p.push(subheading("13.  Controlled Groups"));
  p.push(checkboxLine(
    cafe.identity.controlledGroup,
    "The Plan Sponsor is a member of a controlled group. List members:",
    { indent: 1 }
  ));
  if (cafe.identity.controlledGroup && cafe.identity.controlledGroupMembers) {
    p.push(body(cafe.identity.controlledGroupMembers, { indent: true }));
  }
  p.push(noteText("Affiliated service group members and controlled group members may adopt the Plan with the approval of the Plan Sponsor. Listing them is for information purposes only and is optional."));

  // ===== PLAN INFORMATION =====
  p.push(emptyLine());
  p.push(centeredText("PLAN INFORMATION", FONT_SIZE, true));
  p.push(emptyLine());

  // ===== A. GENERAL INFORMATION AND DEFINITIONS =====
  p.push(legalSection("A", "General Information and Definitions"));
  p.push(numberedLine("1", "Plan Number", cafe.identity.planNumber));
  p.push(subheading("2.  Plan Name:"));
  p.push(body(`a.  ${cafe.identity.planNameLine1}`, { indent: true }));
  p.push(body(`b.  ${cafe.identity.planNameLine2}`, { indent: true }));
  p.push(numberedLine("3", "Effective Date", effective));
  p.push(checkboxLine(
    cafe.identity.isRestatement,
    "a.  Is this a restatement of a previously-adopted plan?",
    { indent: 1 }
  ));
  if (cafe.identity.isRestatement && cafe.identity.restatementDate) {
    p.push(body(`b.  Effective date of Plan restatement: ${formatDate(cafe.identity.restatementDate)} ("Restatement Date")`, { indent: true }));
  }

  p.push(subheading("4.  Plan Year:"));
  p.push(body(`a.  Plan Years mean each 12-consecutive month period ending on ${cafe.identity.planYearEndDate} (e.g. December 31). If the Plan Year changes, any special provisions regarding a short Plan Year shall be placed in the Addendum to the Adoption Agreement.`, { indent: true }));
  p.push(checkboxLine(
    cafe.identity.shortPlanYear,
    `b.  The Plan has a short Plan Year. The short Plan Year begins ${cafe.identity.shortPlanYearStart || "_____"} and ends ${cafe.identity.shortPlanYearEnd || "_____"}.`,
    { indent: 1 }
  ));

  p.push(subheading("Plan Features"));
  p.push(body("5.  The following Benefits are available under the Plan:", { bold: true }));
  const featureRows: { key: keyof typeof features; label: string }[] = [
    { key: "premiumConversion", label: "Premium Conversion Account" },
    { key: "healthFSA", label: "Health Flexible Spending Account" },
    { key: "limitedPurposeFSA", label: "Limited Purpose HSA-Compatible Health Flexible Spending Account" },
    { key: "postDeductibleFSA", label: "Post-Deductible HSA-Compatible Health Flexible Spending Account" },
    { key: "dcap", label: "Dependent Care Assistance Plan Account" },
    { key: "adoptionAssistanceFSA", label: "Adoption Assistance Flexible Spending Account" },
    { key: "hsa", label: "Health Savings Account" },
    { key: "flexCredits", label: "Flexible Benefits Credits" },
    { key: "ptoPurchaseSale", label: "PTO Purchase/Sale" },
  ];
  featureRows.forEach((f, idx) => {
    const letter = String.fromCharCode("a".charCodeAt(0) + idx);
    p.push(checkboxLine(features[f.key], `${letter}.  ${f.label}`, { indent: 1 }));
  });

  p.push(subheading("6.  Simple Cafeteria Plan"));
  p.push(checkboxLine(
    cafe.simpleCafeteriaPlan.enabled,
    "a.  The Plan is intended to qualify as a simple cafeteria plan under Code section 125(j).",
    { indent: 1 }
  ));
  p.push(body("b.  The Employer shall make contributions to the Plan as follows:", { indent: true }));
  p.push(checkboxLine(
    cafe.simpleCafeteriaPlan.enabled && cafe.simpleCafeteriaPlan.contributionType === "compensation_pct",
    `i.  ${cafe.simpleCafeteriaPlan.compensationPct || "_____"}% (no less than 2%) of an Eligible Employee's Compensation for the Plan Year.`,
    { indent: 2 }
  ));
  p.push(checkboxLine(
    cafe.simpleCafeteriaPlan.enabled && cafe.simpleCafeteriaPlan.contributionType === "salary_match",
    `ii.  ${cafe.simpleCafeteriaPlan.salaryMatchPct || "_____"}% (at least 200%) of an Eligible Employee's salary reduction contribution for the Plan Year, but no less than 6% of the Eligible Employee's Compensation for the Plan Year.`,
    { indent: 2 }
  ));

  // ===== B. ELIGIBILITY =====
  p.push(pageBreak());
  p.push(legalSection("B", "Eligibility"));
  p.push(subheading("Eligible Employees - Employees must meet the following requirements:"));
  p.push(numberedLine("1", "Minimum age requirement for an Employee to become an Eligible Employee", String(cafe.eligibility.minAge)));
  p.push(noteText("If the Plan is intended to be a simple cafeteria plan under Article 12, B.1 may not exceed \"21.\""));

  p.push(subheading("2a.  An Employee must complete the following service requirements to become an Eligible Employee on the date set forth in B.2b:"));
  const sr = cafe.eligibility.serviceRequirementType;
  const srAmt = cafe.eligibility.serviceRequirementAmount;
  p.push(checkboxLine(sr === "none", "i.  None", { indent: 1 }));
  p.push(checkboxLine(sr === "hours", `ii.  Completion of ${sr === "hours" ? srAmt : "_____"} hours of service.`, { indent: 1 }));
  p.push(checkboxLine(sr === "days", `iii.  Completion of ${sr === "days" ? srAmt : "_____"} days of service.`, { indent: 1 }));
  p.push(checkboxLine(sr === "months", `iv.  Completion of ${sr === "months" ? srAmt : "_____"} months of service.`, { indent: 1 }));
  p.push(checkboxLine(sr === "years", `v.  Completion of ${sr === "years" ? srAmt : "_____"} years of service.`, { indent: 1 }));
  p.push(noteText("If the Plan is a simple cafeteria plan under Article 12, B.2 may not exceed 1,000 hours of service or one year of service."));

  p.push(subheading("2b.  Effective Date of Eligibility. An Employee will become an Eligible Employee on the date below upon completing the age and service requirements in B.1 and B.2a:"));
  const ed = cafe.eligibility.eligibilityDateRule;
  p.push(checkboxLine(ed === "immediate", "i.  An Employee shall become an Eligible Employee immediately upon completing the age and service requirements in B.1 and B.2a.", { indent: 1 }));
  p.push(checkboxLine(ed === "first_of_month", "ii.  first day of each calendar month.", { indent: 1 }));
  p.push(checkboxLine(ed === "first_of_quarter", "iii.  first day of each plan quarter.", { indent: 1 }));
  p.push(checkboxLine(ed === "first_of_first_or_seventh_month", "iv.  first day of the first month and seventh month of the Plan Year.", { indent: 1 }));
  p.push(checkboxLine(ed === "first_of_plan_year", "v.  first day of the Plan Year.", { indent: 1 }));

  p.push(subheading("2c.  If eligibility is not immediate after meeting age and service requirements, an Employee shall become an Eligible Employee on the Eligibility Date in B.1 and B.2b that is:"));
  p.push(checkboxLine(cafe.eligibility.eligibilityCoincidence === "coincident", "i.  coincident with or next following the period in B.2b", { indent: 1 }));
  p.push(checkboxLine(cafe.eligibility.eligibilityCoincidence === "following", "ii.  following the completion of the period in B.2b.", { indent: 1 }));

  p.push(numberedLine("3", "Describe any other modifications to the eligibility rules specified in B.1 and B.2", cafe.eligibility.eligibilityModifications, { valueBold: false }));

  p.push(subheading("Excluded Employees"));
  p.push(body("4.  The term \"Eligible Employee\" shall not include:", { bold: true }));
  p.push(checkboxLine(cafe.exclusions.excludeUnion, "a.  Union Employees. Any Employee who is included in a unit of Employees covered by a collective bargaining agreement, if benefits were the subject of good faith bargaining between employee representatives and the Employer, and if the collective bargaining agreement does not provide for participation in this Plan.", { indent: 1 }));
  p.push(checkboxLine(cafe.exclusions.excludeLeased, "b.  Leased Employees.", { indent: 1 }));
  p.push(checkboxLine(cafe.exclusions.excludeNonResidentAliens, "c.  Non-Resident Aliens. Any Employee who is a non-resident alien described in Code section 410(b)(3)(C).", { indent: 1 }));
  p.push(checkboxLine(cafe.exclusions.excludePartTime, `d.  Part-time Employees. Any Employee who is expected to work fewer than ${cafe.exclusions.partTimeHoursThreshold || "30"} hours per week.`, { indent: 1 }));
  p.push(checkboxLine(cafe.exclusions.excludeOther, `e.  Other.  ${cafe.exclusions.excludeOtherDescription} (any exclusion must satisfy Code section 125(g) and the requirements under Article 13).`, { indent: 1 }));
  p.push(noteText("If the Plan is intended to be a simple cafeteria plan, B.4b, B.4d and B.4e may be selected only to the extent that the provisions do not violate the requirements on Code section 125(j)."));

  p.push(checkboxLine(
    !!cafe.exclusions.definitionModifications,
    `5.  Describe any modifications to the definition of the term "Eligible Employee" for the specified Plan Benefit:  ${cafe.exclusions.definitionModifications}`,
    { indent: 0 }
  ));

  // FMLA
  p.push(subheading("Leave of Absence under FMLA"));
  p.push(body("6.  If a Participant takes an unpaid leave of absence under FMLA, the Participant may elect the following with respect to the health Benefits under the Plan (i.e., Premium Conversion Account, Health FSA, and Limited Purpose Health FSA) (select at least one):"));
  p.push(checkboxLine(cafe.leave.fmlaRevokeAllowed, "a.  Revoke coverage, which will be reinstated under the same terms upon the Participant's return from the FMLA leave of absence.", { indent: 1 }));
  p.push(checkboxLine(cafe.leave.fmlaContinueAllowed, "b.  Continue coverage but discontinue payment of his or her contribution for the period of the FMLA leave of absence.", { indent: 1 }));

  p.push(checkboxLine(
    cafe.leave.fmlaRecoverContributions && cafe.leave.fmlaContinueAllowed,
    "7.  If B.6b. is selected, the Employer may recover the Participant's suspended contributions when the Participant returns to work from the FMLA leave of absence.",
    { indent: 0 }
  ));

  p.push(body("8.  A Participant on leave of absence under FMLA (select only one):", { bold: true }));
  p.push(checkboxLine(cafe.leave.fmlaCoverageScope === "all_benefits", "a.  may continue coverage for all Benefits for which he is eligible when on FMLA leave, including non-health Benefits.", { indent: 1 }));
  p.push(checkboxLine(cafe.leave.fmlaCoverageScope === "health_only", "b.  may only continue coverage for Premium Conversion Accounts, Health FSA, and Limited Purpose Health FSA, as applicable.", { indent: 1 }));

  p.push(body("9.  A Participant who continues coverage for Benefits while on FMLA leave of absence may make contributions for such Benefits as follows (select at least one):", { bold: true }));
  p.push(checkboxLine(cafe.leave.fmlaPaymentMethods.includes("pre_pay"), "a.  pre-pay on a pre-tax (to the extent permissible under Code section 125) or after-tax basis, prior to commencement of the FMLA leave of absence period, the contributions due for the FMLA leave of absence period", { indent: 1 }));
  p.push(checkboxLine(cafe.leave.fmlaPaymentMethods.includes("on_schedule"), "b.  pay on an after-tax basis the same schedule as payments would have been made if the Participant were not on a leave of absence or if contributions were being made under COBRA", { indent: 1 }));
  p.push(checkboxLine(cafe.leave.fmlaPaymentMethods.includes("repay"), "c.  to the extent agreed in advance, the Participant will repay amounts advanced by the Employer to the Plan on behalf of the Participant upon the Participant's return from the FMLA leave of absence", { indent: 1 }));
  p.push(noteText("B.9a may only be elected together with B.9.b or B.9c. B.9b must be elected if available for non-FMLA leaves of absence. B.9c may only be elected together with B.9a and/or B.9b unless it is the only option available to Participants on a non-FMLA leave of absence."));

  // Non-FMLA
  p.push(subheading("Non-FMLA"));
  p.push(checkboxLine(
    cafe.leave.nonFmlaContinuationAllowed,
    "10.  A Participant may elect to continue coverage of Benefits when on unpaid non-FMLA leave of absence.",
    { indent: 0 }
  ));

  // Termination
  p.push(subheading("Termination of Participation"));
  p.push(body("11.  If a Participant remains an Employee but is no longer an Eligible Employee, his or her participation in the Plan shall terminate:", { bold: true }));
  const td = cafe.leave.terminationParticipationDate;
  p.push(checkboxLine(td === "last_day_employment", "a.  on the last day of employment during which the Participant ceases to be an Eligible Employee", { indent: 1 }));
  p.push(checkboxLine(td === "last_day_payroll", "b.  on the last day of the payroll period during which the Participant ceases to be an Eligible Employee", { indent: 1 }));
  p.push(checkboxLine(td === "last_day_month", "c.  on the last day of the month during which the Participant ceases to be an Eligible Employee", { indent: 1 }));
  p.push(checkboxLine(td === "last_day_plan_year", "d.  on the last day of the Plan Year during which the Participant ceases to be an Eligible Employee", { indent: 1 }));
  p.push(checkboxLine(td === "other", `e.  Other  ${cafe.leave.terminationParticipationOther}`, { indent: 1 }));

  p.push(subheading("Reemployment"));
  p.push(body("12.  If an Eligible Employee has a Termination of Employment and is subsequently reemployed by the Employer as an Eligible Employee within 30 days after Termination:", { bold: true }));
  p.push(checkboxLine(cafe.leave.reemploymentWithin30 === "reinstate", "a.  the Plan Administrator shall automatically reinstate the Benefit elections in effect at the time of Termination", { indent: 1 }));
  p.push(checkboxLine(cafe.leave.reemploymentWithin30 === "wait_until_next_year", "b.  the Eligible Employee shall not resume or become a Participant until the first day of the subsequent Plan Year", { indent: 1 }));
  p.push(body("13.  If an Eligible Employee has a Termination of Employment and is subsequently reemployed by the Employer as an Eligible Employee more than 30 days after Termination:", { bold: true }));
  p.push(checkboxLine(cafe.leave.reemploymentAfter30 === "reinstate", "a.  the Plan Administrator shall automatically reinstate the Benefit elections in effect at the time of Termination", { indent: 1 }));
  p.push(checkboxLine(cafe.leave.reemploymentAfter30 === "wait_until_next_year", "b.  the Eligible Employee shall not resume or become a Participant until the first day of the subsequent Plan Year", { indent: 1 }));
  p.push(checkboxLine(cafe.leave.reemploymentAfter30 === "employee_choice", "c.  the Eligible Employee may elect to reinstate the Benefit election in effect at the time of Termination or make a new election under the Plan", { indent: 1 }));

  // ===== C. PARTICIPATION ELECTIONS =====
  p.push(legalSection("C", "Participation Elections"));
  p.push(subheading("Failure to Elect (Default Elections)"));
  p.push(body("1.  The election for the immediately preceding Plan Year relating to the following Benefits will apply to the applicable Plan Year:", { bold: true }));
  p.push(checkboxLine(cafe.participation.defaultElections.premiumConversion && features.premiumConversion, "a.  Premium Conversion Account (Non-Employer-sponsored Contracts)", { indent: 1 }));
  p.push(checkboxLine(cafe.participation.defaultElections.healthFSA && features.healthFSA, "b.  Health Flexible Spending Account", { indent: 1 }));
  p.push(checkboxLine(cafe.participation.defaultElections.limitedPurposeFSA && (features.limitedPurposeFSA || features.postDeductibleFSA), "c.  Limited Purpose/Post-Deductible Health Flexible Spending Account (HSA-Compatible FSAs)", { indent: 1 }));
  p.push(checkboxLine(cafe.participation.defaultElections.dcap && features.dcap, "d.  Dependent Care Assistance Plan Account", { indent: 1 }));
  p.push(checkboxLine(cafe.participation.defaultElections.hsa && features.hsa, "e.  Health Savings Account", { indent: 1 }));
  p.push(checkboxLine(cafe.participation.defaultElections.adoptionAssistanceFSA && features.adoptionAssistanceFSA, "f.  Adoption Assistance Flexible Spending Account", { indent: 1 }));
  p.push(noteText("If a Benefit is not selected, an Eligible Employee who does not make an affirmative election under the Plan for a Plan Year will be deemed to have elected not to participate in that Benefit for the Plan Year."));

  p.push(subheading("Change in Status"));
  p.push(body("2.  An Eligible Employee may change his or her election upon the following Change in Status events:", { bold: true }));
  p.push(checkboxLine(cafe.participation.changeInStatusEvents === "none", "a.  None", { indent: 1 }));
  p.push(checkboxLine(cafe.participation.changeInStatusEvents === "treas_reg_125_4", "b.  Any event described in Treas. Reg. section 1.125-4 and other events permitted by IRS guidance", { indent: 1 }));
  p.push(checkboxLine(cafe.participation.changeInStatusEvents === "admin_procedures", "c.  Pursuant to written Plan Administrative Procedures, which are incorporated herein by reference", { indent: 1 }));
  p.push(checkboxLine(cafe.participation.changeInStatusEvents === "other", `d.  Other:  ${cafe.participation.changeInStatusOther}`, { indent: 1 }));

  p.push(body("3.  Permit Participants to revoke an election of coverage under a group health plan:", { bold: true }));
  p.push(checkboxLine(cafe.participation.marketplaceFamilyEnrollment, "a.  due to enrollment of a family member in a qualified health plan offered through a Marketplace established under section 1311 of the Patient Protection and Affordable Care Act (Section 4.03(s)).", { indent: 1 }));
  p.push(noteText("The group health plan may not be a health FSA and must provide minimum essential coverage (as defined in Code section 5000A(f)(1))."));

  // ===== D. PREMIUM CONVERSION ACCOUNT =====
  if (features.premiumConversion) {
    p.push(legalSection("D", "Premium Conversion Account"));
    p.push(subheading("Contracts for Reimbursement"));
    p.push(noteText("If Premium Conversion Account is not a selected Benefit under A.5a, Section D is disregarded."));
    p.push(body("1.  If Premium Conversion Accounts are allowed under the Plan, select the types of Contracts with respect to which a Participant may contribute under Section 5.04:", { bold: true }));
    const ct = cafe.premiumConversion.contractTypes;
    const contractRows: { key: keyof typeof ct; letter: string; label: string }[] = [
      { key: "employerHealth", letter: "a", label: "Employer Health" },
      { key: "employerDental", letter: "b", label: "Employer Dental" },
      { key: "employerVision", letter: "c", label: "Employer Vision" },
      { key: "employerSTD", letter: "d", label: "Employer Short-Term Disability" },
      { key: "employerLTD", letter: "e", label: "Employer Long-Term Disability" },
      { key: "employerGroupTermLife", letter: "f", label: "Employer Group Term Life" },
      { key: "employerADD", letter: "g", label: "Employer Accidental Death & Dismemberment" },
      { key: "individualDental", letter: "h", label: "Individually-Owned Dental" },
      { key: "individualVision", letter: "i", label: "Individually-Owned Vision" },
      { key: "individualDisability", letter: "j", label: "Individually-Owned Disability" },
      { key: "cobra", letter: "k", label: "COBRA continuation coverage under the Employer group health plan" },
    ];
    contractRows.forEach((row) => {
      p.push(checkboxLine(ct[row.key] as boolean, `${row.letter}.  ${row.label}`, { indent: 1 }));
    });
    p.push(checkboxLine(ct.other, `l.  Other:  ${ct.otherDescription}`, { indent: 1 }));

    p.push(subheading("Enrollment"));
    p.push(checkboxLine(
      cafe.premiumConversion.autoEnroll,
      "2.  All Employees will automatically be enrolled in the Premium Conversion Account upon their date of hire and will be deemed to have elected to contribute the entire amount of any premiums payable by the Employee during the Plan Year for participation in Employer-sponsored Contract(s).",
      { indent: 0 }
    ));
    p.push(noteText("If D.2 is not selected, Eligible Employees may only elect to participate in the Premium Conversion Account pursuant to Section 4.02(b), 4.02(c) and Section 4.03 of the Plan."));

    p.push(subheading("Contributions"));
    p.push(checkboxLine(
      cafe.premiumConversion.autoAdjust,
      "3.  Participant elections will be automatically adjusted for changes in the cost of Employer-sponsored Contracts pursuant to the terms of Treas. Reg. 1.125-4(f)(2)(i).",
      { indent: 0 }
    ));
  }

  // ===== E. FLEXIBLE SPENDING ACCOUNTS =====
  if (anyFSA) {
    p.push(legalSection("E", "Flexible Spending Accounts"));
    p.push(noteText("If Flexible Spending Accounts are not a permitted Benefit under A.5b, Section E is disregarded."));

    p.push(subheading("Contribution Limits"));
    p.push(body("3.  Contribution Limits. Select the maximum allowable Participant contribution to the applicable FSA in any Plan Year:", { bold: true }));
    p.push(checkboxLine(cafe.fsa.contributionLimitMode === "code_max", "a.  The maximum amount permitted under Code section 125(i), 129(a)(2) and/or 137(b)(1)", { indent: 1 }));
    p.push(checkboxLine(cafe.fsa.contributionLimitMode === "other_amount", "b.  Other amounts", { indent: 1 }));
    if (cafe.fsa.contributionLimitMode === "other_amount") {
      if (features.healthFSA) p.push(body(`i.  Health Flexible Spending Account: $${cafe.fsa.healthFSALimit}`, { indent: true }));
      if (features.limitedPurposeFSA || features.postDeductibleFSA) p.push(body(`ii.  Limited Purpose/Post-Deductible Health Flexible Spending Account (HSA-Compatible FSA): $${cafe.fsa.limitedPurposeFSALimit}`, { indent: true }));
      if (features.dcap) p.push(body(`iii.  Dependent Care Assistance Plan Account: $${cafe.fsa.dcapLimit}`, { indent: true }));
      if (features.adoptionAssistanceFSA) p.push(body(`iv.  Adoption Assistance Flexible Spending Account: $${cafe.fsa.adoptionAssistanceLimit}`, { indent: true }));
    }
    p.push(noteText("Other amounts for Health FSA cannot exceed the Code section 125(i) maximum. DCAP cannot exceed Code 129(a)(2). Adoption Assistance cannot exceed Code section 137(b)(1) maximum."));

    p.push(subheading("Eligible Expenses"));
    p.push(body("4.  Individual Expenses Eligible for Reimbursement. Participant may only be reimbursed from the applicable FSA for expenses that are incurred by:", { bold: true }));
    p.push(checkboxLine(cafe.fsa.eligiblePersons === "participant_spouse_dep", "a.  Participant, spouse and Dependents (and any child of the Participant until his or her 26th birthday).", { indent: 1 }));
    p.push(checkboxLine(cafe.fsa.eligiblePersons === "covered_under_employer", "b.  Persons covered under Employer-sponsored group health plan.", { indent: 1 }));
    p.push(checkboxLine(cafe.fsa.eligiblePersons === "participant_only", "c.  Participants only.", { indent: 1 }));
    p.push(checkboxLine(cafe.fsa.eligiblePersons === "other", `d.  Other: ${cafe.fsa.eligiblePersonsOther}`, { indent: 1 }));

    p.push(body("6.  Adult Children Coverage. Reimbursement for adult children may be paid from the applicable FSA for claims incurred:", { bold: true }));
    p.push(checkboxLine(cafe.fsa.adultChildrenAge === "until_26", "a.  until the date the child attains age 26", { indent: 1 }));
    p.push(checkboxLine(cafe.fsa.adultChildrenAge === "until_end_of_year_26", "b.  until the last day of the calendar year in which the child attains age 26", { indent: 1 }));

    p.push(subheading("Grace Period"));
    p.push(body("8.  The Plan will reimburse claims incurred during a Grace Period immediately following the end of the Plan Year for the following Benefits:", { bold: true }));
    if (features.healthFSA) p.push(checkboxLine(cafe.fsa.gracePeriodHealthFSA, "a.  Health Flexible Spending Account", { indent: 1 }));
    if (features.limitedPurposeFSA || features.postDeductibleFSA) p.push(checkboxLine(cafe.fsa.gracePeriodLimitedFSA, "b.  Limited Purpose/Post-Deductible Health Flexible Spending Account (HSA-Compatible FSA)", { indent: 1 }));
    if (features.dcap) p.push(checkboxLine(cafe.fsa.gracePeriodDcap, "c.  Dependent Care Assistance Plan Account", { indent: 1 }));
    if (features.adoptionAssistanceFSA) p.push(checkboxLine(cafe.fsa.gracePeriodAdoption, "d.  Adoption Assistance Flexible Spending Account", { indent: 1 }));
    p.push(noteText("The Plan cannot reimburse claims incurred during a Grace Period if carryovers are permitted in Part E.13."));

    p.push(body("9.  Last day of Grace Period:", { bold: true }));
    p.push(checkboxLine(cafe.fsa.gracePeriodEnd === "fifteenth_third_month", "a.  Fifteenth day of the 3rd month following end of the Plan Year", { indent: 1 }));
    p.push(checkboxLine(cafe.fsa.gracePeriodEnd === "other", `b.  Other  ${cafe.fsa.gracePeriodOther}`, { indent: 1 }));

    p.push(subheading("Run Out Period"));
    p.push(body("10.  If no Grace Period applies for the Plan Year, an active Participant must submit claims for the Plan Year for reimbursement from the applicable FSA no later than:", { bold: true }));
    p.push(checkboxLine(!!cafe.fsa.runOutDays, `a.  ${cafe.fsa.runOutDays || "_____"} days after the end of the Plan Year`, { indent: 1 }));
    p.push(checkboxLine(!!cafe.fsa.runOutDate, `b.  ${cafe.fsa.runOutDate || "_____"} (insert date, e.g., March 31) immediately following such Plan Year`, { indent: 1 }));

    if (features.healthFSA || features.limitedPurposeFSA || features.postDeductibleFSA) {
      p.push(subheading("Carryover"));
      p.push(body("13.  The Plan will carry over unused Health FSA balances at the end of the Plan Year for the following Benefits:", { bold: true }));
      if (features.healthFSA) {
        p.push(checkboxLine(cafe.fsa.carryoverHealthFSA, "a.  Health Flexible Spending Account", { indent: 1 }));
        if (cafe.fsa.carryoverHealthFSA) {
          p.push(checkboxLine(cafe.fsa.carryoverHealthFSAMode === "max_indexed", "i.  Maximum amount, as indexed", { indent: 2 }));
          p.push(checkboxLine(cafe.fsa.carryoverHealthFSAMode === "other", `ii.  Other:  ${cafe.fsa.carryoverHealthFSAOther}`, { indent: 2 }));
        }
      }
      if (features.limitedPurposeFSA || features.postDeductibleFSA) {
        p.push(checkboxLine(cafe.fsa.carryoverLimitedFSA, "b.  Limited Purpose/Post-Deductible Health Flexible Spending Account (HSA-Compatible FSA)", { indent: 1 }));
        if (cafe.fsa.carryoverLimitedFSA) {
          p.push(checkboxLine(cafe.fsa.carryoverLimitedFSAMode === "max_indexed", "i.  Maximum amount, as indexed", { indent: 2 }));
          p.push(checkboxLine(cafe.fsa.carryoverLimitedFSAMode === "other", `ii.  Other:  ${cafe.fsa.carryoverLimitedFSAOther}`, { indent: 2 }));
        }
      }
      p.push(noteText("If carryover is selected, the Plan may not provide for a Grace Period for the applicable FSA."));
    }

    p.push(subheading("Termination of Employment"));
    p.push(body("14.  In the event of a Termination of Employment the Participant may elect to continue to make contributions to FSAs under the Plan on an after-tax basis and reimbursements will be allowed for the remainder of the Plan Year.", { bold: true }));
    p.push(checkboxLine(cafe.fsa.terminationContinuation === "yes", "a.  Yes", { indent: 1 }));
    p.push(checkboxLine(cafe.fsa.terminationContinuation === "yes_limited", `b.  Yes - subject to the following limitations:  ${cafe.fsa.terminationLimitations}`, { indent: 1 }));
    p.push(checkboxLine(cafe.fsa.terminationContinuation === "no", "c.  No", { indent: 1 }));

    p.push(body("15.  In the event of a Termination of Employment, a Participant may submit claims for reimbursement from the applicable FSA no later than:", { bold: true }));
    p.push(checkboxLine(!!cafe.fsa.terminationClaimsDays, `a.  ${cafe.fsa.terminationClaimsDays || "_____"} days after a Termination of Employment.`, { indent: 1 }));
    p.push(checkboxLine(!!cafe.fsa.terminationClaimsAfterPlanYearDays, `b.  ${cafe.fsa.terminationClaimsAfterPlanYearDays || "_____"} days following the Plan Year in which the Termination occurs.`, { indent: 1 }));

    if (features.healthFSA) {
      p.push(subheading("Qualified Reservist Distributions"));
      p.push(checkboxLine(cafe.fsa.qualifiedReservistEnabled, "16.  Qualified Reservist Distributions are available for:", { indent: 0 }));
      if (cafe.fsa.qualifiedReservistEnabled) {
        p.push(checkboxLine(cafe.fsa.qualifiedReservistMode === "entire_amount", "a.  The entire amount elected for the applicable Health FSA for the Plan Year minus applicable Health FSA reimbursements received as of the date of the Qualified Reservist Distribution request.", { indent: 1 }));
        p.push(checkboxLine(cafe.fsa.qualifiedReservistMode === "contributed_amount", "b.  The amount contributed to the applicable Health FSA as of the date of the Qualified Reservist Distribution request minus applicable FSA reimbursements received as of the date of the Qualified Reservist Distribution request.", { indent: 1 }));
        p.push(checkboxLine(cafe.fsa.qualifiedReservistMode === "other", `c.  Other amount: ${cafe.fsa.qualifiedReservistOther}`, { indent: 1 }));
      }
    }
  }

  // ===== F. HEALTH SAVINGS ACCOUNT =====
  if (features.hsa) {
    p.push(legalSection("F", "Health Savings Account (HSA Account) (Article 9)"));
    p.push(noteText("If HSA Account is not a permitted Benefit under A.5g, Section F is disregarded."));

    p.push(subheading("Employer Contributions"));
    p.push(body("1.  Matching Contributions. The Plan permits Employer matching contributions to the HSA Account as follows (not to exceed the limits in Section 9.04):", { bold: true }));
    const hsa = cafe.hsa;
    p.push(checkboxLine(hsa.matchingFormula === "none", "a.  None", { indent: 1 }));
    p.push(checkboxLine(hsa.matchingFormula === "discretionary", "b.  Discretionary", { indent: 1 }));
    p.push(checkboxLine(hsa.matchingFormula === "pct_of_contribution_pct", `c.  ${hsa.matchingPct || "_____"}% of the Participant's elected HSA Account contribution up to ${hsa.matchingComplementPct || "_____"}% of the Participant's Compensation`, { indent: 1 }));
    p.push(checkboxLine(hsa.matchingFormula === "pct_of_contribution_dollar", `d.  ${hsa.matchingPct || "_____"}% of the Participant's elected HSA Account contribution up to $${hsa.matchingComplementDollar || "_____"}`, { indent: 1 }));
    p.push(checkboxLine(hsa.matchingFormula === "other", `e.  Other:  ${hsa.matchingOther}`, { indent: 1 }));

    p.push(body("2.  Employer Non-Elective Contributions. The Plan permits Employer non-elective contributions to the HSA Account as follows (not to exceed the limits in Section 9.04):", { bold: true }));
    p.push(checkboxLine(hsa.nonElectiveFormula === "none", "a.  None", { indent: 1 }));
    p.push(checkboxLine(hsa.nonElectiveFormula === "discretionary", "b.  Discretionary", { indent: 1 }));
    p.push(checkboxLine(hsa.nonElectiveFormula === "pct_of_compensation", `c.  ${hsa.nonElectivePct || "_____"}% of the Participant's Compensation`, { indent: 1 }));
    p.push(checkboxLine(hsa.nonElectiveFormula === "dollar_per_employee", `d.  $${hsa.nonElectiveDollar || "_____"} per Eligible Employee`, { indent: 1 }));
    p.push(checkboxLine(hsa.nonElectiveFormula === "other", `e.  Other:  ${hsa.nonElectiveOther}`, { indent: 1 }));

    p.push(body("3.  Contribution Limits. Select the maximum allowable contribution to a Participant's HSA Account in any Plan Year:", { bold: true }));
    p.push(checkboxLine(hsa.contributionLimitMode === "code_max", "a.  The maximum amount permitted under Code section 223(b), reduced by any Employer contributions.", { indent: 1 }));
    p.push(checkboxLine(hsa.contributionLimitMode === "other_amount", `b.  Other amount:  ${hsa.contributionLimitAmount} (not to exceed the Code section 223(b) maximum when combined with any Employer contributions).`, { indent: 1 }));
  }

  // ===== G. FLEXIBLE BENEFIT CREDITS =====
  if (features.flexCredits) {
    p.push(legalSection("G", "Flexible Benefit Credits (Flex Credits) (Section 11.01)"));
    p.push(noteText("If Flexible Benefit Credits are not permitted Benefits in A.5h, Section G is disregarded."));
    const fc = cafe.flexCredits;

    p.push(subheading("Health Flex Contribution"));
    p.push(checkboxLine(fc.healthFlexContribution, "1.  Health Flex Contribution. The Flex Credit is intended to qualify as a \"health flex contribution\" under Treas. Reg. section 1.5000A-3(e)(3)(ii)(E)", { indent: 0 }));

    p.push(body("2.  Eligible Benefits. Participants may elect to contribute the Flex Credits to the following benefits:", { bold: true }));
    p.push(checkboxLine(fc.eligibleScope === "all_benefits", "a.  All Benefits offered under the Plan", { indent: 1 }));
    p.push(checkboxLine(fc.eligibleScope === "all_except", `b.  All Benefits offered under the Plan except the following:  ${fc.eligibleScopeExceptions}`, { indent: 1 }));
    p.push(checkboxLine(fc.eligibleScope === "only_following", `c.  Only the following Benefits:  ${fc.eligibleScopeOnly}`, { indent: 1 }));
    p.push(checkboxLine(fc.eligibleScope === "premium_health_only", "d.  Only the portion of the Premium Conversion Account paid toward Employer-sponsored Health Contract premiums and/or Health FSA or HSA-Compatible Health FSA Benefits.", { indent: 1 }));

    p.push(body("3.  Amount of Flex Credit. The Employer will contribute a Flex Credit on behalf of each Eligible Employee as follows:", { bold: true }));
    p.push(checkboxLine(fc.amountMode === "dollar", `a.  $${fc.amountDollar || "_____"} per Eligible Employee`, { indent: 1 }));
    p.push(checkboxLine(fc.amountMode === "discretionary", "b.  A discretionary amount as determined by the Employer", { indent: 1 }));
    p.push(checkboxLine(fc.amountMode === "other", `c.  Other:  ${fc.amountOther}`, { indent: 1 }));
    p.push(checkboxLine(fc.amountMode === "simple_cafeteria_match", "d.  The amount of the simple cafeteria plan contributions described in A.6b", { indent: 1 }));

    p.push(checkboxLine(fc.contribTo401k, `4.  Contribution to 401(k) Plan. An Eligible Employee may elect to contribute all or a portion of his or her Flex Credits to a Qualified Plan in accordance with the terms of the following Qualified Plan(s):  ${fc.qualifiedPlanName}`, { indent: 0 }));

    p.push(subheading("Cash Outs"));
    p.push(body("5.  Cash Out of Flex Credits. A Participant may elect to receive all or a portion of his or Flex Credits in cash.", { bold: true }));
    p.push(checkboxLine(fc.cashOutAllowed === "yes", "a.  Yes", { indent: 1 }));
    p.push(checkboxLine(fc.cashOutAllowed === "yes_limited", `b.  Yes, subject to the following limitations:  ${fc.cashOutLimitations}`, { indent: 1 }));
    p.push(checkboxLine(fc.cashOutAllowed === "no", "c.  No", { indent: 1 }));

    p.push(numberedLine("6", "Amount of Cash Out. For each Flex Credit dollar that a Participant elects to receive in cash from the Plan, the Participant will receive: $", fc.cashOutDollarValue));

    p.push(body("7.  Maximum Flex Credit Cash Out. The amount of cash a Participant may receive in exchange for Flex Credits in Plan Year shall not exceed:", { bold: true }));
    p.push(checkboxLine(fc.maxCashOut === "no_limit", "a.  No limit", { indent: 1 }));
    p.push(checkboxLine(fc.maxCashOut === "per_year_amount", `b.  $${fc.maxCashOutAmount || "_____"} per calendar year`, { indent: 1 }));
    p.push(checkboxLine(fc.maxCashOut === "other", `c.  Other:  ${fc.maxCashOutOther}`, { indent: 1 }));

    p.push(body("8.  Payment of Cash Out. Amounts distributed in cash from the Plan pursuant to Section 11.03 shall be paid to the Participant in:", { bold: true }));
    p.push(checkboxLine(fc.cashOutPayment === "payroll_installments", "a.  Equal payroll installments", { indent: 1 }));
    p.push(checkboxLine(fc.cashOutPayment === "lump_sum_start", "b.  A single lump sum at the beginning of the Plan Year", { indent: 1 }));
    p.push(checkboxLine(fc.cashOutPayment === "lump_sum_end", "c.  A single lump sum at the end of the Plan Year", { indent: 1 }));
    p.push(checkboxLine(fc.cashOutPayment === "other", `d.  Other:  ${fc.cashOutPaymentOther}`, { indent: 1 }));
  }

  // ===== H. PURCHASE AND SALE OF PTO =====
  if (features.ptoPurchaseSale) {
    p.push(legalSection("H", "Purchase and Sale of Paid Time Off (PTO) (Section 11.02)"));
    const pto = cafe.pto;
    p.push(subheading("Purchase of PTO"));
    p.push(body("1.  Maximum PTO Purchase. A Participant can elect to purchase no more than the following periods of PTO in a Plan Year:", { bold: true }));
    p.push(checkboxLine(pto.maxPurchaseType === "none", "a.  None", { indent: 1 }));
    p.push(checkboxLine(pto.maxPurchaseType === "hours", `b.  ${pto.maxPurchaseAmount || "_____"} hours`, { indent: 1 }));
    p.push(checkboxLine(pto.maxPurchaseType === "days", `c.  ${pto.maxPurchaseAmount || "_____"} days`, { indent: 1 }));
    p.push(checkboxLine(pto.maxPurchaseType === "weeks", `d.  ${pto.maxPurchaseAmount || "_____"} weeks`, { indent: 1 }));
    p.push(checkboxLine(pto.maxPurchaseType === "other", `e.  Other:  ${pto.maxPurchaseOther}`, { indent: 1 }));

    p.push(subheading("Sale of PTO"));
    p.push(body("2.  Maximum PTO Sale. A Participant can elect to sell no more than the following periods of PTO in a Plan Year:", { bold: true }));
    p.push(checkboxLine(pto.maxSaleType === "none", "a.  None", { indent: 1 }));
    p.push(checkboxLine(pto.maxSaleType === "hours", `b.  ${pto.maxSaleAmount || "_____"} hours`, { indent: 1 }));
    p.push(checkboxLine(pto.maxSaleType === "days", `c.  ${pto.maxSaleAmount || "_____"} days`, { indent: 1 }));
    p.push(checkboxLine(pto.maxSaleType === "weeks", `d.  ${pto.maxSaleAmount || "_____"} weeks`, { indent: 1 }));
    p.push(checkboxLine(pto.maxSaleType === "other", `e.  Other:  ${pto.maxSaleOther}`, { indent: 1 }));

    p.push(subheading("Carryover of PTO"));
    p.push(checkboxLine(pto.noCarryoverElectivePTO, "3.  No Carryover of Elective PTO. Unused elective PTO (determined as of the last day of the Plan Year) shall be paid in cash on or prior to the last day of the Plan Year.", { indent: 0 }));
    p.push(noteText("If H.3 is not selected, unused elective PTO will be forfeited as of the last day of the Plan Year."));
  }

  // ===== I. MISCELLANEOUS =====
  p.push(legalSection("I", "Miscellaneous"));
  p.push(subheading("Plan Administrator Information"));
  p.push(body("1.  Plan Administrator.", { bold: true }));
  p.push(checkboxLine(cafe.misc.planAdminType === "sponsor", "a.  Plan Sponsor", { indent: 1 }));
  p.push(checkboxLine(cafe.misc.planAdminType === "committee", "b.  Committee appointed by Plan Sponsor", { indent: 1 }));
  p.push(checkboxLine(cafe.misc.planAdminType === "other", `c.  Other:  ${cafe.misc.planAdminOther}`, { indent: 1 }));

  p.push(body("2.  Indemnification. Type of indemnification for the Plan Administrator:", { bold: true }));
  p.push(checkboxLine(cafe.misc.indemnificationType === "none", "a.  None - the Company will not indemnify the Plan Administrator.", { indent: 1 }));
  p.push(checkboxLine(cafe.misc.indemnificationType === "standard", "b.  Standard as provided in Section 14.02.", { indent: 1 }));
  p.push(checkboxLine(cafe.misc.indemnificationType === "custom", "c.  Custom. (If I.2.c. (Custom) is selected, indemnification for the Plan Administrator is provided pursuant to an Addendum to the Adoption Agreement.)", { indent: 1 }));

  p.push(numberedLine("3", "Governing Law. The following state's law shall govern the terms of the Plan to the extent not pre-empted by Federal law", govLaw));
  p.push(numberedLine("4", "Participating Employers. Additional participating employers may be specified in an addendum to the Adoption Agreement", "", { valueBold: false }));
  p.push(numberedLine("5", "State of Organization. State of organization of Plan Sponsor", stateOfOrg));
  p.push(noteText("If state law requires written document language regarding benefits herein, add language to Addendum."));

  // ===== J. EXECUTION PAGE =====
  p.push(pageBreak());
  p.push(legalSection("J", "Execution Page"));
  p.push(body("Failure to properly fill out the Adoption Agreement may result in the failure of the Plan to achieve its intended tax consequences."));
  p.push(emptyLine());
  p.push(body("The Plan shall consist of this Adoption Agreement, its related Basic Plan Document #125 and any related Appendix and Addendum to the Adoption Agreement."));
  p.push(emptyLine());
  p.push(body(`The undersigned agree to be bound by the terms of this Adoption Agreement and Basic Plan Document and acknowledge receipt of same. The Plan Sponsor caused this Plan to be executed this ____ day of ____________________, ${effective.split(", ")[1] || "20__"}.`));
  p.push(emptyLine());
  p.push(...signatureBlock(name));

  return p;
}
