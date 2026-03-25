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
  ];
}
