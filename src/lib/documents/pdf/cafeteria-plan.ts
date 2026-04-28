import type { FormData, EntityType } from "@/types";
import { ENTITY_TYPE_LABELS } from "@/types";
import type { PDFSection } from "./pdf-builder";
import {
  bodyText, signatureBlock, emptyLine,
  centered, checkboxLine, numberedLine, legalSection, subheading, noteText,
} from "./pdf-builder";
import { formatDate, stateName } from "../helpers";

const ENTITY_TYPE_ORDER: EntityType[] = [
  "c_corp", "s_corp", "non_profit", "partnership", "llc", "llp",
  "sole_proprietorship", "union", "government", "other",
];

export function buildCafeteriaPlanPDFSections(data: FormData): PDFSection[] {
  const cafe = data.cafeteria;
  if (!cafe) return [];

  const name = data.employer.legalBusinessName;
  const effective = formatDate(data.plan.effectiveDate);
  const govLaw = stateName(data.employer.stateOfGoverningLaw);
  const stateOfOrg = stateName(data.employer.stateOfOrganization);
  const features = cafe.features;
  const anyFSA = features.healthFSA || features.limitedPurposeFSA || features.postDeductibleFSA || features.dcap || features.adoptionAssistanceFSA;

  return [
    // Title page
    { build: (ctx) => {
      ctx.y -= 100;
      centered(ctx, name.toUpperCase() || "EMPLOYER NAME", 18, true);
      ctx.y -= 20;
      centered(ctx, "CAFETERIA PLAN", 14, true);
      ctx.y -= 10;
      centered(ctx, "ADOPTION AGREEMENT", 14, true);
      ctx.y -= 30;
      centered(ctx, "TABLE OF CONTENTS", 11, true);
      ctx.y -= 10;
      const toc = [
        "COMPANY INFORMATION",
        "PLAN INFORMATION",
        "A.  GENERAL INFORMATION AND DEFINITIONS",
        "B.  ELIGIBILITY",
        "C.  PARTICIPATION ELECTIONS",
        ...(features.premiumConversion ? ["D.  PREMIUM CONVERSION ACCOUNT"] : []),
        ...(anyFSA ? ["E.  FLEXIBLE SPENDING ACCOUNTS"] : []),
        ...(features.hsa ? ["F.  HEALTH SAVINGS ACCOUNT"] : []),
        ...(features.flexCredits ? ["G.  FLEXIBLE BENEFIT CREDITS"] : []),
        ...(features.ptoPurchaseSale ? ["H.  PURCHASE AND SALE OF PTO"] : []),
        "I.  MISCELLANEOUS",
        "J.  EXECUTION PAGE",
      ];
      toc.forEach((t) => bodyText(ctx, t));
    }},

    // Header + Company info
    { build: (ctx) => {
      centered(ctx, "ADOPTION AGREEMENT", 14, true);
      centered(ctx, "CAFETERIA PLAN", 14, true);
      emptyLine(ctx);
      bodyText(ctx, "The undersigned adopting employer hereby adopts this Plan. The Plan is intended to qualify as a cafeteria plan under Code section 125. The Plan shall consist of this Adoption Agreement, its related Basic Plan Document and any related Appendix and Addendum to the Adoption Agreement.");
      emptyLine(ctx);
      centered(ctx, "COMPANY INFORMATION", 11, true);
      emptyLine(ctx);
      numberedLine(ctx, "1", "Name of adopting employer (Plan Sponsor)", name);
      numberedLine(ctx, "2", "Address", data.employer.streetAddress);
      numberedLine(ctx, "3", "City", data.employer.city);
      numberedLine(ctx, "4", "State", stateName(data.employer.state));
      numberedLine(ctx, "5", "Zip", data.employer.zipCode);
      numberedLine(ctx, "6", "Phone number", data.employer.phone);
      numberedLine(ctx, "7", "Fax number", cafe.identity.faxNumber);
      numberedLine(ctx, "8", "Plan Sponsor EIN", data.employer.ein);
      numberedLine(ctx, "9", "Plan Sponsor fiscal year end", data.employer.fiscalYearEnd);

      subheading(ctx, "10.  Entity Type:");
      bodyText(ctx, "a.  Plan Sponsor entity type:", { indent: true });
      ENTITY_TYPE_ORDER.forEach((et, idx) => {
        const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"][idx];
        checkboxLine(ctx, data.employer.entityType === et, `${roman}.  ${ENTITY_TYPE_LABELS[et]}`, { indent: 1 });
      });

      numberedLine(ctx, "11", "State of organization of Plan Sponsor", stateOfOrg);
      subheading(ctx, "12.  Controlled Groups / Affiliated Service Groups");
      checkboxLine(ctx, cafe.identity.affiliatedServiceGroup, `The Plan Sponsor is a member of an affiliated service group. Members: ${cafe.identity.affiliatedServiceGroupMembers}`, { indent: 1 });
      subheading(ctx, "13.  Controlled Groups");
      checkboxLine(ctx, cafe.identity.controlledGroup, `The Plan Sponsor is a member of a controlled group. Members: ${cafe.identity.controlledGroupMembers}`, { indent: 1 });
    }},

    // A. General Information
    { build: (ctx) => {
      legalSection(ctx, "A", "General Information and Definitions");
      numberedLine(ctx, "1", "Plan Number", cafe.identity.planNumber);
      subheading(ctx, "2.  Plan Name:");
      bodyText(ctx, `a.  ${cafe.identity.planNameLine1}`, { indent: true });
      bodyText(ctx, `b.  ${cafe.identity.planNameLine2}`, { indent: true });
      numberedLine(ctx, "3", "Effective Date", effective);
      checkboxLine(ctx, cafe.identity.isRestatement, "a.  Is this a restatement of a previously-adopted plan?", { indent: 1 });
      if (cafe.identity.isRestatement) {
        bodyText(ctx, `b.  Effective date of Plan restatement: ${formatDate(cafe.identity.restatementDate)}`, { indent: true });
      }
      subheading(ctx, "4.  Plan Year:");
      bodyText(ctx, `a.  Plan Years mean each 12-consecutive month period ending on ${cafe.identity.planYearEndDate}.`, { indent: true });
      checkboxLine(ctx, cafe.identity.shortPlanYear, `b.  The Plan has a short Plan Year. Begins ${cafe.identity.shortPlanYearStart || "_____"}, ends ${cafe.identity.shortPlanYearEnd || "_____"}.`, { indent: 1 });

      subheading(ctx, "Plan Features");
      bodyText(ctx, "5.  The following Benefits are available under the Plan:", { bold: true });
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
        checkboxLine(ctx, features[f.key], `${letter}.  ${f.label}`, { indent: 1 });
      });

      subheading(ctx, "6.  Simple Cafeteria Plan");
      checkboxLine(ctx, cafe.simpleCafeteriaPlan.enabled, "a.  The Plan is intended to qualify as a simple cafeteria plan under Code section 125(j).", { indent: 1 });
      bodyText(ctx, "b.  The Employer shall make contributions to the Plan as follows:", { indent: true });
      checkboxLine(ctx, cafe.simpleCafeteriaPlan.contributionType === "compensation_pct", `i.  ${cafe.simpleCafeteriaPlan.compensationPct || "_____"}% (no less than 2%) of an Eligible Employee's Compensation.`, { indent: 2 });
      checkboxLine(ctx, cafe.simpleCafeteriaPlan.contributionType === "salary_match", `ii.  ${cafe.simpleCafeteriaPlan.salaryMatchPct || "_____"}% (at least 200%) of salary reduction contribution, but no less than 6% of Compensation.`, { indent: 2 });
    }},

    // B. Eligibility
    { build: (ctx) => {
      legalSection(ctx, "B", "Eligibility");
      subheading(ctx, "Eligible Employees");
      numberedLine(ctx, "1", "Minimum age requirement", String(cafe.eligibility.minAge));

      subheading(ctx, "2a.  Service requirements:");
      const sr = cafe.eligibility.serviceRequirementType;
      const srAmt = cafe.eligibility.serviceRequirementAmount;
      checkboxLine(ctx, sr === "none", "i.  None", { indent: 1 });
      checkboxLine(ctx, sr === "hours", `ii.  Completion of ${sr === "hours" ? srAmt : "_____"} hours of service.`, { indent: 1 });
      checkboxLine(ctx, sr === "days", `iii.  Completion of ${sr === "days" ? srAmt : "_____"} days of service.`, { indent: 1 });
      checkboxLine(ctx, sr === "months", `iv.  Completion of ${sr === "months" ? srAmt : "_____"} months of service.`, { indent: 1 });
      checkboxLine(ctx, sr === "years", `v.  Completion of ${sr === "years" ? srAmt : "_____"} years of service.`, { indent: 1 });

      subheading(ctx, "2b.  Effective Date of Eligibility:");
      const ed = cafe.eligibility.eligibilityDateRule;
      checkboxLine(ctx, ed === "immediate", "i.  Immediately upon completing the age and service requirements.", { indent: 1 });
      checkboxLine(ctx, ed === "first_of_month", "ii.  First day of each calendar month.", { indent: 1 });
      checkboxLine(ctx, ed === "first_of_quarter", "iii.  First day of each plan quarter.", { indent: 1 });
      checkboxLine(ctx, ed === "first_of_first_or_seventh_month", "iv.  First day of the first month and seventh month of the Plan Year.", { indent: 1 });
      checkboxLine(ctx, ed === "first_of_plan_year", "v.  First day of the Plan Year.", { indent: 1 });

      subheading(ctx, "2c.  Coincidence:");
      checkboxLine(ctx, cafe.eligibility.eligibilityCoincidence === "coincident", "i.  coincident with or next following the period in B.2b", { indent: 1 });
      checkboxLine(ctx, cafe.eligibility.eligibilityCoincidence === "following", "ii.  following the completion of the period in B.2b.", { indent: 1 });

      if (cafe.eligibility.eligibilityModifications) {
        numberedLine(ctx, "3", "Other modifications", cafe.eligibility.eligibilityModifications);
      }

      subheading(ctx, "Excluded Employees");
      bodyText(ctx, "4.  The term \"Eligible Employee\" shall not include:", { bold: true });
      checkboxLine(ctx, cafe.exclusions.excludeUnion, "a.  Union Employees (covered by collective bargaining agreement).", { indent: 1 });
      checkboxLine(ctx, cafe.exclusions.excludeLeased, "b.  Leased Employees.", { indent: 1 });
      checkboxLine(ctx, cafe.exclusions.excludeNonResidentAliens, "c.  Non-Resident Aliens.", { indent: 1 });
      checkboxLine(ctx, cafe.exclusions.excludePartTime, `d.  Part-time Employees (fewer than ${cafe.exclusions.partTimeHoursThreshold || "30"} hours per week).`, { indent: 1 });
      checkboxLine(ctx, cafe.exclusions.excludeOther, `e.  Other.  ${cafe.exclusions.excludeOtherDescription}`, { indent: 1 });

      subheading(ctx, "Leave of Absence under FMLA");
      bodyText(ctx, "6.  FMLA elections (select at least one):", { bold: true });
      checkboxLine(ctx, cafe.leave.fmlaRevokeAllowed, "a.  Revoke coverage, reinstated upon return.", { indent: 1 });
      checkboxLine(ctx, cafe.leave.fmlaContinueAllowed, "b.  Continue coverage but discontinue contributions.", { indent: 1 });
      checkboxLine(ctx, cafe.leave.fmlaRecoverContributions && cafe.leave.fmlaContinueAllowed, "7.  Employer may recover suspended contributions when Participant returns from FMLA.");
      bodyText(ctx, "8.  Coverage scope on FMLA:", { bold: true });
      checkboxLine(ctx, cafe.leave.fmlaCoverageScope === "all_benefits", "a.  All Benefits available on FMLA leave.", { indent: 1 });
      checkboxLine(ctx, cafe.leave.fmlaCoverageScope === "health_only", "b.  Health Benefits only.", { indent: 1 });

      bodyText(ctx, "9.  FMLA payment methods (select at least one):", { bold: true });
      checkboxLine(ctx, cafe.leave.fmlaPaymentMethods.includes("pre_pay"), "a.  Pre-pay before commencement of leave.", { indent: 1 });
      checkboxLine(ctx, cafe.leave.fmlaPaymentMethods.includes("on_schedule"), "b.  Pay on after-tax basis on the same schedule.", { indent: 1 });
      checkboxLine(ctx, cafe.leave.fmlaPaymentMethods.includes("repay"), "c.  Employer advances and Participant repays upon return.", { indent: 1 });

      subheading(ctx, "Non-FMLA");
      checkboxLine(ctx, cafe.leave.nonFmlaContinuationAllowed, "10.  Participant may continue coverage on unpaid non-FMLA leave.");

      subheading(ctx, "Termination of Participation");
      bodyText(ctx, "11.  If a Participant remains an Employee but ceases to be eligible:", { bold: true });
      const td = cafe.leave.terminationParticipationDate;
      checkboxLine(ctx, td === "last_day_employment", "a.  Last day of employment.", { indent: 1 });
      checkboxLine(ctx, td === "last_day_payroll", "b.  Last day of payroll period.", { indent: 1 });
      checkboxLine(ctx, td === "last_day_month", "c.  Last day of the month.", { indent: 1 });
      checkboxLine(ctx, td === "last_day_plan_year", "d.  Last day of the Plan Year.", { indent: 1 });
      checkboxLine(ctx, td === "other", `e.  Other  ${cafe.leave.terminationParticipationOther}`, { indent: 1 });

      subheading(ctx, "Reemployment");
      bodyText(ctx, "12.  Reemployed within 30 days:", { bold: true });
      checkboxLine(ctx, cafe.leave.reemploymentWithin30 === "reinstate", "a.  Automatically reinstate prior elections.", { indent: 1 });
      checkboxLine(ctx, cafe.leave.reemploymentWithin30 === "wait_until_next_year", "b.  Wait until first day of subsequent Plan Year.", { indent: 1 });
      bodyText(ctx, "13.  Reemployed more than 30 days after Termination:", { bold: true });
      checkboxLine(ctx, cafe.leave.reemploymentAfter30 === "reinstate", "a.  Automatically reinstate prior elections.", { indent: 1 });
      checkboxLine(ctx, cafe.leave.reemploymentAfter30 === "wait_until_next_year", "b.  Wait until first day of subsequent Plan Year.", { indent: 1 });
      checkboxLine(ctx, cafe.leave.reemploymentAfter30 === "employee_choice", "c.  Employee may reinstate or make new election.", { indent: 1 });
    }},

    // C. Participation
    { build: (ctx) => {
      legalSection(ctx, "C", "Participation Elections");
      subheading(ctx, "Failure to Elect (Default Elections)");
      bodyText(ctx, "1.  The election for the immediately preceding Plan Year applies for:", { bold: true });
      checkboxLine(ctx, cafe.participation.defaultElections.premiumConversion && features.premiumConversion, "a.  Premium Conversion Account", { indent: 1 });
      checkboxLine(ctx, cafe.participation.defaultElections.healthFSA && features.healthFSA, "b.  Health Flexible Spending Account", { indent: 1 });
      checkboxLine(ctx, cafe.participation.defaultElections.limitedPurposeFSA && (features.limitedPurposeFSA || features.postDeductibleFSA), "c.  Limited Purpose/Post-Deductible Health FSA", { indent: 1 });
      checkboxLine(ctx, cafe.participation.defaultElections.dcap && features.dcap, "d.  Dependent Care Assistance Plan Account", { indent: 1 });
      checkboxLine(ctx, cafe.participation.defaultElections.hsa && features.hsa, "e.  Health Savings Account", { indent: 1 });
      checkboxLine(ctx, cafe.participation.defaultElections.adoptionAssistanceFSA && features.adoptionAssistanceFSA, "f.  Adoption Assistance Flexible Spending Account", { indent: 1 });

      subheading(ctx, "Change in Status");
      bodyText(ctx, "2.  An Eligible Employee may change election upon the following events:", { bold: true });
      checkboxLine(ctx, cafe.participation.changeInStatusEvents === "none", "a.  None", { indent: 1 });
      checkboxLine(ctx, cafe.participation.changeInStatusEvents === "treas_reg_125_4", "b.  Any event in Treas. Reg. 1.125-4 and other IRS-permitted events", { indent: 1 });
      checkboxLine(ctx, cafe.participation.changeInStatusEvents === "admin_procedures", "c.  Pursuant to written Plan Administrative Procedures", { indent: 1 });
      checkboxLine(ctx, cafe.participation.changeInStatusEvents === "other", `d.  Other:  ${cafe.participation.changeInStatusOther}`, { indent: 1 });

      bodyText(ctx, "3.  Permit Participants to revoke group health plan coverage:", { bold: true });
      checkboxLine(ctx, cafe.participation.marketplaceFamilyEnrollment, "a.  Due to family member enrolling in Marketplace QHP.", { indent: 1 });
    }},

    // D. Premium Conversion (conditional)
    ...(features.premiumConversion ? [{
      build: (ctx) => {
        legalSection(ctx, "D", "Premium Conversion Account");
        subheading(ctx, "Contracts for Reimbursement");
        bodyText(ctx, "1.  Contract types for which a Participant may contribute:", { bold: true });
        const ct = cafe.premiumConversion.contractTypes;
        const rows: { key: keyof typeof ct; letter: string; label: string }[] = [
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
          { key: "cobra", letter: "k", label: "COBRA continuation coverage" },
        ];
        rows.forEach((r) => checkboxLine(ctx, ct[r.key] as boolean, `${r.letter}.  ${r.label}`, { indent: 1 }));
        checkboxLine(ctx, ct.other, `l.  Other:  ${ct.otherDescription}`, { indent: 1 });

        subheading(ctx, "Enrollment");
        checkboxLine(ctx, cafe.premiumConversion.autoEnroll, "2.  All Employees automatically enrolled at hire (deemed election to contribute entire premium).");
        subheading(ctx, "Contributions");
        checkboxLine(ctx, cafe.premiumConversion.autoAdjust, "3.  Participant elections automatically adjusted for cost changes (Treas. Reg. 1.125-4(f)(2)(i)).");
      },
    } as PDFSection] : []),

    // E. FSA (conditional)
    ...(anyFSA ? [{
      build: (ctx) => {
        legalSection(ctx, "E", "Flexible Spending Accounts");
        noteText(ctx, "If Flexible Spending Accounts are not a permitted Benefit under A.5b, Section E is disregarded.");

        // E.1 Matching Contributions
        subheading(ctx, "Employer Contributions");
        checkboxLine(ctx, false, "1.  Matching Contributions. The Plan permits Employer matching contributions to the applicable Benefits as follows:", { bold: true });
        const fsaBlocks: { letter: string; label: string; cfg: typeof cafe.fsa.healthFSA; show: boolean }[] = [
          { letter: "a", label: "Health FSA:", cfg: cafe.fsa.healthFSA, show: features.healthFSA },
          { letter: "b", label: "Limited Purpose/Post-Deductible Health Flexible Spending Account (HSA-Compatible FSA)", cfg: cafe.fsa.limitedPurposeFSA, show: features.limitedPurposeFSA || features.postDeductibleFSA },
          { letter: "c", label: "Dependent Care Assistance Plan Account:", cfg: cafe.fsa.dcap, show: features.dcap },
          { letter: "d", label: "Adoption Assistance Flexible Spending Account:", cfg: cafe.fsa.adoptionAssistanceFSA, show: features.adoptionAssistanceFSA },
        ];
        fsaBlocks.forEach((blk) => {
          if (!blk.show) return;
          bodyText(ctx, `${blk.letter}.  ${blk.label}`, { bold: true, indent: true });
          checkboxLine(ctx, blk.cfg.matchingFormula === "none", "i.  None", { indent: 2 });
          checkboxLine(ctx, blk.cfg.matchingFormula === "discretionary", "ii.  Discretionary", { indent: 2 });
          checkboxLine(ctx, blk.cfg.matchingFormula === "pct_of_contribution_pct", `iii.  ${blk.cfg.matchingPct || "_____"}% of the Participant's contribution up to ${blk.cfg.matchingComplementPct || "_____"}% of the Participant's Compensation`, { indent: 2 });
          checkboxLine(ctx, blk.cfg.matchingFormula === "pct_of_contribution_dollar", `iv.  ${blk.cfg.matchingPct || "_____"}% of the Participant's contribution up to $${blk.cfg.matchingComplementDollar || "_____"}`, { indent: 2 });
          checkboxLine(ctx, blk.cfg.matchingFormula === "other", `v.  Other:  ${blk.cfg.matchingOther}`, { indent: 2 });
        });
        noteText(ctx, "If there are no Employer matching contributions to the Plan, questions under E.1 are disregarded.");
        noteText(ctx, "Only one contribution formula is permitted for each applicable Benefit.");
        noteText(ctx, "If the Plan is intended to be a simple cafeteria plan, the matching contributions in this section will apply in addition to the contributions at A.6b.");

        // E.2 Non-Elective Contributions
        checkboxLine(ctx, false, "2.  Non-Elective Employer Contributions. The Plan permits Employer contributions to the applicable Benefits as follows:", { bold: true });
        fsaBlocks.forEach((blk) => {
          if (!blk.show) return;
          bodyText(ctx, `${blk.letter}.  ${blk.label}`, { bold: true, indent: true });
          checkboxLine(ctx, blk.cfg.nonElectiveFormula === "none", "i.  None", { indent: 2 });
          checkboxLine(ctx, blk.cfg.nonElectiveFormula === "discretionary", "ii.  Discretionary", { indent: 2 });
          checkboxLine(ctx, blk.cfg.nonElectiveFormula === "pct_of_compensation", `iii.  ${blk.cfg.nonElectivePct || "_____"}% of the Participant's Compensation`, { indent: 2 });
          checkboxLine(ctx, blk.cfg.nonElectiveFormula === "dollar_per_employee", `iv.  $${blk.cfg.nonElectiveDollar || "_____"} per Eligible Employee`, { indent: 2 });
          checkboxLine(ctx, blk.cfg.nonElectiveFormula === "other", `v.  Other:  ${blk.cfg.nonElectiveOther}`, { indent: 2 });
        });
        noteText(ctx, "If there are no non-elective Employer contributions, questions under E.2 are disregarded.");
        noteText(ctx, "Employer matching and non-elective contributions shall not exceed the limits set forth in the BPD including: Health FSA, Section 6.04(b); HSA-Compatible FSA Section 7.04; Dependent Care Assistance Plan Account Section 8.04; and Adoption Assistance Flexible Spending Account, Section 10.04.");

        // E.3 Contribution Limits
        bodyText(ctx, "3.  Contribution Limits. Select the maximum allowable Participant contribution to the applicable FSA in any Plan Year:", { bold: true });
        checkboxLine(ctx, cafe.fsa.contributionLimitMode === "code_max", "a.  The maximum amount permitted under Code section 125(i), 129(a)(2) and/or 137(b)(1)", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.contributionLimitMode === "other_amount", "b.  Other amounts", { indent: 1 });
        if (cafe.fsa.contributionLimitMode === "other_amount") {
          if (features.healthFSA) bodyText(ctx, `i.  Health Flexible Spending Account: $${cafe.fsa.healthFSALimit}`, { indent: true });
          if (features.limitedPurposeFSA || features.postDeductibleFSA) bodyText(ctx, `ii.  Limited Purpose/Post-Deductible Health Flexible Spending Account (HSA-Compatible FSA): $${cafe.fsa.limitedPurposeFSALimit}`, { indent: true });
          if (features.dcap) bodyText(ctx, `iii.  Dependent Care Assistance Plan Account: $${cafe.fsa.dcapLimit}`, { indent: true });
          if (features.adoptionAssistanceFSA) bodyText(ctx, `iv.  Adoption Assistance Flexible Spending Account: $${cafe.fsa.adoptionAssistanceLimit}`, { indent: true });
        }
        noteText(ctx, "Other amounts for Health FSA in E.3bi and Limited Purpose/Post-Deductible Health FSA in E.3ii cannot exceed the Code section 125(i) maximum. DCAP cannot exceed Code 129(a)(2). Adoption Assistance cannot exceed Code section 137(b)(1) maximum.");

        // E.4 Eligible Expenses
        subheading(ctx, "Eligible Expenses");
        bodyText(ctx, "4.  Individual Expenses Eligible for Reimbursement. Participant may only be reimbursed from the applicable FSA for expenses that are incurred by:", { bold: true });
        checkboxLine(ctx, cafe.fsa.eligiblePersons === "participant_spouse_dep", "a.  Participant, spouse and Dependents. The Participant, his or her spouse and all Dependents, and any child (as defined in section 152(f)(1)) of the Participant until his or her 26th birthday.", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.eligiblePersons === "covered_under_employer", "b.  Persons covered under Employer-sponsored group health plan. The Participant, his or her spouse and all Dependents, but only if such persons are also covered under an Employer-sponsored health plan.", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.eligiblePersons === "participant_only", "c.  Participants only. No reimbursement for expenses incurred by the Participant's spouse or Dependents.", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.eligiblePersons === "other", `d.  Other: ${cafe.fsa.eligiblePersonsOther} (may not include anyone other than the Participant, his or her spouse and all Dependents, and any child (as defined in section 152(f)(1)) of the Participant until his or her 26th birthday)`, { indent: 1 });

        // E.5 Expenses Not Eligible
        subheading(ctx, "Expenses Not Eligible for Reimbursement");
        bodyText(ctx, "5.  Expenses Not Eligible for Reimbursement. In addition to those listed in the Basic Plan Document, the following expenses are not eligible for reimbursement from a Participant's FSA:", { bold: true });
        checkboxLine(ctx, !!cafe.fsa.expensesNotEligibleHealth, `a.  Health Flexible Spending Account:  ${cafe.fsa.expensesNotEligibleHealth}`, { indent: 1 });
        checkboxLine(ctx, !!cafe.fsa.expensesNotEligibleLimited, `b.  Limited Purpose/Post-Deductible Health Flexible Spending Account (HSA-Compatible FSA):  ${cafe.fsa.expensesNotEligibleLimited}`, { indent: 1 });
        checkboxLine(ctx, !!cafe.fsa.expensesNotEligibleDcap, `c.  Dependent Care Assistance Plan Account:  ${cafe.fsa.expensesNotEligibleDcap}`, { indent: 1 });
        checkboxLine(ctx, !!cafe.fsa.expensesNotEligibleAdoption, `d.  Adoption Assistance Flexible Spending Account:  ${cafe.fsa.expensesNotEligibleAdoption}`, { indent: 1 });

        // E.6 Adult Children Coverage
        bodyText(ctx, "6.  Adult Children Coverage. Reimbursement for adult children may be paid from the applicable FSA for claims incurred:", { bold: true });
        checkboxLine(ctx, cafe.fsa.adultChildrenAge === "until_26", "a.  until the date the child attains age 26", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.adultChildrenAge === "until_end_of_year_26", "b.  until the last day of the calendar year in which the child attains age 26", { indent: 1 });

        // E.7 Amounts Available for Reimbursement
        subheading(ctx, "Reimbursement");
        checkboxLine(ctx, cafe.fsa.amountsAvailableDcap || cafe.fsa.amountsAvailableAdoption, "7.  Amounts Available for Reimbursement. The Plan Administrator may direct reimbursement of FSAs up to the entire annual amount elected by the Eligible Employee on the Salary Reduction Agreement for the Plan Year for the applicable FSA, less any reimbursements already disbursed from the applicable FSA for the following Benefits:", { bold: true });
        checkboxLine(ctx, cafe.fsa.amountsAvailableDcap, "a.  Dependent Care Assistance Plan Account", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.amountsAvailableAdoption, "b.  Adoption Assistance Flexible Spending Account", { indent: 1 });
        noteText(ctx, "If 7.a or 7.b is not selected, the Plan Administrator may direct reimbursement only up to the amount in the applicable FSA at the time the reimbursement request is received by the Plan Administrator.");

        // E.8 Grace Period
        subheading(ctx, "Grace Period");
        checkboxLine(ctx, cafe.fsa.gracePeriodHealthFSA || cafe.fsa.gracePeriodLimitedFSA || cafe.fsa.gracePeriodDcap || cafe.fsa.gracePeriodAdoption, "8.  The Plan will reimburse claims incurred during a Grace Period immediately following the end of the Plan Year for the following Benefits.", { bold: true });
        if (features.healthFSA) checkboxLine(ctx, cafe.fsa.gracePeriodHealthFSA, "a.  Health Flexible Spending Account", { indent: 1 });
        if (features.limitedPurposeFSA || features.postDeductibleFSA) checkboxLine(ctx, cafe.fsa.gracePeriodLimitedFSA, "b.  Limited Purpose/Post-Deductible Health Flexible Spending Account (HSA-Compatible FSA)", { indent: 1 });
        if (features.dcap) checkboxLine(ctx, cafe.fsa.gracePeriodDcap, "c.  Dependent Care Assistance Plan Account", { indent: 1 });
        if (features.adoptionAssistanceFSA) checkboxLine(ctx, cafe.fsa.gracePeriodAdoption, "d.  Adoption Assistance Flexible Spending Account", { indent: 1 });
        noteText(ctx, "The Plan cannot reimburse claims incurred during a Grace Period if carryovers are permitted in Part E.13.");

        // E.9 Last day of Grace Period
        bodyText(ctx, "9.  Last day of Grace Period:", { bold: true });
        checkboxLine(ctx, cafe.fsa.gracePeriodEnd === "fifteenth_third_month", "a.  Fifteenth day of the 3rd month following end of the Plan Year", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.gracePeriodEnd === "other", `b.  Other  ${cafe.fsa.gracePeriodOther}`, { indent: 1 });

        // E.10 Run Out (no Grace)
        subheading(ctx, "Run Out Period");
        bodyText(ctx, "10.  If no Grace Period applies for the Plan Year, an active Participant must submit claims for the Plan Year for reimbursement from the applicable FSA no later than:", { bold: true });
        checkboxLine(ctx, !!cafe.fsa.runOutDays, `a.  ${cafe.fsa.runOutDays || "_____"} days after the end of the Plan Year`, { indent: 1 });
        checkboxLine(ctx, !!cafe.fsa.runOutDate, `b.  ${cafe.fsa.runOutDate || "_____"} (insert date, e.g., March 31) immediately following such Plan Year`, { indent: 1 });

        // E.11 Run Out (with Grace)
        bodyText(ctx, "11.  If a Grace Period applies for the Plan Year, an active Participant must submit claims for the Plan Year for reimbursement from the applicable FSA no later than:", { bold: true });
        checkboxLine(ctx, !!cafe.fsa.runOutAfterGraceDays, `a.  ${cafe.fsa.runOutAfterGraceDays || "_____"} days after the end of the Grace Period`, { indent: 1 });
        checkboxLine(ctx, !!cafe.fsa.runOutAfterGraceDate, `b.  ${cafe.fsa.runOutAfterGraceDate || "_____"} (insert date, e.g., March 31st) immediately following such Plan Year`, { indent: 1 });
        noteText(ctx, "The date in E.11b should be later than the last day of the Grace Period.");

        // E.12 Automatic Payment of Claims
        subheading(ctx, "Automatic Payment of Claims");
        bodyText(ctx, "12.  Eligible expenses not covered under the Employer-sponsored health plan (e.g., co-payments, co-insurance, deductibles) automatically paid from the applicable FSA.", { bold: true });
        if (features.healthFSA) checkboxLine(ctx, cafe.fsa.automaticPaymentHealthFSA, "a.  Health Flexible Spending Account", { indent: 1 });
        if (features.limitedPurposeFSA || features.postDeductibleFSA) checkboxLine(ctx, cafe.fsa.automaticPaymentLimitedFSA, "b.  Limited Purpose/Post-Deductible Health Flexible Spending Account (HSA-Compatible FSA)", { indent: 1 });

        // E.13 Carryover
        if (features.healthFSA || features.limitedPurposeFSA || features.postDeductibleFSA) {
          subheading(ctx, "Carryover");
          bodyText(ctx, "13.  The Plan will carry over unused Health FSA balances at the end of the Plan Year for the following Benefits:", { bold: true });
          if (features.healthFSA) {
            checkboxLine(ctx, cafe.fsa.carryoverHealthFSA, "a.  Health Flexible Spending Account", { indent: 1 });
            if (cafe.fsa.carryoverHealthFSA) {
              checkboxLine(ctx, cafe.fsa.carryoverHealthFSAMode === "max_indexed", "i.  Maximum amount, as indexed", { indent: 2 });
              checkboxLine(ctx, cafe.fsa.carryoverHealthFSAMode === "other", `ii.  Other:  ${cafe.fsa.carryoverHealthFSAOther}`, { indent: 2 });
            }
          }
          if (features.limitedPurposeFSA || features.postDeductibleFSA) {
            checkboxLine(ctx, cafe.fsa.carryoverLimitedFSA, "b.  Limited Purpose/Post-Deductible Health Flexible Spending Account (HSA-Compatible FSA)", { indent: 1 });
            if (cafe.fsa.carryoverLimitedFSA) {
              checkboxLine(ctx, cafe.fsa.carryoverLimitedFSAMode === "max_indexed", "i.  Maximum amount, as indexed", { indent: 2 });
              checkboxLine(ctx, cafe.fsa.carryoverLimitedFSAMode === "other", `ii.  Other:  ${cafe.fsa.carryoverLimitedFSAOther}`, { indent: 2 });
            }
          }
          noteText(ctx, "If carryover is selected, the Plan may not provide for a Grace Period for the applicable FSA and may not provide for a Grace Period in the Plan Year to which the carryover amount is applied.");
        }

        // E.14 Termination of Employment
        subheading(ctx, "Termination of Employment");
        bodyText(ctx, "14.  In the event of a Termination of Employment the Participant may elect to continue to make contributions to FSAs under the Plan on an after-tax basis and reimbursements will be allowed for the remainder of the Plan Year.", { bold: true });
        checkboxLine(ctx, cafe.fsa.terminationContinuation === "yes", "a.  Yes", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.terminationContinuation === "yes_limited", `b.  Yes - subject to the following limitations:  ${cafe.fsa.terminationLimitations}`, { indent: 1 });
        checkboxLine(ctx, cafe.fsa.terminationContinuation === "no", "c.  No", { indent: 1 });
        noteText(ctx, "If E.14c is selected, then contributions shall cease upon Termination and reimbursements will be allowed only for expenses incurred prior to Termination.");
        noteText(ctx, "If applicable, any COBRA elections shall supersede this section.");

        // E.15 Claims after termination
        bodyText(ctx, "15.  In the event of a Termination of Employment, a Participant may submit claims for reimbursement from the applicable FSA no later than:", { bold: true });
        checkboxLine(ctx, !!cafe.fsa.terminationClaimsDays, `a.  ${cafe.fsa.terminationClaimsDays || "_____"} days after a Termination of Employment.`, { indent: 1 });
        checkboxLine(ctx, !!cafe.fsa.terminationClaimsAfterPlanYearDays, `b.  ${cafe.fsa.terminationClaimsAfterPlanYearDays || "_____"} days following the Plan Year in which the Termination occurs.`, { indent: 1 });
        noteText(ctx, "If E.14a or E.14b is selected, then E.15b must be selected.");

        // E.16 Qualified Reservist Distributions
        if (features.healthFSA) {
          subheading(ctx, "Qualified Reservist Distributions");
          checkboxLine(ctx, cafe.fsa.qualifiedReservistEnabled, "16.  Qualified Reservist Distributions are available for:", { bold: true });
          checkboxLine(ctx, cafe.fsa.qualifiedReservistEnabled && cafe.fsa.qualifiedReservistMode === "entire_amount", "a.  The entire amount elected for the applicable Health FSA for the Plan Year minus applicable Health FSA reimbursements received as of the date of the Qualified Reservist Distribution request.", { indent: 1 });
          checkboxLine(ctx, cafe.fsa.qualifiedReservistEnabled && cafe.fsa.qualifiedReservistMode === "contributed_amount", "b.  The amount contributed to the applicable Health FSA as of the date of the Qualified Reservist Distribution request minus applicable FSA reimbursements received as of the date of the Qualified Reservist Distribution request.", { indent: 1 });
          checkboxLine(ctx, cafe.fsa.qualifiedReservistEnabled && cafe.fsa.qualifiedReservistMode === "other", `c.  Other amount (not to exceed the entire amount elected for the applicable Plan Year minus reimbursements):  ${cafe.fsa.qualifiedReservistOther}`, { indent: 1 });
        }
      },
    } as PDFSection] : []),

    // F. HSA (conditional)
    ...(features.hsa ? [{
      build: (ctx) => {
        legalSection(ctx, "F", "Health Savings Account (HSA Account)");
        const hsa = cafe.hsa;
        subheading(ctx, "Employer Contributions");
        bodyText(ctx, "1.  Matching Contributions to HSA:", { bold: true });
        checkboxLine(ctx, hsa.matchingFormula === "none", "a.  None", { indent: 1 });
        checkboxLine(ctx, hsa.matchingFormula === "discretionary", "b.  Discretionary", { indent: 1 });
        checkboxLine(ctx, hsa.matchingFormula === "pct_of_contribution_pct", `c.  ${hsa.matchingPct || "_____"}% of HSA contribution up to ${hsa.matchingComplementPct || "_____"}% of Compensation`, { indent: 1 });
        checkboxLine(ctx, hsa.matchingFormula === "pct_of_contribution_dollar", `d.  ${hsa.matchingPct || "_____"}% of HSA contribution up to $${hsa.matchingComplementDollar || "_____"}`, { indent: 1 });
        checkboxLine(ctx, hsa.matchingFormula === "other", `e.  Other:  ${hsa.matchingOther}`, { indent: 1 });

        bodyText(ctx, "2.  Non-Elective Contributions to HSA:", { bold: true });
        checkboxLine(ctx, hsa.nonElectiveFormula === "none", "a.  None", { indent: 1 });
        checkboxLine(ctx, hsa.nonElectiveFormula === "discretionary", "b.  Discretionary", { indent: 1 });
        checkboxLine(ctx, hsa.nonElectiveFormula === "pct_of_compensation", `c.  ${hsa.nonElectivePct || "_____"}% of Compensation`, { indent: 1 });
        checkboxLine(ctx, hsa.nonElectiveFormula === "dollar_per_employee", `d.  $${hsa.nonElectiveDollar || "_____"} per Eligible Employee`, { indent: 1 });
        checkboxLine(ctx, hsa.nonElectiveFormula === "other", `e.  Other:  ${hsa.nonElectiveOther}`, { indent: 1 });

        bodyText(ctx, "3.  Maximum HSA contribution:", { bold: true });
        checkboxLine(ctx, hsa.contributionLimitMode === "code_max", "a.  Maximum permitted under Code 223(b), reduced by Employer contributions.", { indent: 1 });
        checkboxLine(ctx, hsa.contributionLimitMode === "other_amount", `b.  Other:  ${hsa.contributionLimitAmount}`, { indent: 1 });
      },
    } as PDFSection] : []),

    // G. Flex Credits (conditional)
    ...(features.flexCredits ? [{
      build: (ctx) => {
        legalSection(ctx, "G", "Flexible Benefit Credits (Flex Credits) (Section 11.01)");
        noteText(ctx, "If Flexible Benefit Credits are not permitted Benefits in A.5h, Section G is disregarded.");
        const fc = cafe.flexCredits;
        subheading(ctx, "Health Flex Contribution");
        checkboxLine(ctx, fc.healthFlexContribution, "1.  Health Flex Contribution. The Flex Credit is intended to qualify as a \"health flex contribution\" under Treas. Reg. section 1.5000A-3(e)(3)(ii)(E): The Participant may not opt to receive the Flex Credit as a cash or taxable benefit and the Participant may only use the Flex Credit for the payment of premiums applicable to health care and toward the Health FSA or HSA-Compatible Health FSA Benefits.");

        bodyText(ctx, "2.  Eligible Benefits. Participants may elect to contribute the Flex Credits to the following benefits:", { bold: true });
        checkboxLine(ctx, fc.eligibleScope === "all_benefits", "a.  All Benefits offered under the Plan", { indent: 1 });
        checkboxLine(ctx, fc.eligibleScope === "all_except", `b.  All Benefits offered under the Plan except the following:  ${fc.eligibleScopeExceptions}`, { indent: 1 });
        checkboxLine(ctx, fc.eligibleScope === "only_following", `c.  Only the following Benefits:  ${fc.eligibleScopeOnly}`, { indent: 1 });
        checkboxLine(ctx, fc.eligibleScope === "premium_health_only", "d.  Only the portion of the (i) Premium Conversion Account paid toward Employer-sponsored Health Contract premiums and/or (ii) Health FSA or HSA-Compatible Health FSA Benefits.", { indent: 1 });
        noteText(ctx, "If G.1 is selected, G.2d must be selected.");

        bodyText(ctx, "3.  Amount of Flex Credit. The Employer will contribute a Flex Credit on behalf of each Eligible Employee as follows:", { bold: true });
        checkboxLine(ctx, fc.amountMode === "dollar", `a.  $${fc.amountDollar || "_____"} per Eligible Employee`, { indent: 1 });
        checkboxLine(ctx, fc.amountMode === "discretionary", "b.  A discretionary amount as determined by the Employer", { indent: 1 });
        checkboxLine(ctx, fc.amountMode === "other", `c.  Other:  ${fc.amountOther}`, { indent: 1 });
        checkboxLine(ctx, fc.amountMode === "simple_cafeteria_match", "d.  The amount of the simple cafeteria plan contributions described in A.6b", { indent: 1 });

        checkboxLine(ctx, fc.contribTo401k, `4.  Contribution to 401(k) Plan. An Eligible Employee may elect to contribute all or a portion of his or her Flex Credits to a Qualified Plan in accordance with the terms of the following Qualified Plan(s):  ${fc.qualifiedPlanName}`, { bold: true });
        noteText(ctx, "If G.4 is selected, then G.5 (cash out) must also be elected.");

        subheading(ctx, "Cash Outs");
        bodyText(ctx, "5.  Cash Out of Flex Credits. A Participant may elect to receive all or a portion of his or Flex Credits in cash.", { bold: true });
        checkboxLine(ctx, fc.cashOutAllowed === "yes", "a.  Yes", { indent: 1 });
        checkboxLine(ctx, fc.cashOutAllowed === "yes_limited", `b.  Yes, subject to the following limitations:  ${fc.cashOutLimitations}`, { indent: 1 });
        checkboxLine(ctx, fc.cashOutAllowed === "no", "c.  No", { indent: 1 });
        noteText(ctx, "If G.5a or G.5b is selected, then Flex Credits a Participant elects to contribute to a Health FSA will count toward the Code section 125(i) contribution limitation.");
        noteText(ctx, "If G.1 is selected, G.5c must be selected.");
        noteText(ctx, "If G.5.c is selected, the maximum value of Flex Credits a Participant can contribute to a Health FSA for a Plan Year is $500.");

        numberedLine(ctx, "6", "Amount of Cash Out. For each Flex Credit dollar that a Participant elects to receive in cash from the Plan, the Participant will receive: $", `${fc.cashOutDollarValue} (insert dollar value of each Flex Credit; if no amount is provided, the cash out value of each Flex Credit is $1.00)`);

        bodyText(ctx, "7.  Maximum Flex Credit Cash Out. The amount of cash a Participant may receive in exchange for Flex Credits in Plan Year shall not exceed:", { bold: true });
        checkboxLine(ctx, fc.maxCashOut === "no_limit", "a.  No limit", { indent: 1 });
        checkboxLine(ctx, fc.maxCashOut === "per_year_amount", `b.  $${fc.maxCashOutAmount || "_____"} per calendar year`, { indent: 1 });
        checkboxLine(ctx, fc.maxCashOut === "other", `c.  Other:  ${fc.maxCashOutOther}`, { indent: 1 });

        bodyText(ctx, "8.  Payment of Cash Out. Amounts distributed in cash from the Plan pursuant to Section 11.03 shall be paid to the Participant in:", { bold: true });
        checkboxLine(ctx, fc.cashOutPayment === "payroll_installments", "a.  Equal payroll installments", { indent: 1 });
        checkboxLine(ctx, fc.cashOutPayment === "lump_sum_start", "b.  A single lump sum at the beginning of the Plan Year", { indent: 1 });
        checkboxLine(ctx, fc.cashOutPayment === "lump_sum_end", "c.  A single lump sum at the end of the Plan Year", { indent: 1 });
        checkboxLine(ctx, fc.cashOutPayment === "other", `d.  Other:  ${fc.cashOutPaymentOther}`, { indent: 1 });
      },
    } as PDFSection] : []),

    // H. PTO (conditional)
    ...(features.ptoPurchaseSale ? [{
      build: (ctx) => {
        legalSection(ctx, "H", "Purchase and Sale of Paid Time Off (PTO) (Section 11.02)");
        const pto = cafe.pto;
        subheading(ctx, "Purchase of PTO");
        bodyText(ctx, "1.  Maximum PTO Purchase. A Participant can elect to purchase no more than the following periods of PTO in a Plan Year:", { bold: true });
        checkboxLine(ctx, pto.maxPurchaseType === "none", "a.  None", { indent: 1 });
        checkboxLine(ctx, pto.maxPurchaseType === "hours", `b.  ${pto.maxPurchaseAmount || "_____"} hours`, { indent: 1 });
        checkboxLine(ctx, pto.maxPurchaseType === "days", `c.  ${pto.maxPurchaseAmount || "_____"} days`, { indent: 1 });
        checkboxLine(ctx, pto.maxPurchaseType === "weeks", `d.  ${pto.maxPurchaseAmount || "_____"} weeks`, { indent: 1 });
        checkboxLine(ctx, pto.maxPurchaseType === "other", `e.  Other:  ${pto.maxPurchaseOther}`, { indent: 1 });
        noteText(ctx, "If Purchase of PTO is not a permitted Benefit in A.5i, H.1 is disregarded.");

        subheading(ctx, "Sale of PTO");
        bodyText(ctx, "2.  Maximum PTO Sale. A Participant can elect to sell no more than the following periods of PTO in a Plan Year:", { bold: true });
        checkboxLine(ctx, pto.maxSaleType === "none", "a.  None", { indent: 1 });
        checkboxLine(ctx, pto.maxSaleType === "hours", `b.  ${pto.maxSaleAmount || "_____"} hours`, { indent: 1 });
        checkboxLine(ctx, pto.maxSaleType === "days", `c.  ${pto.maxSaleAmount || "_____"} days`, { indent: 1 });
        checkboxLine(ctx, pto.maxSaleType === "weeks", `d.  ${pto.maxSaleAmount || "_____"} weeks`, { indent: 1 });
        checkboxLine(ctx, pto.maxSaleType === "other", `e.  Other:  ${pto.maxSaleOther}`, { indent: 1 });
        noteText(ctx, "If Sale of PTO is not a permitted Benefit in A.5i, H.2 is disregarded.");

        subheading(ctx, "Carryover of PTO");
        checkboxLine(ctx, pto.noCarryoverElectivePTO, "3.  No Carryover of Elective PTO. Unused elective PTO (determined as of the last day of the Plan Year) shall be paid in cash on or prior to the last day of the Plan Year.", { bold: true });
        noteText(ctx, "If Sale and/or Purchase of PTO are not permitted Benefits in A.5i, H.3 is disregarded.");
        noteText(ctx, "If H.3 is not selected, unused elective PTO will be forfeited as of the last day of the Plan Year.");
      },
    } as PDFSection] : []),

    // I. Miscellaneous
    { build: (ctx) => {
      legalSection(ctx, "I", "Miscellaneous");
      subheading(ctx, "Plan Administrator Information");
      bodyText(ctx, "1.  Plan Administrator:", { bold: true });
      checkboxLine(ctx, cafe.misc.planAdminType === "sponsor", "a.  Plan Sponsor", { indent: 1 });
      checkboxLine(ctx, cafe.misc.planAdminType === "committee", "b.  Committee appointed by Plan Sponsor", { indent: 1 });
      checkboxLine(ctx, cafe.misc.planAdminType === "other", `c.  Other:  ${cafe.misc.planAdminOther}`, { indent: 1 });

      bodyText(ctx, "2.  Indemnification:", { bold: true });
      checkboxLine(ctx, cafe.misc.indemnificationType === "none", "a.  None - the Company will not indemnify the Plan Administrator.", { indent: 1 });
      checkboxLine(ctx, cafe.misc.indemnificationType === "standard", "b.  Standard as provided in Section 14.02.", { indent: 1 });
      checkboxLine(ctx, cafe.misc.indemnificationType === "custom", "c.  Custom (per Addendum to Adoption Agreement).", { indent: 1 });

      numberedLine(ctx, "3", "Governing Law", govLaw);
      numberedLine(ctx, "4", "Participating Employers", "Additional participating employers may be specified in an addendum to the Adoption Agreement");
      numberedLine(ctx, "5", "State of Organization", stateOfOrg);
    }},

    // J. Execution Page
    { build: (ctx) => {
      legalSection(ctx, "J", "Execution Page");
      bodyText(ctx, "Failure to properly fill out the Adoption Agreement may result in the failure of the Plan to achieve its intended tax consequences.");
      emptyLine(ctx);
      bodyText(ctx, "The Plan shall consist of this Adoption Agreement, its related Basic Plan Document #125 and any related Appendix and Addendum to the Adoption Agreement.");
      emptyLine(ctx);
      bodyText(ctx, `The undersigned agrees to be bound by the terms of this Adoption Agreement and Basic Plan Document. The Plan Sponsor caused this Plan to be executed this ____ day of ____________________, ${effective.split(", ")[1] || "20__"}.`);
      signatureBlock(ctx, name);
    }},
  ];
}
