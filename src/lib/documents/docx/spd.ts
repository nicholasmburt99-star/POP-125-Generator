import { Paragraph } from "docx";
import type { FormData } from "@/types";
import {
  coverPage,
  articleHeading,
  sectionTitle,
  body,
  bodyBold,
  bullet,
  pageBreak,
  emptyLine,
  horizontalRule,
} from "./docx-builder";
import {
  formatDate,
  formatMonthDay,
  benefitsList,
} from "../helpers";
import { getErisaRightsDocxParagraphs } from "../legal-text/erisa-rights";

export function buildSPDParagraphs(data: FormData): Paragraph[] {
  const name = data.employer.legalBusinessName;
  const effective = formatDate(data.plan.effectiveDate);
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = benefitsList(data.benefits);
  const ein = data.employer.ein;
  const addr1 = data.employer.streetAddress;
  const addr2 = `${data.employer.city}, ${data.employer.state} ${data.employer.zipCode}`;

  return [
    ...coverPage(name, addr1, addr2, "Section 125 Premium Only Plan", "Summary Plan Description", effective),
    pageBreak(),

    articleHeading("INTRODUCTION"),
    horizontalRule(),
    emptyLine(),
    body(`The Company\u2019s Premium Only Plan (\u201cPlan\u201d) has been established to allow Eligible Employees to pay for certain benefits on a pre-tax basis. There are specific benefits that you may elect, and they are outlined in this Summary Plan Description. You will also be informed about other important information concerning the Plan, such as the conditions you must satisfy before you can join and the laws that protect your rights.`),
    emptyLine(),
    body(`Read this Summary Plan Description (\u201cSPD\u201d) carefully so that you understand the provisions of the Plan and the benefits you will receive. This SPD describes the Plan\u2019s benefits and obligations as contained in the Plan document, which governs the operation of the Plan. If the non-technical language in this SPD and the legal language of the Plan document conflict, the Plan document will always govern.`),
    emptyLine(),
    body(`The Plan is subject to the Internal Revenue Code and other federal and state laws and regulations that may affect your rights under this plan. This Plan may be amended or terminated by the Company. If the Plan is ever amended or changed, the Company will notify you.`),
    pageBreak(),

    // OVERVIEW
    articleHeading("Overview"),
    horizontalRule(),
    emptyLine(),
    sectionTitle("General Information"),
    body(`1. The name of the Plan is the ${name} Premium Only Plan.`),
    body(`2. The company has adopted this Plan effective ${effective}.`),
    body(`3. This Plan\u2019s records are maintained over a twelve-month period. This is known as the Plan Year. The adopted plan year begins on ${pyStart} and ends on ${pyEnd}.`),
    body(`4. This Plan is unfunded, meaning that the funds to pay Benefits and to otherwise operate the Plan come from the general assets of the Employer.`),
    body(`5. Plan Number: 501.`),
    body(`6. Type of Plan: Premium Only Plan under Section 125 of the Internal Revenue Code.`),
    body(`7. Type of Plan Administration: Employer Administration.`),
    emptyLine(),

    sectionTitle("ERISA Status"),
    body(`This Plan is a cafeteria plan under Section 125 of the Internal Revenue Code. The Premium Only Plan itself is not an employee welfare benefit plan subject to the Employee Retirement Income Security Act of 1974, as amended (\u201cERISA\u201d). However, the underlying group medical, dental, vision, or other welfare benefits that you may pay for on a pre-tax basis through this Plan are generally separate employee welfare benefit plans subject to ERISA, and are governed by the policies, certificates, and plan documents issued for those benefits. Your ERISA rights with respect to the underlying group health, dental, and vision plans are described in the Statement of ERISA Rights set forth at the end of this Summary Plan Description and in the Summary Plan Descriptions for those underlying plans, which you may obtain from the Plan Administrator.`),
    emptyLine(),

    sectionTitle("Employer Information"),
    body(`Your Employer\u2019s name, address, and tax identification number are:`),
    emptyLine(),
    bodyBold(name),
    body(addr1),
    body(addr2),
    body(`Federal Employer I.D. Number: ${ein}`),
    emptyLine(),

    sectionTitle("Plan Administrator Information"),
    body(`The name, address, and tax identification number of your Plan\u2019s Administrator are:`),
    emptyLine(),
    bodyBold(name),
    body(addr1),
    body(addr2),
    body(`Federal Employer I.D. Number: ${ein}`),
    emptyLine(),
    body(`The Administrator keeps the records for the Plan and is responsible for the administration of the Plan. The Administrator will also answer any questions you may have about the Plan.`),
    emptyLine(),

    sectionTitle("Service of Legal Process"),
    body(`The name and address of the Plan\u2019s agent for service of legal process are:`),
    emptyLine(),
    bodyBold(name),
    body(addr1),
    body(addr2),
    body(`Federal Employer I.D. Number: ${ein}`),
    emptyLine(),
    body("The type of Plan administration is Employer Administration."),
    pageBreak(),

    // PLAN DETAILS
    articleHeading("Plan Details"),
    horizontalRule(),
    emptyLine(),

    sectionTitle("01. How Does This Plan Operate?"),
    body(`Before the start of each Plan Year, you will be able to elect to have some of your future salary or other compensation contributed to the Plan in lieu of receiving those amounts in cash, and your future salary or other compensation will be automatically reduced by the amount elected as a contribution to the Plan. The money contributed will be used to pay for benefits you have elected based on the options sponsored by your Employer. The portion of your pay that is contributed to pay for the benefits provided for under the Plan is not subject to State or Federal income or Social Security taxes. In other words, the Plan allows you to use tax-free dollars to pay for insurance coverage, premium amounts, or other allowable plan contributions or expenses which you normally pay for with out-of-pocket, taxable dollars.`),

    sectionTitle("02. What Happens to Contributions Made to the Plan?"),
    body(`Before each Plan Year begins, you will select the benefits or programs you desire to pay for through the Plan with your own pre-tax contributions. Then, during each pay period during that Plan Year, the contributions deducted from your paycheck will be used to pay your portion of your employer-sponsored benefit coverage. Any contribution amounts that are not used during a Plan year to provide insurance benefits will be forfeited and may not be paid to you in cash or used to provide benefits specifically for you in a later Plan year.`),

    sectionTitle("03. When Is the Election Period for Our Plan?"),
    body(`Your initial election period will start on the date you first meet the \u201celigibility requirements\u201d and end 30 days thereafter. Then, for each following Plan Year, the election period is established by the Administrator and applied uniformly to all participants. The Administrator will inform you each year about the election period.`),

    sectionTitle("04. May I Change My Elections During the Plan Year?"),
    body(`Generally, you cannot change the elections you have made after the beginning of the Plan Year. However, there are certain limited situations when you can change your elections. You are permitted to change elections if you have a \u201cchange in status\u201d and you make an election change that is consistent with the \u201cchange in status.\u201d Currently, Federal law considers the following events to be \u201cchanges in status\u201d:`),
    bullet("Marriage, divorce, death of a spouse, legal separation or annulment"),
    bullet("Change in the number of dependents, including birth, adoption, placement for adoption, or death of a dependent"),
    bullet("Any of the following events for you, your spouse or dependent: commencement or termination of employment, a strike or lockout, commencement of or return from an unpaid leave of absence, a change in worksite, or any other change in employment status that affects eligibility for benefits"),
    bullet("One of your dependents satisfies or ceases to satisfy the requirements for coverage due to change in age, student status, or any similar circumstance"),
    bullet("A change in the place of residence of you, or your spouse or dependent"),
    ...(data.elections.allowChangeBelow30Hours ? [
      bullet("A change in your Full-Time status that results in a reduction in work hours that are consistently below an average of 30 hours per week"),
    ] : []),
    ...(data.elections.allowChangeMarketplace ? [
      bullet("When you or your dependents elect to enroll in a qualified health plan in a Marketplace during the Annual Open Enrollment or a qualifying Special Enrollment Period of that Marketplace"),
    ] : []),

    sectionTitle("05. May I Make New Elections in Future Plan Years?"),
    body(
      data.elections.employeeElections === "first_year_only"
        ? `You will automatically be enrolled in subsequent plan years unless you terminate your participation in the Plan by notifying the Administrator in writing during the Election Period that you do not want to participate in the Plan for the next Plan Year.`
        : `You must complete a new election form each year during the Election Period to continue participation in the Plan.`
    ),

    sectionTitle("06. What Insurance Coverage May I Purchase?"),
    body(`Under our Plan, you can choose to receive your entire compensation in taxable compensation or use a portion to pay premiums on a pre-tax basis for any one or more insured benefits that we decide to offer through the Plan. You may purchase:`),
    ...benefits.map((b) => bullet(b)),

    sectionTitle("07. Will My Social Security Benefits Be Affected?"),
    body(`Your Social Security benefits may be slightly reduced, because when you use part of your compensation to pay for insurance premiums on a tax-free basis under our Plan, it reduces the amount of contributions that you make to the Federal Social Security system as well as our contribution to Social Security on your behalf.`),

    sectionTitle("08. Do Limitations Apply to Highly Compensated Employees?"),
    body(`Under the Internal Revenue Code, \u201chighly compensated employees\u201d and \u201ckey employees\u201d generally are Participants who are officers, shareholders or are highly paid. If you are within either of these categories, the amount of contributions and benefits for you may be limited so that the Plan as a whole does not unfairly favor those who are highly paid, key employees, or their spouses or dependents.`),

    sectionTitle("09. What Happens If I Terminate Employment?"),
    body(`If you leave our employ during the Plan Year, you will remain covered by insurance, but only for the period for which premiums have been paid prior to your termination of employment. Any amounts that are not used during a Plan Year to provide benefits will be forfeited.`),

    sectionTitle("10. Qualified Medical Child Support Order"),
    body(`A medical child support order is a judgment, decree or order made under state law that provides for child support or health coverage for the child of a Participant. You may obtain, without charge, a copy of the procedures governing the determination of qualified medical child support orders from the Plan Administrator.`),

    sectionTitle("11. What Are My Rights to Continue Coverage Under COBRA?"),
    body(`If the Employer normally employs 20 or more employees on a typical business day during the preceding calendar year and group health plan benefits have been selected, you, your spouse, and your dependent children may have the right to continue group health coverage under the Consolidated Omnibus Budget Reconciliation Act of 1985, as amended (“COBRA”) following a qualifying event such as termination of employment, reduction in hours, divorce or legal separation, death of the covered employee, the covered employee’s entitlement to Medicare, or a dependent child ceasing to be a dependent under the Plan. The detailed COBRA continuation provisions, including the maximum periods of coverage, premium requirements, and notice obligations, are set forth in the Plan Document. You may obtain a copy of the Plan Document from the Plan Administrator without charge.`),

    ...(data.employer.stateOfGoverningLaw === "CA" ? [
      sectionTitle("12. California Continuation Coverage (Cal-COBRA)"),
      body(`If the Employer normally employs from two (2) to nineteen (19) employees on at least 50% of its working days during the preceding calendar year (or, in the case of a new employer, the preceding calendar quarter) and the Employer’s group health coverage is provided through an insurance policy or health care service plan contract issued in California, you and your qualified beneficiaries may have the right to continue group health coverage under the California Continuation Benefits Replacement Act (“Cal-COBRA”) following a qualifying event. Cal-COBRA continuation coverage generally provides up to 36 months of continued coverage from the date of the qualifying event. The premium for Cal-COBRA continuation coverage may not exceed 110% of the applicable group rate (or 150% during a disability extension). Cal-COBRA continuation coverage is administered by the issuer of the underlying insurance policy or health care service plan contract. For employers subject to federal COBRA, Cal-COBRA may also extend federal COBRA continuation coverage by up to a total of 36 months for qualified beneficiaries whose federal COBRA coverage expires before reaching the 36-month maximum. Detailed information about Cal-COBRA, including the election period, notice procedures, and termination events, is available from the insurance carrier and from the Plan Administrator.`),
    ] : []),

    sectionTitle(`${data.employer.stateOfGoverningLaw === "CA" ? "13" : "12"}. Health Savings Account (HSA) Compatibility`),
    body(`If you are enrolled in a high-deductible health plan (“HDHP”) offered by the Employer that meets the requirements of Section 223 of the Internal Revenue Code, and you are otherwise eligible to contribute to a Health Savings Account (“HSA”) under Section 223, you may also elect to make pre-tax contributions to an HSA through this Plan’s salary reduction mechanism, subject to the annual statutory contribution limits set by the Internal Revenue Service. To be eligible to contribute to an HSA, you must (a) be enrolled in an HDHP, (b) not be covered under any other health plan that is not an HDHP (other than permitted insurance and disregarded coverage such as dental, vision, accident, disability, long-term care, and certain limited-purpose or post-deductible health flexible spending arrangements), (c) not be enrolled in Medicare, and (d) not be claimed as a dependent on another person’s federal income tax return. You are solely responsible for determining your own HSA eligibility, opening and maintaining the HSA with a qualified trustee or custodian, and ensuring that contributions do not exceed the annual statutory limit. The Employer is not required to establish, maintain, or fund an HSA on your behalf, and the Employer does not verify your ongoing HSA eligibility.`),

    sectionTitle(`${data.employer.stateOfGoverningLaw === "CA" ? "14" : "13"}. Claims and Appeals Procedure`),
    body(`Because this Plan is a Premium Only Plan, claims for the underlying group health, dental, vision, and other welfare benefits are governed by the claims and appeals procedures set forth in the policy, certificate, or plan document for each underlying benefit. Those procedures generally provide an initial claim determination period, the right to appeal an adverse benefit determination, and, in some cases, the right to a second-level or external review. You should refer to the Summary Plan Description, certificate of insurance, or evidence of coverage for the applicable benefit for the specific timeframes, notice requirements, and appeal procedures.`),
    body(`If you have a dispute concerning your eligibility to participate in this Plan, your salary redirection election, the application of a change-in-status rule, or any other administrative matter under this Plan (rather than a claim for benefits under an underlying insurance contract), you may submit a written claim to the Plan Administrator. The Plan Administrator will review the claim and provide a written response, generally within 90 days after receipt (which may be extended by an additional 90 days for special circumstances, with written notice to you). If the claim is denied in whole or in part, the written response will explain the specific reasons for the denial, the Plan provisions on which the denial is based, any additional information needed to perfect the claim, and the procedure for appeal. You may appeal an adverse determination by submitting a written appeal to the Plan Administrator within 60 days after receipt of the denial. The Plan Administrator will issue a final written decision generally within 60 days after receipt of the appeal (which may be extended by an additional 60 days for special circumstances, with written notice to you).`),

    sectionTitle(`${data.employer.stateOfGoverningLaw === "CA" ? "15" : "14"}. HIPAA Special Enrollment Rights`),
    body(`If you decline enrollment for yourself or your dependents (including your spouse) in a group health benefit option offered through this Plan because of other health insurance or group health plan coverage, you may be able to enroll yourself and your dependents in such benefit option in the future, provided that you request enrollment within 30 days after the other coverage ends (or after the employer stops contributing toward the other coverage).`),
    body(`In addition, if you have a new dependent as a result of marriage, birth, adoption, or placement for adoption, you may be able to enroll yourself and your dependents in a group health benefit option offered through this Plan, provided that you request enrollment within 30 days after the marriage, birth, adoption, or placement for adoption.`),
    body(`Further, if you or your dependents lose eligibility for coverage under a Medicaid plan or a state Children’s Health Insurance Program (“CHIP”), or if you or your dependents become eligible for premium assistance under Medicaid or CHIP with respect to coverage under a group health benefit option offered through this Plan, you may be able to enroll yourself and your dependents in such benefit option, provided that you request enrollment within 60 days after the loss of Medicaid/CHIP coverage or after the determination of premium assistance eligibility.`),
    body(`To request a HIPAA special enrollment, contact the Plan Administrator. A request for special enrollment will be processed in accordance with the rules of the underlying group health benefit option and applicable law.`),

    sectionTitle(`${data.employer.stateOfGoverningLaw === "CA" ? "16" : "15"}. Premium Assistance Under Medicaid and the Children’s Health Insurance Program (CHIP)`),
    body(`If you or your children are eligible for Medicaid or CHIP and you are eligible for health coverage from your Employer, your state may have a premium assistance program that can help pay for your group health coverage. If you or your dependents are not currently enrolled in Medicaid or CHIP, you may apply for coverage by contacting your state Medicaid or CHIP office or by calling 1-877-KIDS NOW (1-877-543-7669) or visiting www.insurekidsnow.gov. If you qualify, you can ask your state whether it has a program that might help you pay the premiums for your group health coverage. If you or your dependents are eligible for premium assistance under Medicaid or CHIP, as well as eligible under your Employer’s group health plan, your Employer must permit you to enroll in the group health plan if you are not already enrolled. This is called a “special enrollment” opportunity, and you must request coverage within 60 days of being determined eligible for premium assistance. For more information about CHIP and Medicaid premium assistance, contact the Employee Benefits Security Administration at 1-866-444-EBSA (3272) or visit www.askebsa.dol.gov.`),

    pageBreak(),
    ...getErisaRightsDocxParagraphs(),
  ];
}
