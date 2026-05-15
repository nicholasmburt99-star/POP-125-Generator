import type { FormData } from "@/types";
import { COVERAGE_TYPE_LABELS } from "@/types";
import type { PDFSection } from "./pdf-builder";
import { coverPage, articleHeading, sectionTitle, bodyText, bulletItem, emptyLine } from "./pdf-builder";
import { formatDate, formatMonthDay, benefitsList } from "../helpers";
import { getErisaRightsPDFBuilder } from "../legal-text/erisa-rights";

export function buildSPDPDFSections(data: FormData): PDFSection[] {
  const name = data.employer.legalBusinessName;
  const effective = formatDate(data.plan.effectiveDate);
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = benefitsList(data.benefits);
  const ein = data.employer.ein;
  const addr1 = data.employer.streetAddress;
  const addr2 = `${data.employer.city}, ${data.employer.state} ${data.employer.zipCode}`;

  return [
    { build: (ctx) => coverPage(ctx, name, addr1, addr2, "Section 125 Premium Only Plan", "Summary Plan Description", effective) },
    { build: (ctx) => {
      articleHeading(ctx, "INTRODUCTION");
      bodyText(ctx, `The Company\u2019s Premium Only Plan has been established to allow Eligible Employees to pay for certain benefits on a pre-tax basis. Read this Summary Plan Description carefully so that you understand the provisions of the Plan.`);
      bodyText(ctx, "This Plan is a Premium Only Plan under Section 125 of the Internal Revenue Code \u2014 the narrow type of cafeteria plan. It allows you to pay your share of insurance premiums (typically medical, dental, vision, and group term life) on a pre-tax basis through salary reduction. It does not allow pre-tax contributions to Health Savings Accounts (HSAs), Flexible Spending Accounts (FSAs), Dependent Care Assistance Plans, or other reimbursement accounts; those features require a full Cafeteria Plan, which your Employer has not adopted.");
      bodyText(ctx, "This Summary Plan Description summarizes the terms of the Premium Only Plan Document. If anything in this SPD conflicts with the terms of the Plan Document, the Plan Document controls. If the terms of the Plan Document conflict with the underlying Insurance Contract\u2019s description of benefits, the Insurance Contract controls as to those benefits.");
      emptyLine(ctx);
      articleHeading(ctx, "Overview");
      sectionTitle(ctx, "General Information");
      bodyText(ctx, `1. The name of the Plan is the ${name} Premium Only Plan.`);
      bodyText(ctx, `2. The company has adopted this Plan effective ${effective}.`);
      bodyText(ctx, `3. The Plan Year begins on ${pyStart} and ends on ${pyEnd}.`);
      bodyText(ctx, "4. This Plan is unfunded.");
      bodyText(ctx, "5. Plan Number: 501. (501 is the default for the Employer’s first welfare benefit plan. If the Employer maintains other welfare benefit plans subject to Form 5500 filing, consult ERISA counsel to determine the correct Plan Number for this Plan.)");
      bodyText(ctx, "6. Type of Plan: Premium Only Plan under Section 125 of the Internal Revenue Code.");
      bodyText(ctx, "7. Type of Plan Administration: Employer Administration.");
      bodyText(ctx, `8. Number of Employees: ${data.employer.numberOfEmployees || "Not provided"}.`);
      emptyLine(ctx);
      sectionTitle(ctx, "ERISA Status");
      bodyText(ctx, "This Plan is a cafeteria plan under Section 125 of the Internal Revenue Code. The Premium Only Plan itself is not an employee welfare benefit plan subject to the Employee Retirement Income Security Act of 1974, as amended (“ERISA”). However, the underlying group medical, dental, vision, or other welfare benefits that you may pay for on a pre-tax basis through this Plan are generally separate employee welfare benefit plans subject to ERISA, and are governed by the policies, certificates, and plan documents issued for those benefits. Your ERISA rights with respect to the underlying group health, dental, and vision plans are described in the Statement of ERISA Rights set forth at the end of this Summary Plan Description and in the Summary Plan Descriptions for those underlying plans, which you may obtain from the Plan Administrator.");
      emptyLine(ctx);
      sectionTitle(ctx, "Employer / Plan Administrator / Agent for Legal Process");
      bodyText(ctx, name, { bold: true });
      bodyText(ctx, `${addr1}, ${addr2}`);
      bodyText(ctx, `Federal Employer I.D. Number: ${ein}`);
      if (data.contacts.primaryContact.name) {
        bodyText(ctx, `Plan Administrator Contact: ${data.contacts.primaryContact.name}${data.contacts.primaryContact.title ? `, ${data.contacts.primaryContact.title}` : ""}`);
        bodyText(ctx, `Email: ${data.contacts.primaryContact.email}    Phone: ${data.contacts.primaryContact.phone}`);
      }
      emptyLine(ctx);

      sectionTitle(ctx, "In-Force Insurance Plans");
      bodyText(ctx, "This Plan facilitates pre-tax payment of premiums for the following Employer-sponsored welfare benefit plans, each of which is a separate ERISA-governed welfare benefit plan (where applicable). For full plan details, refer to the policy documents and Summary of Benefits and Coverage (SBC) provided by each carrier.");
      if (data.insurancePolicies.length === 0) {
        bodyText(ctx, "No in-force insurance plans have been documented in this Summary Plan Description. Contact the Plan Administrator for current plan details.");
      } else {
        data.insurancePolicies.forEach((p) => {
          const ctLabel = p.coverageType === "other" && p.coverageTypeOther ? p.coverageTypeOther : COVERAGE_TYPE_LABELS[p.coverageType];
          const eff = p.effectiveDate ? formatDate(p.effectiveDate) : "(effective date not provided)";
          bodyText(ctx, `${ctLabel} — Carrier: ${p.carrierName || "(carrier not provided)"}; Policy No.: ${p.policyNumber || "(not provided)"}; Effective: ${eff}.`);
        });
      }
    }},
    { build: (ctx) => {
      articleHeading(ctx, "Plan Details");
      sectionTitle(ctx, "01. How Does This Plan Operate?");
      bodyText(ctx, "You may elect to have salary contributed to the Plan to pay for benefits on a pre-tax basis, reducing your State and Federal income and Social Security taxes.");
      sectionTitle(ctx, "02. What Happens to Contributions?");
      bodyText(ctx, "Contributions deducted from your paycheck are remitted to the insurance carrier to pay your portion of employer-sponsored benefit coverage. If you cease participation and any Salary Redirections have been withheld but not yet remitted to the carrier for a future period of coverage, those amounts will be refunded to you in accordance with the Plan and applicable law.");
      sectionTitle(ctx, "03. Election Period");
      bodyText(ctx, "Your initial election period starts on the date you meet eligibility requirements and ends 30 days thereafter.");
      sectionTitle(ctx, "04. May I Change Elections During the Plan Year?");
      bodyText(ctx, "Generally no, unless you have a qualifying change in status:");
      bulletItem(ctx, "Marriage, divorce, death of a spouse, legal separation or annulment");
      bulletItem(ctx, "Change in the number of dependents");
      bulletItem(ctx, "Changes in employment status affecting eligibility");
      bulletItem(ctx, "A dependent satisfies or ceases to satisfy eligibility requirements");
      bulletItem(ctx, "A change in place of residence");
      if (data.elections.allowChangeBelow30Hours) bulletItem(ctx, "Reduction in work hours below 30 per week");
      if (data.elections.allowChangeMarketplace) bulletItem(ctx, "Eligibility for Marketplace enrollment");
      sectionTitle(ctx, "05. Future Plan Year Elections");
      bodyText(ctx, data.elections.employeeElections === "first_year_only"
        ? "You will be automatically enrolled unless you terminate participation in writing."
        : "You must complete a new election form each year.");
      sectionTitle(ctx, "06. What Coverage May I Purchase?");
      benefits.forEach((b) => bulletItem(ctx, b));
      sectionTitle(ctx, "07. Social Security Impact");
      bodyText(ctx, "Your Social Security benefits may be slightly reduced due to pre-tax contributions.");
      sectionTitle(ctx, "08. Termination of Employment");
      bodyText(ctx, "You remain covered only for the period for which premiums have been paid. Any Salary Redirection amounts withheld but not yet remitted to the carrier for a period of coverage beginning on or after your termination date will be refunded to you.");
      sectionTitle(ctx, "09. Qualified Medical Child Support Order");
      bodyText(ctx, "A medical child support order is a judgment, decree or order made under state law that provides for child support or health coverage for the child of a Participant. You may obtain, without charge, a copy of the procedures governing the determination of qualified medical child support orders from the Plan Administrator.");
      sectionTitle(ctx, "10. What Are My Rights to Continue Coverage Under COBRA?");
      bodyText(ctx, "If the Employer normally employs 20 or more employees on a typical business day during the preceding calendar year and group health plan benefits have been selected, you, your spouse, and your dependent children may have the right to continue group health coverage under the Consolidated Omnibus Budget Reconciliation Act of 1985, as amended (“COBRA”) following a qualifying event such as termination of employment, reduction in hours, divorce or legal separation, death of the covered employee, the covered employee’s entitlement to Medicare, or a dependent child ceasing to be a dependent under the Plan. The detailed COBRA continuation provisions are set forth in the Plan Document. You may obtain a copy of the Plan Document from the Plan Administrator without charge.");

      const isCA = data.employer.stateOfGoverningLaw === "CA";
      let n = 11;
      if (isCA) {
        sectionTitle(ctx, `${n}. California Continuation Coverage (Cal-COBRA)`);
        bodyText(ctx, "If the Employer normally employs from two (2) to nineteen (19) employees on at least 50% of its working days during the preceding calendar year (or, in the case of a new employer, the preceding calendar quarter) and the Employer’s group health coverage is provided through an insurance policy or health care service plan contract issued in California, you and your qualified beneficiaries may have the right to continue group health coverage under the California Continuation Benefits Replacement Act (“Cal-COBRA”) following a qualifying event. Cal-COBRA continuation coverage generally provides up to 36 months of continued coverage from the date of the qualifying event. The premium for Cal-COBRA continuation coverage may not exceed 110% of the applicable group rate (or 150% during a disability extension). Cal-COBRA continuation coverage is administered by the issuer of the underlying insurance policy or health care service plan contract. For employers subject to federal COBRA, Cal-COBRA may also extend federal COBRA continuation coverage by up to a total of 36 months for qualified beneficiaries whose federal COBRA coverage expires before reaching the 36-month maximum. Detailed information about Cal-COBRA, including the election period, notice procedures, and termination events, is available from the insurance carrier and from the Plan Administrator.");
        n++;
      }

      sectionTitle(ctx, `${n}. Claims and Appeals Procedure`);
      bodyText(ctx, "Because this Plan is a Premium Only Plan, claims for the underlying group health, dental, vision, and other welfare benefits are governed by the claims and appeals procedures set forth in the policy, certificate, or plan document for each underlying benefit. Those procedures generally provide an initial claim determination period, the right to appeal an adverse benefit determination, and, in some cases, the right to a second-level or external review. You should refer to the Summary Plan Description, certificate of insurance, or evidence of coverage for the applicable benefit for the specific timeframes, notice requirements, and appeal procedures.");
      bodyText(ctx, "If you have a dispute concerning your eligibility to participate in this Plan, your salary redirection election, the application of a change-in-status rule, or any other administrative matter under this Plan (rather than a claim for benefits under an underlying insurance contract), you may submit a written claim to the Plan Administrator. The Plan Administrator will review the claim and provide a written response, generally within 90 days after receipt (which may be extended by an additional 90 days for special circumstances, with written notice to you). If the claim is denied in whole or in part, the written response will explain the specific reasons for the denial, the Plan provisions on which the denial is based, any additional information needed to perfect the claim, and the procedure for appeal. You may appeal an adverse determination by submitting a written appeal to the Plan Administrator within 60 days after receipt of the denial. The Plan Administrator will issue a final written decision generally within 60 days after receipt of the appeal (which may be extended by an additional 60 days for special circumstances, with written notice to you).");
      n++;

      sectionTitle(ctx, `${n}. HIPAA Special Enrollment Rights`);
      bodyText(ctx, "If you decline enrollment for yourself or your dependents (including your spouse) in a group health benefit option offered through this Plan because of other health insurance or group health plan coverage, you may be able to enroll yourself and your dependents in such benefit option in the future, provided that you request enrollment within 30 days after the other coverage ends (or after the employer stops contributing toward the other coverage).");
      bodyText(ctx, "In addition, if you have a new dependent as a result of marriage, birth, adoption, or placement for adoption, you may be able to enroll yourself and your dependents in a group health benefit option offered through this Plan, provided that you request enrollment within 30 days after the marriage, birth, adoption, or placement for adoption.");
      bodyText(ctx, "Further, if you or your dependents lose eligibility for coverage under a Medicaid plan or a state Children’s Health Insurance Program (“CHIP”), or if you or your dependents become eligible for premium assistance under Medicaid or CHIP with respect to coverage under a group health benefit option offered through this Plan, you may be able to enroll yourself and your dependents in such benefit option, provided that you request enrollment within 60 days after the loss of Medicaid/CHIP coverage or after the determination of premium assistance eligibility.");
      bodyText(ctx, "To request a HIPAA special enrollment, contact the Plan Administrator. A request for special enrollment will be processed in accordance with the rules of the underlying group health benefit option and applicable law.");
      n++;

      sectionTitle(ctx, `${n}. Premium Assistance Under Medicaid and the Children’s Health Insurance Program (CHIP)`);
      bodyText(ctx, "If you or your children are eligible for Medicaid or CHIP and you are eligible for health coverage from your Employer, your state may have a premium assistance program that can help pay for your group health coverage. If you or your dependents are not currently enrolled in Medicaid or CHIP, you may apply for coverage by contacting your state Medicaid or CHIP office or by calling 1-877-KIDS NOW (1-877-543-7669) or visiting www.insurekidsnow.gov. If you qualify, you can ask your state whether it has a program that might help you pay the premiums for your group health coverage. If you or your dependents are eligible for premium assistance under Medicaid or CHIP, as well as eligible under your Employer’s group health plan, your Employer must permit you to enroll in the group health plan if you are not already enrolled. This is called a “special enrollment” opportunity, and you must request coverage within 60 days of being determined eligible for premium assistance. For more information about CHIP and Medicaid premium assistance, contact the Employee Benefits Security Administration at 1-866-444-EBSA (3272) or visit www.askebsa.dol.gov.");
      n++;

      if (data.benefits.groupMedical || data.benefits.groupDental || data.benefits.groupVision) {
        sectionTitle(ctx, `${n}. Summary of Benefits and Coverage (SBC)`);
        bodyText(ctx, "For each group health plan option available through this Plan, you will receive a Summary of Benefits and Coverage (“SBC”) that describes the benefits, cost-sharing, and coverage limitations of that option in a standardized format prescribed by federal regulations. You are entitled to receive an SBC at open enrollment, upon request, and upon enrollment (45 C.F.R. §147.200). The SBC is provided by the insurance carrier (or, for self-funded coverage, by the Plan Administrator) rather than by this Plan itself. To request an SBC, contact the Plan Administrator or the applicable insurance carrier.");
      }
    }},
    { build: (ctx) => getErisaRightsPDFBuilder(ctx) },
  ];
}
