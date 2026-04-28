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
        subheading(ctx, "Contribution Limits");
        bodyText(ctx, "3.  Maximum allowable Participant contribution to applicable FSA in any Plan Year:", { bold: true });
        checkboxLine(ctx, cafe.fsa.contributionLimitMode === "code_max", "a.  Maximum permitted under Code section 125(i), 129(a)(2), and/or 137(b)(1)", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.contributionLimitMode === "other_amount", "b.  Other amounts:", { indent: 1 });
        if (cafe.fsa.contributionLimitMode === "other_amount") {
          if (features.healthFSA) bodyText(ctx, `i.  Health FSA: $${cafe.fsa.healthFSALimit}`, { indent: true });
          if (features.limitedPurposeFSA || features.postDeductibleFSA) bodyText(ctx, `ii.  Limited Purpose/Post-Deductible FSA: $${cafe.fsa.limitedPurposeFSALimit}`, { indent: true });
          if (features.dcap) bodyText(ctx, `iii.  DCAP: $${cafe.fsa.dcapLimit}`, { indent: true });
          if (features.adoptionAssistanceFSA) bodyText(ctx, `iv.  Adoption Assistance FSA: $${cafe.fsa.adoptionAssistanceLimit}`, { indent: true });
        }

        subheading(ctx, "Eligible Expenses");
        bodyText(ctx, "4.  Reimbursements may be made for expenses incurred by:", { bold: true });
        checkboxLine(ctx, cafe.fsa.eligiblePersons === "participant_spouse_dep", "a.  Participant, spouse and Dependents (and any child to age 26).", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.eligiblePersons === "covered_under_employer", "b.  Persons covered under Employer-sponsored group health plan.", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.eligiblePersons === "participant_only", "c.  Participants only.", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.eligiblePersons === "other", `d.  Other:  ${cafe.fsa.eligiblePersonsOther}`, { indent: 1 });

        bodyText(ctx, "6.  Adult children coverage:", { bold: true });
        checkboxLine(ctx, cafe.fsa.adultChildrenAge === "until_26", "a.  Until the date the child attains age 26.", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.adultChildrenAge === "until_end_of_year_26", "b.  Until the last day of the calendar year in which child attains 26.", { indent: 1 });

        subheading(ctx, "Grace Period");
        bodyText(ctx, "8.  Plan reimburses claims incurred during Grace Period for:", { bold: true });
        if (features.healthFSA) checkboxLine(ctx, cafe.fsa.gracePeriodHealthFSA, "a.  Health FSA", { indent: 1 });
        if (features.limitedPurposeFSA || features.postDeductibleFSA) checkboxLine(ctx, cafe.fsa.gracePeriodLimitedFSA, "b.  Limited Purpose/Post-Deductible Health FSA", { indent: 1 });
        if (features.dcap) checkboxLine(ctx, cafe.fsa.gracePeriodDcap, "c.  DCAP", { indent: 1 });
        if (features.adoptionAssistanceFSA) checkboxLine(ctx, cafe.fsa.gracePeriodAdoption, "d.  Adoption Assistance FSA", { indent: 1 });

        bodyText(ctx, "9.  Last day of Grace Period:", { bold: true });
        checkboxLine(ctx, cafe.fsa.gracePeriodEnd === "fifteenth_third_month", "a.  Fifteenth day of the 3rd month following end of Plan Year.", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.gracePeriodEnd === "other", `b.  Other  ${cafe.fsa.gracePeriodOther}`, { indent: 1 });

        subheading(ctx, "Run-Out Period");
        bodyText(ctx, "10.  Claims submission deadline (no Grace Period):", { bold: true });
        checkboxLine(ctx, !!cafe.fsa.runOutDays, `a.  ${cafe.fsa.runOutDays || "_____"} days after end of Plan Year.`, { indent: 1 });

        if (features.healthFSA || features.limitedPurposeFSA || features.postDeductibleFSA) {
          subheading(ctx, "Carryover");
          bodyText(ctx, "13.  Plan will carry over unused balances for:", { bold: true });
          if (features.healthFSA) {
            checkboxLine(ctx, cafe.fsa.carryoverHealthFSA, "a.  Health FSA", { indent: 1 });
            if (cafe.fsa.carryoverHealthFSA) {
              checkboxLine(ctx, cafe.fsa.carryoverHealthFSAMode === "max_indexed", "i.  Maximum amount, as indexed", { indent: 2 });
              checkboxLine(ctx, cafe.fsa.carryoverHealthFSAMode === "other", `ii.  Other:  ${cafe.fsa.carryoverHealthFSAOther}`, { indent: 2 });
            }
          }
          if (features.limitedPurposeFSA || features.postDeductibleFSA) {
            checkboxLine(ctx, cafe.fsa.carryoverLimitedFSA, "b.  Limited Purpose/Post-Deductible FSA", { indent: 1 });
            if (cafe.fsa.carryoverLimitedFSA) {
              checkboxLine(ctx, cafe.fsa.carryoverLimitedFSAMode === "max_indexed", "i.  Maximum amount, as indexed", { indent: 2 });
              checkboxLine(ctx, cafe.fsa.carryoverLimitedFSAMode === "other", `ii.  Other:  ${cafe.fsa.carryoverLimitedFSAOther}`, { indent: 2 });
            }
          }
        }

        subheading(ctx, "Termination of Employment");
        bodyText(ctx, "14.  May Participant continue contributions to FSAs after termination?", { bold: true });
        checkboxLine(ctx, cafe.fsa.terminationContinuation === "yes", "a.  Yes", { indent: 1 });
        checkboxLine(ctx, cafe.fsa.terminationContinuation === "yes_limited", `b.  Yes - subject to:  ${cafe.fsa.terminationLimitations}`, { indent: 1 });
        checkboxLine(ctx, cafe.fsa.terminationContinuation === "no", "c.  No", { indent: 1 });

        bodyText(ctx, "15.  Claims deadline after Termination:", { bold: true });
        checkboxLine(ctx, !!cafe.fsa.terminationClaimsDays, `a.  ${cafe.fsa.terminationClaimsDays || "_____"} days after Termination of Employment.`, { indent: 1 });

        if (features.healthFSA) {
          subheading(ctx, "Qualified Reservist Distributions");
          checkboxLine(ctx, cafe.fsa.qualifiedReservistEnabled, "16.  Qualified Reservist Distributions are available for:");
          if (cafe.fsa.qualifiedReservistEnabled) {
            checkboxLine(ctx, cafe.fsa.qualifiedReservistMode === "entire_amount", "a.  Entire Plan Year amount minus reimbursements.", { indent: 1 });
            checkboxLine(ctx, cafe.fsa.qualifiedReservistMode === "contributed_amount", "b.  Amount contributed as of request date minus reimbursements.", { indent: 1 });
            checkboxLine(ctx, cafe.fsa.qualifiedReservistMode === "other", `c.  Other:  ${cafe.fsa.qualifiedReservistOther}`, { indent: 1 });
          }
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
        legalSection(ctx, "G", "Flexible Benefit Credits");
        const fc = cafe.flexCredits;
        subheading(ctx, "Health Flex Contribution");
        checkboxLine(ctx, fc.healthFlexContribution, "1.  Flex Credit qualifies as 'health flex contribution' under Treas. Reg. 1.5000A-3(e)(3)(ii)(E)");

        bodyText(ctx, "2.  Eligible Benefits:", { bold: true });
        checkboxLine(ctx, fc.eligibleScope === "all_benefits", "a.  All Benefits offered under the Plan", { indent: 1 });
        checkboxLine(ctx, fc.eligibleScope === "all_except", `b.  All Benefits except:  ${fc.eligibleScopeExceptions}`, { indent: 1 });
        checkboxLine(ctx, fc.eligibleScope === "only_following", `c.  Only:  ${fc.eligibleScopeOnly}`, { indent: 1 });
        checkboxLine(ctx, fc.eligibleScope === "premium_health_only", "d.  Only Premium Conversion (Health) and Health/HSA-Compatible FSA Benefits", { indent: 1 });

        bodyText(ctx, "3.  Amount of Flex Credit:", { bold: true });
        checkboxLine(ctx, fc.amountMode === "dollar", `a.  $${fc.amountDollar || "_____"} per Eligible Employee`, { indent: 1 });
        checkboxLine(ctx, fc.amountMode === "discretionary", "b.  Discretionary amount", { indent: 1 });
        checkboxLine(ctx, fc.amountMode === "other", `c.  Other:  ${fc.amountOther}`, { indent: 1 });
        checkboxLine(ctx, fc.amountMode === "simple_cafeteria_match", "d.  Simple cafeteria plan contributions amount", { indent: 1 });

        checkboxLine(ctx, fc.contribTo401k, `4.  Contribution to 401(k) Plan:  ${fc.qualifiedPlanName}`);

        subheading(ctx, "Cash Outs");
        bodyText(ctx, "5.  Cash Out of Flex Credits:", { bold: true });
        checkboxLine(ctx, fc.cashOutAllowed === "yes", "a.  Yes", { indent: 1 });
        checkboxLine(ctx, fc.cashOutAllowed === "yes_limited", `b.  Yes, with limitations:  ${fc.cashOutLimitations}`, { indent: 1 });
        checkboxLine(ctx, fc.cashOutAllowed === "no", "c.  No", { indent: 1 });
        numberedLine(ctx, "6", "Amount of Cash Out per Flex Credit dollar: $", fc.cashOutDollarValue);

        bodyText(ctx, "7.  Maximum Cash Out per Plan Year:", { bold: true });
        checkboxLine(ctx, fc.maxCashOut === "no_limit", "a.  No limit", { indent: 1 });
        checkboxLine(ctx, fc.maxCashOut === "per_year_amount", `b.  $${fc.maxCashOutAmount || "_____"} per calendar year`, { indent: 1 });
        checkboxLine(ctx, fc.maxCashOut === "other", `c.  Other:  ${fc.maxCashOutOther}`, { indent: 1 });

        bodyText(ctx, "8.  Payment of Cash Out:", { bold: true });
        checkboxLine(ctx, fc.cashOutPayment === "payroll_installments", "a.  Equal payroll installments", { indent: 1 });
        checkboxLine(ctx, fc.cashOutPayment === "lump_sum_start", "b.  Lump sum at beginning of Plan Year", { indent: 1 });
        checkboxLine(ctx, fc.cashOutPayment === "lump_sum_end", "c.  Lump sum at end of Plan Year", { indent: 1 });
        checkboxLine(ctx, fc.cashOutPayment === "other", `d.  Other:  ${fc.cashOutPaymentOther}`, { indent: 1 });
      },
    } as PDFSection] : []),

    // H. PTO (conditional)
    ...(features.ptoPurchaseSale ? [{
      build: (ctx) => {
        legalSection(ctx, "H", "Purchase and Sale of Paid Time Off (PTO)");
        const pto = cafe.pto;
        subheading(ctx, "Purchase of PTO");
        bodyText(ctx, "1.  Maximum PTO Purchase:", { bold: true });
        checkboxLine(ctx, pto.maxPurchaseType === "none", "a.  None", { indent: 1 });
        checkboxLine(ctx, pto.maxPurchaseType === "hours", `b.  ${pto.maxPurchaseAmount || "_____"} hours`, { indent: 1 });
        checkboxLine(ctx, pto.maxPurchaseType === "days", `c.  ${pto.maxPurchaseAmount || "_____"} days`, { indent: 1 });
        checkboxLine(ctx, pto.maxPurchaseType === "weeks", `d.  ${pto.maxPurchaseAmount || "_____"} weeks`, { indent: 1 });
        checkboxLine(ctx, pto.maxPurchaseType === "other", `e.  Other:  ${pto.maxPurchaseOther}`, { indent: 1 });

        subheading(ctx, "Sale of PTO");
        bodyText(ctx, "2.  Maximum PTO Sale:", { bold: true });
        checkboxLine(ctx, pto.maxSaleType === "none", "a.  None", { indent: 1 });
        checkboxLine(ctx, pto.maxSaleType === "hours", `b.  ${pto.maxSaleAmount || "_____"} hours`, { indent: 1 });
        checkboxLine(ctx, pto.maxSaleType === "days", `c.  ${pto.maxSaleAmount || "_____"} days`, { indent: 1 });
        checkboxLine(ctx, pto.maxSaleType === "weeks", `d.  ${pto.maxSaleAmount || "_____"} weeks`, { indent: 1 });
        checkboxLine(ctx, pto.maxSaleType === "other", `e.  Other:  ${pto.maxSaleOther}`, { indent: 1 });

        subheading(ctx, "Carryover of PTO");
        checkboxLine(ctx, pto.noCarryoverElectivePTO, "3.  No Carryover of Elective PTO. Unused elective PTO paid in cash on or prior to last day of Plan Year.");
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
