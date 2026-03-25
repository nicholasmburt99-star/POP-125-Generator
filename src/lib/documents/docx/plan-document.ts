import { Paragraph } from "docx";
import type { FormData } from "@/types";
import {
  coverPage,
  articleHeading,
  sectionTitle,
  definitionItem,
  body,
  bodyBold,
  bullet,
  signatureBlock,
  pageBreak,
  emptyLine,
  horizontalRule,
} from "./docx-builder";
import {
  formatDate,
  formatMonthDay,
  stateName,
  entityLabel,
  benefitsList,
} from "../helpers";

export function buildPlanDocumentParagraphs(data: FormData): Paragraph[] {
  const name = data.employer.legalBusinessName;
  const effective = formatDate(data.plan.effectiveDate);
  const pyStart = formatMonthDay(data.plan.planYearStart);
  const pyEnd = formatMonthDay(data.plan.planYearEnd);
  const benefits = benefitsList(data.benefits);
  const govLaw = stateName(data.employer.stateOfGoverningLaw);
  const entity = entityLabel(data);
  const addr1 = data.employer.streetAddress;
  const addr2 = `${data.employer.city}, ${data.employer.state} ${data.employer.zipCode}`;

  return [
    // ===== TITLE PAGE =====
    ...coverPage(name, addr1, addr2, "Section 125 Premium Only Plan", "Plan Document", effective),
    pageBreak(),

    // ===== TABLE OF CONTENTS =====
    articleHeading("TABLE OF CONTENTS"),
    emptyLine(),
    body("I. Article - Definitions"),
    body("II. Article - Participation"),
    body("III. Article - Contributions to the Plan"),
    body("IV. Article - Benefits"),
    body("V. Article - Participant Elections"),
    body("VI. Article - Administration"),
    body("VII. Article - Amendment or Termination of Plan"),
    body("VIII. Article - Miscellaneous"),
    pageBreak(),

    // ===== INTRODUCTION =====
    articleHeading("Introduction"),
    body(`The company has adopted this Plan effective ${effective}. Its purpose is to provide benefits for those Employees who shall qualify hereunder and their Dependents and beneficiaries. The concept of this Plan is to allow Employees to elect between cash compensation or certain nontaxable benefit options as they desire. The Plan shall be known as the ${name} Premium Only Plan (the \u201cPlan\u201d).`),
    emptyLine(),

    // ===== ARTICLE I =====
    articleHeading("I. Article - Definitions"),
    horizontalRule(),
    emptyLine(),

    definitionItem("01", "Administrator", `means the individual(s) or corporation appointed by the Employer to carry out the administration of the Plan. The Employer shall be empowered to appoint and remove the Administrator from time to time as it deems necessary for the proper administration of the plan. In the event an Administrator has not been appointed, or resigns from an appointment, the Employer shall be deemed to be the Administrator.`),
    definitionItem("02", "Benefit", `means any of the optional benefit choices available to a Participant as outlined in the Section titled: \u201cBenefit Options\u201d.`),
    definitionItem("03", "Code", `means Section 125 of the Internal Revenue Code of 1986, as amended or replaced from time to time, and any governing regulations or applicable guidance thereunder.`),
    definitionItem("04", "Compensation", `means the total cash remuneration received by the Participant from the Employer during a Plan Year, prior to any reductions pursuant to an Election to Participate form authorized hereunder.`),
    definitionItem("05", "Dependent", `means any individual who is so defined under an Insurance Contract or who is (i) a Qualifying Child (within the meaning of Code Section 152(c), subject to the exceptions of Code Section 152(b)) or Participant\u2019s child (within the meaning of Code Section 152(f)(1)) who has not attained age 27 as of the end of the taxable year, or (ii) a Qualifying Relative who qualifies as a dependent under an Insurance Contract or under (within the meaning of Code Section 152(d), subject to the exceptions of Code Section 152(b)) (as modified by Code Section 105(b)), as applicable. Notwithstanding anything in the Plan to the contrary, the Plan will comply with Michelle\u2019s Law.`),
    definitionItem("06", "Effective Date", `means the effective date of the Plan which is ${effective}.`),
    definitionItem("07", "Election Period", `means the period immediately preceding the beginning of each Plan Year established by the Administrator for the election of Benefits and Salary Redirections, such period to be applied on a uniform and nondiscriminatory basis for all Employees and Participants. However, an Employee\u2019s initial Election Period shall be determined pursuant to the Section titled: \u201cInitial Elections\u201d.`),
    definitionItem("08", "Eligible Employee", `means any Employee who has satisfied the provisions of the Section titled: \u201cEligibility\u201d. However, 2% shareholders as defined under Code Section 1372(b) and self-employed individuals as defined under Code Section 401(c) shall not be eligible to participate in this Plan. An individual shall not be an \u201cEligible Employee\u201d if such individual is not reported on the payroll records of the Employer as a common law employee.`),
    definitionItem("09", "Employee", `means any person who is employed by the Employer, but generally excludes any person who is employed as an independent contractor and any person who is considered self-employed under Code Section 401(c), as well as any person who is a greater than two percent (2%) shareholder in a Subchapter S corporation, a partner in a partnership or an owner or member of a limited liability company that elects partnership status on its tax return. The term Employee shall include leased employees within the meaning of Code Section 414(n)(2), unless excluded by the terms of an Insurance Contract.`),
    definitionItem("10", "Employer", `means the ${entity} or any such entity specified in Item 1 of the Adoption Agreement, and any Affiliated Employer that adopts this Plan; and any successor that maintains this Plan; and any predecessor that has maintained this Plan.`),
    definitionItem("11", "Highly Compensated Employee", `means, for the purposes of determining discrimination, an Employee so described in Code Section 125 and the Treasury Regulations thereunder.`),
    definitionItem("12", "Insurance Contract", `means any contract issued by an Insurer underwriting a Benefit, or any self-funded arrangement providing any Benefit offered for health and welfare coverage to Eligible Employees of the Employer.`),
    definitionItem("13", "Insurance Premium Payment Plan", `means the plan of benefits contained in the Section titled: \u201cBenefit Options\u201d of this Plan, that provides for the payment of Premium Expenses.`),
    definitionItem("14", "Insurer", `means any insurance company that underwrites a Benefit or any self-funded arrangement under this Plan.`),
    definitionItem("15", "Key Employee", `means an employee defined in Code Section 416(i)(1) and the Treasury regulations thereunder.`),
    definitionItem("16", "Participant", `means any Eligible Employee who elects to become a Participant pursuant to the Section titled: \u201cApplication to Participate\u201d and has not for any reason become ineligible to participate further in the Plan.`),
    definitionItem("17", "Plan", `means the Section 125 Premium Only Plan described in this instrument, including all amendments thereto.`),
    definitionItem("18", "Plan Year", `means the 12-month period beginning and ending on the dates specified in the Adoption Agreement. The Plan Year shall be the coverage period for the Benefits provided for under this Plan.`),
    definitionItem("19", "Premium Expenses", `or \u201cPremiums\u201d mean the Participant\u2019s cost for the insured Benefits described in the Section titled: \u201cBenefit Options\u201d.`),
    definitionItem("20", "Salary Redirection", `means the contributions made by the Employer on behalf of Participants in accordance with the Section titled: \u201cSalary Redirection\u201d. These contributions shall be allocated to the funds or accounts established for cost of applicable Benefits provided under the Plan pursuant to the Participants\u2019 elections made under the Article titled: \u201cParticipant Elections\u201d.`),
    definitionItem("21", "Spouse", `means \u201cspouse\u201d as defined in an Insurance Contract, then, for purposes of coverage under that Insurance Contract only, \u201cspouse\u201d shall have the meaning stated in the Insurance Contract. In all other cases, \u201cspouse\u201d shall have the meaning stated under applicable federal or state law.`),
    definitionItem("22", "Uniformed Services", `means the Armed Forces, the Army National Guard, and the Air National Guard when engaged in active duty for training, inactive duty training, or full-time National Guard duty, the commissioned corps of the Public Health Service, and any other category of persons designated by the President of the United States in time of war or emergency.`),

    // ===== ARTICLE II =====
    pageBreak(),
    articleHeading("II. Article - Participation"),
    horizontalRule(),

    sectionTitle("01. Eligibility"),
    body(`As to each Benefit provided hereunder, any Eligible Employee shall be eligible to participate as of the date he or she satisfies the eligibility conditions set forth in the policy or plan providing such Benefit (the \u201cEligibility Requirements\u201d), the provisions of which are specifically incorporated herein by reference.`),

    sectionTitle("02. Effective Date of Participation"),
    body(`(a) An Eligible Employee shall become a Participant effective as of the later of the date on which he or she satisfies the Eligibility Requirements of the Plan or the Effective Date of this Plan.`),
    body(`(b) If an Eligible Employee terminates employment after commencing participation in the Plan, and such terminated Eligible Employee is rehired within 30 days or less of the date of termination, such rehired Eligible Employee shall not be considered a newly eligible employee and will be reinstated with the same election(s) such individual had before termination. If rehired more than 30 days following termination, the individual shall be treated as a newly Eligible Employee.`),

    sectionTitle("03. Application to Participate"),
    body(`An Employee who is eligible to participate in this Plan may, during the applicable Election Period, complete an Election to Participate form. The Election to Participate form is an irrevocable election to redirect and reduce taxable compensation to cover the Employee\u2019s applicable cost of Benefits elected, which shall be applicable until the end of the current Plan Year, unless the Participant is entitled to change elections pursuant to the Section titled: \u201cChange of Elections\u201d.`),

    sectionTitle("04. Termination of Participation"),
    body(`A Participant shall no longer participate in this Plan upon: (a) termination of employment; (b) death; or (c) termination of this Plan.`),

    sectionTitle("05. Termination of Employment"),
    body(`If a Participant terminates employment for any reason other than death, participation in the Plan shall cease, subject to the right to continue coverage under any Insurance Contract for which premiums have already been paid.`),

    // ===== ARTICLE III =====
    pageBreak(),
    articleHeading("III. Article - Contributions to the Plan"),
    horizontalRule(),

    sectionTitle("01. Salary Redirection"),
    body(`Benefits under the Plan shall be financed by Salary Redirections sufficient to support Benefits that a Participant has elected hereunder and to pay the Participant\u2019s Premium Expenses. The salary administration program of the Employer shall allow each Participant to agree to reduce his or her pay during a Plan Year by an amount determined necessary to purchase the elected Benefit and to pay the Participant\u2019s Premium Expenses. Salary Redirection amounts shall be contributed on a pro rata basis for each pay period during the Plan Year.`),

    sectionTitle("02. Application of Contributions"),
    body(`As soon as reasonably practical after each payroll period, the Employer shall apply the Salary Redirections to provide the Benefits elected by the affected Participants.`),

    sectionTitle("03. Periodic Contributions"),
    body(`The Employer and Administrator may implement a procedure in which Salary Redirections are contributed throughout the Plan Year on a periodic basis that is not pro rata for each payroll period. In the event Salary Redirections are not made on a pro rata basis, upon termination of participation, a Participant may be entitled to a refund of such Salary Redirections.`),

    // ===== ARTICLE IV =====
    pageBreak(),
    articleHeading("IV. Article - Benefits"),
    horizontalRule(),

    sectionTitle("01. Benefit Options"),
    body(`Each Participant may elect to have his or her full compensation paid in taxable compensation or elect to have the amount of his or her Salary Redirection amounts applied to any one or more of the optional Benefits or any other group-insured or self-funded Benefit permitted under Code Section 125, that is offered by the Employer as set forth in the Adoption Agreement.`),

    sectionTitle("02. Description of Benefits"),
    body(`Each Eligible Employee may elect to have the Administrator pay those contributions that the Employee is required to make to the Benefit options as a condition for the Employee and his or her Dependents to participate in those Benefit options.`),

    sectionTitle("03. Nondiscrimination Requirements"),
    body(`It is the intent of this Plan to provide benefits to a classification of Employees that the Secretary of the Treasury finds not to be discriminatory in favor of the group in whose favor discrimination is prohibited under Code Section 125 or applicable Regulations thereunder.`),

    // ===== ARTICLE V =====
    pageBreak(),
    articleHeading("V. Article - Participant Elections"),
    horizontalRule(),

    sectionTitle("01. Initial Elections"),
    body(`An Employee who meets the Eligibility Requirements of the Plan on the first day of, or during, a Plan Year may elect to participate in this Plan for all or the remainder of such Plan Year, provided he or she elects to do so before his or her effective date of participation, or for a newly eligible Employee, no more than 30 days after their date of hire.`),

    sectionTitle("02. Subsequent Annual Elections"),
    body(
      data.elections.employeeElections === "first_year_only"
        ? `A Participant will automatically be enrolled in subsequent plan years unless the Participant terminates his or her participation in the Plan by notifying the Administrator in writing during the Election Period that he or she does not want to participate in the Plan for the next Plan Year.`
        : data.elections.employeeElections === "every_year"
        ? `Each Participant must complete a new Election to Participate form during each Election Period in order to continue participation in the Plan for the next Plan Year.`
        : `Participation in the Plan is automatic for all Eligible Employees. No election form is required.`
    ),

    sectionTitle("03. Change of Elections"),
    body(`Any Participant may change a Benefit election after the Plan Year has commenced and make new elections with respect to the remainder of such Plan Year if the changes are necessitated by and are consistent with a change in status that is recognized under rules and regulations adopted by the Department of the Treasury. A change in status shall include the following events:`),
    bullet("Legal Marital Status: marriage, divorce, death of a spouse, legal separation or annulment"),
    bullet("Number of Dependents: birth, adoption, placement for adoption, or death of a dependent"),
    bullet("Employment Status: termination or commencement of employment, a strike or lockout, commencement of or return from an unpaid leave of absence, or a change in worksite"),
    bullet("Dependent satisfies or ceases to satisfy eligibility requirements due to attainment of age, student status, or any similar circumstance"),
    bullet("Residency: a change in the place of residence of the Participant, spouse or dependent"),
    ...(data.elections.allowChangeBelow30Hours ? [
      bullet("A change from full-time employment (at least 30 hours per week) to part-time employment (less than 30 hours per week), provided the Participant intends to enroll in another plan that provides minimum essential coverage"),
    ] : []),
    ...(data.elections.allowChangeMarketplace ? [
      bullet("The Participant is eligible for a Special Enrollment Period to enroll in a Qualified Health Plan through a Marketplace, or seeks to enroll during the Marketplace\u2019s annual open enrollment period"),
    ] : []),

    // ===== ARTICLE VI =====
    pageBreak(),
    articleHeading("VI. Article - Administration"),
    horizontalRule(),

    sectionTitle("01. Plan Administration"),
    body(`The Employer shall be the Administrator, unless the Employer elects otherwise. The Administrator shall have full power to administer the Plan in all of its details, subject to the pertinent provisions of the Code. The Administrator\u2019s interpretations thereof in good faith shall be final and conclusive on all persons claiming benefits by operation of the Plan.`),

    sectionTitle("02. Examination of Records"),
    body(`The Administrator shall make available to each Participant and Eligible Employee such records as pertain to their respective interests under the Plan for examination at reasonable times during normal business hours.`),

    sectionTitle("03. Payment of Expenses"),
    body(`Any reasonable administrative expenses shall be paid by the Employer unless the Employer determines that administrative costs shall be borne by the Participants under the Plan.`),

    sectionTitle("04. Indemnification of Administrator"),
    body(`The Employer agrees to indemnify and to defend to the fullest extent permitted by law any Employee serving as the Administrator against all liabilities, damages, costs and expenses occasioned by any act or omission to act in connection with the Plan, if such act or omission is in good faith.`),

    // ===== ARTICLE VII =====
    pageBreak(),
    articleHeading("VII. Article - Amendment or Termination of Plan"),
    horizontalRule(),

    sectionTitle("01. Amendment"),
    body(`The Employer, at any time or from time to time, may amend any or all of the provisions of the Plan without the consent of any Employee or Participant. No amendment shall have the effect of modifying any benefit election of any Participant in effect at the time of such amendment, unless such amendment is made to comply with federal, state or local laws, statutes or regulations.`),

    sectionTitle("02. Termination"),
    body(`The Employer is establishing this Plan with the intent that it will be maintained for an indefinite period of time. Notwithstanding the foregoing, the Employer reserves the right to terminate the Plan, in whole or in part, at any time. In the event the Plan is terminated, no further contributions shall be made.`),

    // ===== ARTICLE VIII =====
    pageBreak(),
    articleHeading("VIII. Article - Miscellaneous"),
    horizontalRule(),

    sectionTitle("01. Plan Interpretation"),
    body(`All provisions of this Plan shall be governed and interpreted by the Employer, or its delegated Administrator, in its full and complete discretion and shall be applied in a uniform, nondiscriminatory manner.`),

    sectionTitle("02. Exclusive Benefit"),
    body(`This Plan shall be maintained for the exclusive benefit of the Employees who participate in the Plan.`),

    sectionTitle("03. Participant\u2019s Rights"),
    body(`This Plan shall not be deemed to constitute an employment contract between the Employer and any Participant or to be a consideration or an inducement for the employment of any Participant or Employee.`),

    sectionTitle("04. No Guarantee of Tax Consequences"),
    body(`Neither the Administrator nor the Employer makes any commitment or guarantee that any amounts paid to or for the benefit of a Participant under the Plan will be excludable from the Participant\u2019s gross income for federal or state income tax purposes.`),

    sectionTitle("05. Funding"),
    body(`Unless otherwise required by law, contributions to the Plan need not be placed in trust or dedicated to a specific Benefit, but shall instead be considered general assets of the Employer until the Premium Expense required under the Plan has been paid.`),

    sectionTitle("06. Governing Law"),
    body(`This Plan is governed by the Code and the Treasury regulations issued thereunder. To the extent not preempted by federal law, the provisions of this Plan shall be construed, enforced and administered according to the laws of the state of ${govLaw}.`),

    sectionTitle("07. Severability"),
    body(`If any provision of the Plan is held invalid or unenforceable, its invalidity or unenforceability shall not affect any other provisions of the Plan.`),

    sectionTitle("08. Continuation of Coverage"),
    body(`Notwithstanding anything in the Plan to the contrary, in the event any benefit under this Plan subject to the continuation coverage requirement of Code Section 4980B becomes unavailable, each Participant will be entitled to continuation coverage as prescribed in Code Section 4980B.`),

    sectionTitle("09. HIPAA"),
    body(`This Plan shall be operated in accordance with HIPAA and regulations thereunder.`),

    sectionTitle("10. USERRA"),
    body(`Contributions, benefits and service credit with respect to qualified military service shall be provided in accordance with USERRA and the regulations thereunder.`),

    sectionTitle("11. GINA"),
    body(`This Plan shall be operated in accordance with GINA and regulations thereunder.`),

    ...(data.elections.includeFmlaLanguage ? [
      sectionTitle("12. Family and Medical Leave Act"),
      body(`A Participant who takes an unpaid leave of absence under FMLA may revoke his or her election at the beginning of or during the leave. If a Participant chooses to continue coverage during an unpaid FMLA leave, the Plan Administrator shall select among the following options: (a) Pre-payment before the leave; (b) Payment during the leave on the same schedule; or (c) Advancement by the Employer of required payments.`),
    ] : []),

    // ===== ADOPTION AGREEMENT =====
    pageBreak(),
    articleHeading("Adoption Agreement"),
    horizontalRule(),
    emptyLine(),
    bodyBold(`For ${name}`),
    body("Section 125 Premium Only Plan"),
    emptyLine(),
    body(`The undersigned Employer adopted the Premium Only Plan for those Employees who shall qualify as Participants thereunder. It shall be effective as of the date specified below. The Employer hereby selects the following Plan specifications:`),
    emptyLine(),
    bodyBold(`1. Name of Employer: ${name}`),
    bodyBold(`2. Effective Date: This adopted Premium Only Plan shall be effective as of ${effective}`),
    bodyBold(`3. Plan Year: Your Plan\u2019s records are maintained on the basis of a twelve-month period. This is known as the Plan Year. The adopted plan year begins on ${pyStart} and ends on ${pyEnd}.`),
    bodyBold(`4. Employer\u2019s Principal Office:`),
    body(addr1, { indent: true }),
    body(addr2, { indent: true }),
    bodyBold(`5. Benefits: All the benefits listed below are included in this plan:`),
    body("Health Plan. Premiums that are payroll deducted on a pre-tax basis may include the following:", { indent: true }),
    ...benefits.map((b) => bullet(b)),
    emptyLine(),
    ...signatureBlock(name),

    // ===== CERTIFICATE OF RESOLUTION =====
    pageBreak(),
    articleHeading("CERTIFICATE OF RESOLUTION"),
    horizontalRule(),
    emptyLine(),
    body(`The undersigned authorized representative of ${name} (the Employer) hereby certifies that the following resolutions were duly adopted by the governing body of the Employer on ____________________, and that such resolutions have not been modified or rescinded as of the date hereof:`),
    emptyLine(),
    body(`RESOLVED, that the form of Welfare Benefit Plan, effective ${effective}, presented to this meeting is hereby approved and adopted, and that the proper agents of the Employer are hereby authorized and directed to execute and deliver to the Administrator of said Plan one or more counterparts of the Plan.`),
    emptyLine(),
    body(`RESOLVED, that the Administrator shall be instructed to take such actions that the Administrator deems necessary and proper in order to implement the Plan, and to set up adequate accounting and administrative procedures for the provision of benefits under the Plan.`),
    emptyLine(),
    body(`RESOLVED, that the proper agents of the Employer shall act as soon as possible to notify the employees of the Employer of the adoption of the Plan and to deliver to each employee a copy of the Summary Plan Description of the Plan.`),
    emptyLine(),
    body(`The undersigned further certifies that attached hereto as Exhibits, are true copies of ${name}\u2019s Benefit Plan Document and Summary Plan Description approved and adopted at this meeting.`),
    emptyLine(),
    bodyBold(`Company: ${name}`),
    ...signatureBlock(name),
  ];
}
