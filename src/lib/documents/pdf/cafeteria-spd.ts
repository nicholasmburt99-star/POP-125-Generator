import type { FormData } from "@/types";
import type { PDFSection } from "./pdf-builder";
import {
  coverPage,
  articleHeading,
  sectionTitle,
  bodyText,
  bulletItem,
  emptyLine,
} from "./pdf-builder";
import {
  formatDate,
  formatMonthDay,
  electionFormBenefits,
} from "../helpers";
import { getErisaRightsPDFBuilder } from "../legal-text/erisa-rights";

export function buildCafeteriaSPDPDFSections(data: FormData): PDFSection[] {
  const cafe = data.cafeteria;
  if (!cafe) return [];

  const name = data.employer.legalBusinessName;
  const effective = formatDate(data.plan.effectiveDate);
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const ein = data.employer.ein;
  const addr1 = data.employer.streetAddress;
  const addr2 = `${data.employer.city}, ${data.employer.state} ${data.employer.zipCode}`;
  const benefits = electionFormBenefits(data);
  const f = cafe.features;
  const anyFSA = f.healthFSA || f.limitedPurposeFSA || f.postDeductibleFSA || f.dcap || f.adoptionAssistanceFSA;

  return [
    // Cover
    { build: (ctx) => coverPage(ctx, name, addr1, addr2, "Section 125 Cafeteria Plan", "Summary Plan Description", effective) },

    // Introduction
    { build: (ctx) => {
      articleHeading(ctx, "INTRODUCTION");
      bodyText(ctx, "The Company has established a Cafeteria Plan (the “Plan”) under Section 125 of the Internal Revenue Code to allow Eligible Employees to pay for certain qualified benefits on a pre-tax basis. The benefits available under the Plan are described in this Summary Plan Description (“SPD”) and are subject to the terms of the Adoption Agreement and the Basic Plan Document, which together govern the operation of the Plan.");
      emptyLine(ctx);
      bodyText(ctx, "Read this SPD carefully so that you understand the provisions of the Plan and the benefits you and your eligible Dependents will receive. If the non-technical language in this SPD and the legal language of the Adoption Agreement or Basic Plan Document conflict, the Plan documents will always govern.");
      emptyLine(ctx);
      bodyText(ctx, "The cafeteria plan component of this Plan, which permits pre-tax salary redirection under Section 125 of the Internal Revenue Code, is not itself an employee welfare benefit plan subject to the Employee Retirement Income Security Act of 1974, as amended (“ERISA”). The underlying group medical, dental, vision, and other welfare benefits paid for through this Plan are generally separate employee welfare benefit plans subject to ERISA, and are governed by the policies, certificates, and plan documents issued for those benefits. Your ERISA rights with respect to those underlying welfare benefit plans are described in the Statement of ERISA Rights at the end of this Summary Plan Description and in the Summary Plan Descriptions for the underlying benefit plans, which you may obtain from the Plan Administrator. The Plan may be amended or terminated by the Company at any time. If the Plan is amended or terminated, the Company will notify you.");
    }},

    // General Information
    { build: (ctx) => {
      articleHeading(ctx, "GENERAL INFORMATION");

      sectionTitle(ctx, "Plan Information");
      bodyText(ctx, `Plan Name: ${name} Cafeteria Plan`);
      bodyText(ctx, `Effective Date: ${effective}`);
      bodyText(ctx, `Plan Year: ${pyStart} through ${pyEnd}`);
      bodyText(ctx, "Type of Plan: Cafeteria Plan under Section 125 of the Internal Revenue Code, including the component benefit options elected in the Adoption Agreement.");
      bodyText(ctx, "Type of Plan Administration: Employer Administration.");
      bodyText(ctx, "Plan Number: 501");
      bodyText(ctx, "Funding: This Plan is unfunded. Benefits are paid from the general assets of the Employer and from Participant pre-tax contributions.");
      emptyLine(ctx);

      sectionTitle(ctx, "Plan Sponsor / Employer");
      bodyText(ctx, name, { bold: true });
      bodyText(ctx, addr1);
      bodyText(ctx, addr2);
      bodyText(ctx, `Federal Employer I.D. Number: ${ein}`);
      emptyLine(ctx);

      sectionTitle(ctx, "Plan Administrator");
      bodyText(ctx, name, { bold: true });
      bodyText(ctx, addr1);
      bodyText(ctx, addr2);
      bodyText(ctx, `Federal Employer I.D. Number: ${ein}`);
      bodyText(ctx, "The Plan Administrator keeps the records for the Plan and is responsible for the administration of the Plan. The Plan Administrator will also answer any questions you may have about the Plan.");
      emptyLine(ctx);

      sectionTitle(ctx, "Agent for Service of Legal Process");
      bodyText(ctx, name, { bold: true });
      bodyText(ctx, addr1);
      bodyText(ctx, addr2);
      bodyText(ctx, "Service of legal process may also be made on the Plan Administrator.");
    }},

    // Plan Details Q&A
    { build: (ctx) => {
      articleHeading(ctx, "PLAN DETAILS");

      sectionTitle(ctx, "When Do I Become a Participant?");
      bodyText(ctx, "You become eligible to participate in the Plan once you have satisfied the eligibility requirements set forth in the Adoption Agreement and any underlying benefit policy or program. Your participation begins on the entry date specified in the Adoption Agreement following completion of any waiting period.");

      sectionTitle(ctx, "What Benefits Are Provided Under the Plan?");
      bodyText(ctx, "The following benefits are available under the Plan, subject to the terms of the Adoption Agreement and the Basic Plan Document:");
      benefits.forEach((b) => bulletItem(ctx, b));
      bodyText(ctx, "The specific terms of each underlying benefit (including eligibility, coverage levels, exclusions, and claims procedures) are described in the policy, certificate, or program document for that benefit, which is available from the Plan Administrator.");

      sectionTitle(ctx, "How Will I Make Payment?");
      bodyText(ctx, "Before each Plan Year (and during your initial Election Period if you become eligible during a Plan Year), you will elect the amount of your compensation that you wish to contribute to the Plan on a pre-tax basis through salary reduction. The amount you elect will be deducted from your paycheck in equal installments over the Plan Year and applied to pay your share of the cost of the benefits you elect. Because these contributions are made on a pre-tax basis, they are not subject to federal income tax, federal Social Security and Medicare (FICA) tax, or, in most states, state income tax.");

      sectionTitle(ctx, "May I Change My Election During the Plan Year?");
      bodyText(ctx, "Generally, the elections you make under the Plan are irrevocable for the entire Plan Year. However, you may change your election during the Plan Year if you experience a change in status or other event recognized under Section 125 of the Internal Revenue Code. Such permitted events include the following:");
      bulletItem(ctx, "Legal Marital Status: marriage, divorce, death of a spouse, legal separation, or annulment;");
      bulletItem(ctx, "Number of Dependents: birth, adoption, placement for adoption, or death of a dependent;");
      bulletItem(ctx, "Employment Status: termination or commencement of employment, a strike or lockout, commencement of or return from an unpaid leave of absence, or a change in worksite, for you, your spouse, or your dependent;");
      bulletItem(ctx, "A dependent satisfies or ceases to satisfy the eligibility requirements due to attainment of age, student status, or any similar circumstance;");
      bulletItem(ctx, "A change in the place of residence of you, your spouse, or your dependent;");
      bulletItem(ctx, "A judgment, decree, or order (including a Qualified Medical Child Support Order) requiring accident or health coverage for a child;");
      bulletItem(ctx, "Entitlement to Medicare or Medicaid (or loss of such entitlement) for you, your spouse, or your dependent;");
      bulletItem(ctx, "HIPAA special enrollment events, including loss of other group health coverage, marriage, birth, adoption, or placement for adoption, and certain CHIP eligibility events;");
      bulletItem(ctx, "Significant cost or coverage changes under the Plan or under a spouse’s or dependent’s plan;");
      bulletItem(ctx, "Loss of coverage under a governmental or educational institution group health program;");
      bulletItem(ctx, "A reduction in hours of service to less than 30 hours per week (where the Adoption Agreement permits a corresponding revocation of group health coverage);");
      bulletItem(ctx, "Eligibility for a Special Enrollment Period or annual open enrollment in a Qualified Health Plan offered through a Marketplace (where the Adoption Agreement permits a corresponding revocation of group health coverage).");
      bodyText(ctx, "Any election change must be consistent with the change in status and must be requested within the time period required by the Plan Administrator (generally within 30 days, or 60 days for HIPAA special enrollment and CHIP events).");
    }},

    // HSA section (if enabled)
    ...(f.hsa ? [{
      build: (ctx: import("./pdf-builder").PDFContext) => {
        sectionTitle(ctx, "Health Savings Account (HSA)");
        bodyText(ctx, "The Plan permits eligible Participants to make pre-tax contributions to a Health Savings Account (“HSA”) through salary reduction.");
        bodyText(ctx, "Who is eligible to contribute to an HSA?", { bold: true });
        bodyText(ctx, "To be eligible, you must be covered by a high-deductible health plan (HDHP) that meets the requirements of Code Section 223; you must not be covered by any other non-HDHP health coverage (with limited exceptions for permitted coverage such as dental, vision, and certain limited-purpose health FSAs); you must not be enrolled in Medicare; and you must not be claimed as a dependent on another person’s tax return.");
        bodyText(ctx, "How much may I contribute?", { bold: true });
        bodyText(ctx, "The maximum annual HSA contribution is set each year by the IRS and varies based on your HDHP coverage tier (self-only or family) and your age. Participants who are age 55 or older may make additional “catch-up” contributions. Your total HSA contributions (from all sources, including any Employer contributions) may not exceed the IRS annual limit.");
        bodyText(ctx, "What may HSA funds be used for?", { bold: true });
        bodyText(ctx, "HSA funds may be used to pay for qualified medical expenses incurred by you, your spouse, or your tax dependents, as defined in Code Section 213(d). Distributions for qualified medical expenses are tax-free. Distributions for non-qualified expenses are subject to ordinary income tax and, if you are under age 65, an additional 20% penalty tax.");
        bodyText(ctx, "What happens to unused HSA balances?", { bold: true });
        bodyText(ctx, "Your HSA is owned by you. Unused balances roll over from year to year and remain yours even if you change employers, change health plans, retire, or leave the workforce. HSA balances never forfeit.");
        bodyText(ctx, "May I change my HSA election during the Plan Year?", { bold: true });
        bodyText(ctx, "Yes. Unlike Premium Conversion elections (which are generally irrevocable for the Plan Year except for a permitted change in status), HSA salary-reduction elections may be started, stopped, increased, or decreased on a prospective basis at any time during the Plan Year, in accordance with the procedures established by the Plan Administrator and consistent with IRS Notice 2004-50.");
        bodyText(ctx, "Which medical plan options qualify as HDHPs for HSA eligibility?", { bold: true });
        bodyText(ctx, "HSA eligibility is tied to enrollment in an HDHP offered by the Employer that meets the requirements of Code Section 223. The specific Employer-sponsored medical plan option(s) that qualify as HDHPs for purposes of HSA eligibility are identified by the Plan Administrator at open enrollment and are described in the medical plan’s Summary of Benefits and Coverage (SBC). You should confirm your enrollment in a qualifying HDHP — and your continued absence of disqualifying coverage — before electing HSA contributions, and you are responsible for monitoring your own HSA eligibility throughout the Plan Year.");
      },
    }] : []),

    // FSA section (if any FSA enabled)
    ...(anyFSA ? [{
      build: (ctx: import("./pdf-builder").PDFContext) => {
        sectionTitle(ctx, "Flexible Spending Accounts (FSAs)");
        bodyText(ctx, "The Plan offers one or more Flexible Spending Accounts that allow you to set aside pre-tax dollars to pay for eligible health care or dependent care expenses, depending on the FSAs elected in the Adoption Agreement.");
        bodyText(ctx, "How do I elect an FSA?", { bold: true });
        bodyText(ctx, "Before each Plan Year (or during your initial Election Period), you elect the dollar amount you wish to contribute to each FSA. Your election is binding for the entire Plan Year, except as permitted under the change-in-status rules described above. The amount you elect is deducted from your paycheck in equal installments over the Plan Year on a pre-tax basis.");
        bodyText(ctx, "How are reimbursements made?", { bold: true });
        bodyText(ctx, "To receive reimbursement from an FSA, you must submit a claim with appropriate documentation (such as receipts and Explanation of Benefits) showing that the expense was incurred during the Plan Year (or any applicable run-out, carryover, or grace period) and is an eligible expense under the Code. The Plan Administrator will reimburse approved claims up to your account balance, subject to any uniform coverage rules applicable to the Health FSA.");
        bodyText(ctx, "What happens to unused FSA balances at year-end?", { bold: true });
        bodyText(ctx, "Under the “use-it-or-lose-it” rule, amounts remaining in an FSA at the end of the Plan Year (and any applicable run-out, grace period, or carryover) are forfeited. The Adoption Agreement specifies whether the Plan offers a grace period (up to 2½ months following the end of the Plan Year) or a carryover (up to the IRS-specified annual limit) for the Health FSA. The Dependent Care FSA does not permit a carryover but may permit a grace period.");
        bodyText(ctx, "What expenses are eligible?", { bold: true });
        bodyText(ctx, "Eligible expenses for the Health FSA are unreimbursed medical expenses for you, your spouse, and your tax dependents, as defined in Code Section 213(d) (excluding insurance premiums and long-term care expenses). Eligible expenses for the Dependent Care FSA are work-related expenses incurred for the care of a qualifying child under age 13 or other qualifying individual, as defined in Code Section 21(b). Limited Purpose and Post-Deductible FSAs cover only specified categories (such as dental, vision, and preventive-care expenses) so that you may remain eligible to contribute to an HSA.");
      },
    }] : []),

    // Continuation + QMCSO summary
    { build: (ctx) => {
      sectionTitle(ctx, "Continuation of Coverage");
      bodyText(ctx, "If the Employer normally employs 20 or more employees on a typical business day during the preceding calendar year and group health plan benefits have been selected, you, your spouse, and your dependent children may have the right to continue group health coverage under the Consolidated Omnibus Budget Reconciliation Act of 1985, as amended (“COBRA”) following a qualifying event. You may also have the right to continue group health coverage during an FMLA leave or a period of qualified uniformed service under USERRA. The detailed continuation provisions, including the maximum periods of coverage, premium requirements, and notice obligations, are set forth in the Adoption Agreement and the Basic Plan Document. You may obtain a copy of those documents from the Plan Administrator without charge.");

      sectionTitle(ctx, "Qualified Medical Child Support Orders");
      bodyText(ctx, "Federal law requires that the Plan recognize Qualified Medical Child Support Orders (“QMCSOs”) and National Medical Support Notices that satisfy the requirements of Section 609 of ERISA. You may obtain, without charge, a copy of the Plan’s written QMCSO procedures from the Plan Administrator.");
    }},

    // ERISA Rights Statement
    { build: (ctx) => getErisaRightsPDFBuilder(ctx) },
  ];
}
