import type { FormData } from "@/types";
import type { PDFSection } from "./pdf-builder";
import {
  coverPage, articleHeading, sectionTitle, definitionItem,
  bodyText, bulletItem, signatureBlock, emptyLine,
} from "./pdf-builder";
import { formatDate, formatMonthDay, stateName, entityLabel, benefitsList } from "../helpers";
import { getCobraPDFBuilder } from "../legal-text/cobra";
import { getFmlaUserraPDFBuilder } from "../legal-text/fmla-userra";
import { getQmcsoPDFBuilder } from "../legal-text/qmcso";

export function buildPlanDocumentPDFSections(data: FormData): PDFSection[] {
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
    // Cover
    { build: (ctx) => coverPage(ctx, name, addr1, addr2, "Section 125 Premium Only Plan", "Plan Document", effective) },

    // TOC
    { build: (ctx) => {
      articleHeading(ctx, "TABLE OF CONTENTS");
      emptyLine(ctx);
      bodyText(ctx, "I. Article - Definitions");
      bodyText(ctx, "II. Article - Participation");
      bodyText(ctx, "III. Article - Contributions to the Plan");
      bodyText(ctx, "IV. Article - Benefits");
      bodyText(ctx, "V. Article - Participant Elections");
      bodyText(ctx, "VI. Article - Administration");
      bodyText(ctx, "VII. Article - Amendment or Termination of Plan");
      bodyText(ctx, "VIII. Article - Miscellaneous");
      bodyText(ctx, "IX. Article - COBRA Continuation of Coverage");
      bodyText(ctx, "X. Article - FMLA and USERRA Continuation of Coverage");
      bodyText(ctx, "XI. Article - Qualified Medical Child Support Orders");
    }},

    // Introduction + Article I
    { build: (ctx) => {
      articleHeading(ctx, "Introduction");
      bodyText(ctx, `The company has adopted this Plan effective ${effective}. Its purpose is to provide benefits for those Employees who shall qualify hereunder and their Dependents and beneficiaries. The concept of this Plan is to allow Employees to elect between cash compensation or certain nontaxable benefit options as they desire. The Plan shall be known as the ${name} Premium Only Plan (the \u201cPlan\u201d).`);
      emptyLine(ctx);

      articleHeading(ctx, "I. Article - Definitions");

      definitionItem(ctx, "01", "Administrator", "means the individual(s) or corporation appointed by the Employer to carry out the administration of the Plan. The Employer shall be empowered to appoint and remove the Administrator from time to time as it deems necessary for the proper administration of the plan. In the event an Administrator has not been appointed, or resigns from an appointment, the Employer shall be deemed to be the Administrator.");
      definitionItem(ctx, "02", "Benefit", "means any of the optional benefit choices available to a Participant as outlined in the Section titled: \u201cBenefit Options.\u201d");
      definitionItem(ctx, "03", "Code", "means Section 125 of the Internal Revenue Code of 1986, as amended or replaced from time to time, and any governing regulations or applicable guidance thereunder.");
      definitionItem(ctx, "04", "Compensation", "means the total cash remuneration received by the Participant from the Employer during a Plan Year, prior to any reductions pursuant to an Election to Participate form authorized hereunder.");
      definitionItem(ctx, "05", "Dependent", "means any individual who is so defined under an Insurance Contract or who is (i) a Qualifying Child (within the meaning of Code Section 152(c), subject to the exceptions of Code Section 152(b)) or Participant\u2019s child (within the meaning of Code Section 152(f)(1)) who has not attained age 27 as of the end of the taxable year, or (ii) a Qualifying Relative who qualifies as a dependent under an Insurance Contract or under (within the meaning of Code Section 152(d), subject to the exceptions of Code Section 152(b)) (as modified by Code Section 105(b)), as applicable. Notwithstanding anything in the Plan to the contrary, the Plan will comply with Michelle\u2019s Law.");
      definitionItem(ctx, "06", "Effective Date", `means the effective date of the Plan which is ${effective}.`);
      definitionItem(ctx, "07", "Election Period", "means the period immediately preceding the beginning of each Plan Year established by the Administrator for the election of Benefits and Salary Redirections, such period to be applied on a uniform and nondiscriminatory basis for all Employees and Participants. However, an Employee\u2019s initial Election Period shall be determined pursuant to the Section titled: \u201cInitial Elections.\u201d");
      definitionItem(ctx, "08", "Eligible Employee", "means any Employee who has satisfied the provisions of the Section titled: \u201cEligibility.\u201d However, 2% shareholders as defined under Code Section 1372(b) and self-employed individuals as defined under Code Section 401(c) shall not be eligible to participate in this Plan. An individual shall not be an \u201cEligible Employee\u201d if such individual is not reported on the payroll records of the Employer as a common law employee. In particular, it is expressly intended that individuals not treated as common law employees by the Employer on its payroll records are not \u201cEligible Employees\u201d and are excluded from Plan participation even if a court or administrative agency determines that such individuals are common law employees and not independent contractors.");
      definitionItem(ctx, "09", "Employee", "means any person who is employed by the Employer, but generally excludes any person who is employed as an independent contractor and any person who is considered self-employed under Code Section 401(c), as well as any person who is a greater than two percent (2%) shareholder in a Subchapter S corporation, a partner in a partnership or an owner or member of a limited liability company that elects partnership status on its tax return. The term Employee shall include leased employees within the meaning of Code Section 414(n)(2), unless excluded by the terms of an Insurance Contract.");
      definitionItem(ctx, "10", "Employer", `means the ${entity} or any such entity specified in Item 1 of the Adoption Agreement, and any Affiliated Employer that adopts this Plan; any successor that maintains this Plan; and any predecessor that has maintained this Plan.`);
      definitionItem(ctx, "11", "Highly Compensated Employee", "means, for the purposes of determining discrimination, an Employee so described in Code Section 125 and the Treasury Regulations thereunder.");
      definitionItem(ctx, "12", "Insurance Contract", "means any contract issued by an Insurer underwriting a Benefit, or any self-funded arrangement providing any Benefit offered for health and welfare coverage to Eligible Employees of the Employer.");
      definitionItem(ctx, "13", "Insurance Premium Payment Plan", "means the plan of benefits contained in the Section titled: \u201cBenefit Options\u201d of this Plan, that provides for the payment of Premium Expenses.");
      definitionItem(ctx, "14", "Insurer", "means any insurance company that underwrites a Benefit or any self-funded arrangement under this Plan.");
      definitionItem(ctx, "15", "Key Employee", "means an employee defined in Code Section 416(i)(1) and the Treasury regulations thereunder.");
      definitionItem(ctx, "16", "Participant", "means any Eligible Employee who elects to become a Participant pursuant to the Section titled: \u201cApplication to Participate\u201d and has not for any reason become ineligible to participate further in the Plan.");
      definitionItem(ctx, "17", "Plan", "means the Section 125 Premium Only Plan described in this instrument, including all amendments thereto.");
      definitionItem(ctx, "18", "Plan Year", "means the 12-month period beginning and ending on the dates specified in the Adoption Agreement. The Plan Year shall be the coverage period for the Benefits provided for under this Plan. In the event a Participant commences participation during a Plan Year, then the initial coverage period shall be that portion of the Plan Year commencing on such Participant\u2019s date of entry and ending on the last day of such Plan Year.");
      definitionItem(ctx, "19", "Premium Expenses", "or \u201cPremiums\u201d mean the Participant\u2019s cost for the insured Benefits described in the Section titled: \u201cBenefit Options.\u201d");
      definitionItem(ctx, "20", "Regulations", "means either temporary, proposed or final regulations, as applicable, issued from the Department of Treasury, as well as any guidance or interpretations issued in connection therewith.");
      definitionItem(ctx, "21", "Salary Redirection", "means the contributions made by the Employer on behalf of Participants in accordance with the Section titled: \u201cSalary Redirection.\u201d These contributions shall be allocated to the funds or accounts established for cost of applicable Benefits provided under the Plan pursuant to the Participants\u2019 elections made under the Article titled: \u201cParticipant Elections.\u201d");
      definitionItem(ctx, "22", "Spouse", "means \u201cspouse\u201d as defined in an Insurance Contract, then, for purposes of coverage under that Insurance Contract only, \u201cspouse\u201d shall have the meaning stated in the Insurance Contract. In all other cases, \u201cspouse\u201d shall have the meaning stated under applicable federal or state law.");
      definitionItem(ctx, "23", "Uniformed Services", "means the Armed Forces, the Army National Guard, and the Air National Guard when engaged in active duty for training, inactive duty training, or full-time National Guard duty, the commissioned corps of the Public Health Service, and any other category of persons designated by the President of the United States in time of war or emergency.");
      definitionItem(ctx, "24", "Affiliated Employer", "means: (a) any corporation that is a member of a controlled group of corporations (as defined in Code Section 414(b)) that includes the Employer; (b) any trade or business (whether or not incorporated) under common control (as defined in Code Section 414(c)) with the Employer; (c) any organization that is a member of an affiliated service group (as defined in Code Section 414(m)) that includes the Employer; and (d) any other entity required to be aggregated with the Employer pursuant to Code Section 414(o) and the regulations issued thereunder.");
      bodyText(ctx, "All other defined terms in this Plan shall have the meanings specified in the various Articles of the Plan in which they appear.");
    }},

    // Article II - Participation
    { build: (ctx) => {
      articleHeading(ctx, "II. Article - Participation");
      sectionTitle(ctx, "01. Eligibility");
      bodyText(ctx, "As to each Benefit provided hereunder, any Eligible Employee shall be eligible to participate as of the date he or she satisfies the eligibility conditions set forth in the policy or plan providing such Benefit (the \u201cEligibility Requirements\u201d), the provisions of which are specifically incorporated herein by reference. In addition to the eligibility conditions set forth in the underlying Insurance Contract, and unless otherwise modified by such Insurance Contract or by the Adoption Agreement, the following minimum eligibility conditions shall apply under this Plan:");
      bodyText(ctx, "(a) the Employee must be a common-law employee of the Employer who is reasonably expected to average at least 30 hours of service per week (or 130 hours of service per calendar month), as determined under Section 4980H of the Code and the regulations issued thereunder;");
      bodyText(ctx, "(b) the Employee must satisfy any waiting period required by the Employer or by the underlying Insurance Contract, which shall not exceed 90 days from the Employee\u2019s date of hire (or such shorter period as required by Section 2708 of the Public Health Service Act and Section 715 of ERISA);");
      bodyText(ctx, "(c) the following classes of individuals are excluded from participation under this Plan, except to the extent otherwise required by an Insurance Contract or applicable law: (i) leased employees within the meaning of Code Section 414(n)(2); (ii) seasonal employees who are not reasonably expected to average at least 30 hours of service per week; (iii) part-time employees who are not reasonably expected to average at least 30 hours of service per week; (iv) employees included in a unit of employees covered by a collective bargaining agreement, unless the collective bargaining agreement provides for participation in this Plan; (v) non-resident aliens with no U.S.-source earned income from the Employer; (vi) two-percent (2%) shareholders of an S corporation, as defined in Code Section 1372(b); and (vii) self-employed individuals, as defined in Code Section 401(c).");
      bodyText(ctx, "(d) For Employees whose hours of service are variable, seasonal, or otherwise not reasonably ascertainable at hire, the Administrator may determine whether such Employees are reasonably expected to average at least 30 hours of service per week using the look-back measurement method described in Treasury Regulation §54.4980H-3(d), applying a Standard Measurement Period, Administrative Period, and Stability Period of uniform duration that the Administrator shall communicate to affected Employees in a nondiscriminatory manner.");
      sectionTitle(ctx, "02. Effective Date of Participation");
      bodyText(ctx, "(a) An Eligible Employee shall become a Participant effective as of the later of the date on which he or she satisfies the Eligibility Requirements of the Plan or the Effective Date of this Plan.");
      bodyText(ctx, "(b) If an Eligible Employee terminates employment after commencing participation in the Plan, except as otherwise provided in the applicable policy or plan providing a Benefit, and such terminated Eligible Employee is rehired within 30 days or less of the date of termination of employment, such rehired Eligible Employee shall not be considered a newly eligible employee and will be reinstated with the same election(s) such individual had before termination. If a terminated Eligible Employee is rehired more than 30 days following termination of employment and is otherwise eligible to participate in the Plan, the individual shall be treated as a newly Eligible Employee and may make a new election.");
      sectionTitle(ctx, "03. Application to Participate");
      bodyText(ctx, "An Employee who is eligible to participate in this Plan may, during the applicable Election Period, complete an Election to Participate form that the Administrator shall furnish to the Employee. The Election to Participate form is an irrevocable election made by the Employee to redirect and reduce taxable compensation to cover the Employee\u2019s applicable cost of Benefits elected, which shall be applicable until the end of the current Plan Year, unless the Participant is entitled to change his or her Benefit elections pursuant to the Section titled: \u201cChange of Elections.\u201d");
      bodyText(ctx, "Such election shall be effective for the first pay period beginning on or after the Employee\u2019s effective date of participation pursuant to the Section titled: \u201cEffective Date of Participation.\u201d");
      sectionTitle(ctx, "04. Termination of Participation");
      bodyText(ctx, "A Participant shall no longer participate in this Plan upon the occurrence of any of the following events: (a) His or her termination of employment, subject to the provisions of the Section titled: \u201cTermination of Employment\u201d; (b) His or her death; or (c) The termination of this Plan, subject to the provisions of the Section titled: \u201cTermination.\u201d");
      sectionTitle(ctx, "05. Termination of Employment");
      bodyText(ctx, "If a Participant terminates employment with the Employer for any reason other than death, his or her participation in the Plan shall cease, subject to the Participant\u2019s right to continue coverage under any Insurance Contract for which premiums have already been paid.");
      bodyText(ctx, "Upon a Participant’s cessation of participation, any Salary Redirection amount that was withheld from the Participant’s Compensation but that has not yet been remitted by the Employer to the applicable Insurer for a period of coverage beginning on or after the date the Participant ceases to participate shall be refunded to the Participant. For the avoidance of doubt, no refund obligation under this Section applies to any Premium that has already been remitted by the Employer to the Insurer; refund or termination of such already-remitted Premiums shall be governed solely by the terms of the applicable Insurance Contract and the Insurer’s administrative procedures.");
    }},

    // Article III - Contributions
    { build: (ctx) => {
      articleHeading(ctx, "III. Article - Contributions to the Plan");
      sectionTitle(ctx, "01. Salary Redirection");
      bodyText(ctx, "Benefits under the Plan shall be financed by Salary Redirections sufficient to support Benefits that a Participant has elected hereunder and to pay the Participant\u2019s Premium Expenses. The salary administration program of the Employer shall allow each Participant to agree to reduce his or her pay during a Plan Year by an amount determined necessary to purchase the elected Benefit and to pay the Participant\u2019s Premium Expenses. The amount of such Salary Redirection shall be specified by the Plan Sponsor and shall be applicable for a Plan Year. Notwithstanding the above, for new Participants, the Salary Redirections shall only be applicable from the first day of the pay period following the Employee\u2019s entry date up to and including the last day of the Plan Year.");
      bodyText(ctx, "Any Salary Redirection shall be determined prior to the beginning of a Plan Year (subject to initial elections pursuant to the Section titled: \u201cInitial Elections\u201d) and prior to the end of the Election Period and shall be irrevocable for such Plan Year. However, a Participant may revoke a Benefit election after the Plan Year has commenced and make a new Election to Participate with respect to the remainder of the Plan Year, if both the revocation and the new election are on account of and consistent with a change in status. Salary Redirection amounts shall be contributed on a pro rata basis for each pay period during the Plan Year. All individual Election forms are deemed to be part of this Plan and incorporated herein by reference.");
      sectionTitle(ctx, "02. Application of Contributions");
      bodyText(ctx, "As soon as reasonably practical after each payroll period, the Employer shall apply the Salary Redirections withheld during such payroll period to pay the Participant\u2019s share of the Premium Expenses for the Insurance Contracts elected by the Participant in accordance with the terms of those Insurance Contracts. Because this Plan is a premium-only cafeteria plan, no reimbursement account is established for any Participant; Salary Redirections are applied directly to pay Premium Expenses owed under the elected Insurance Contracts.");
      sectionTitle(ctx, "03. Periodic Contributions");
      bodyText(ctx, "Notwithstanding the requirement provided above that Salary Redirections be contributed on a level and pro rata basis for each payroll period, the Employer and Administrator may implement a procedure in which Salary Redirections are contributed throughout the Plan Year on a periodic basis that is not pro rata for each payroll period. In the event Salary Redirections are not made on a pro rata basis, upon termination of participation, a Participant may be entitled to a refund of such Salary Redirections pursuant to the Section titled: \u201cTermination of Employment.\u201d");
    }},

    // Article IV - Benefits
    { build: (ctx) => {
      articleHeading(ctx, "IV. Article - Benefits");
      sectionTitle(ctx, "01. Benefit Options");
      bodyText(ctx, "Each Participant may elect to have his or her full compensation paid to him in taxable compensation or elect to have the amount of his or her Salary Redirection amounts applied to any one or more of the optional Benefits or any other group-insured or self-funded Benefit permitted under Code Section 125, that is offered by the Employer as set forth in the Adoption Agreement.");
      bodyText(ctx, "The Employer may select suitable health and hospitalization Insurance Contracts for use in providing health Benefits, which policies will provide uniform benefits for all Participants electing this Benefit.");
      sectionTitle(ctx, "02. Description of Benefits");
      bodyText(ctx, "Each Eligible Employee may elect to have the Administrator pay those contributions that the Employee is required to make to the Benefit options described under the Section titled: \u201cBenefit Options,\u201d as a condition for the Employee and his or her Dependents to participate in those Benefit options.");
      sectionTitle(ctx, "03. Nondiscrimination Requirements");
      bodyText(ctx, "(a) It is the intent of this Plan to provide benefits to a classification of Employees that the Secretary of the Treasury finds not to be discriminatory in favor of the group in whose favor discrimination is prohibited under Code Section 125 or applicable Regulations thereunder.");
      bodyText(ctx, "(b) If the Administrator deems it necessary, in order, to avoid discrimination or possible taxation to Highly Compensated Employees, Key Employees or a group of employees in whose favor discrimination is prohibited by Code Section 125, it may, but shall not be required to, reduce contributions or non-taxable Benefits in order to assure compliance with this section. Any act taken by the Administrator under this section shall be carried out in a uniform and nondiscriminatory manner. Contributions which are not utilized to provide Benefits to any Participant by virtue of any administrative act under this paragraph shall be forfeited and applied in accordance with the Section titled: “Application of Forfeited Amounts” of Article VI of this Plan.");
      bodyText(ctx, "(c) Annual Testing. The Plan shall be subject to the following nondiscrimination tests under Code Section 125 and the Treasury regulations thereunder: (i) the eligibility test of Code Section 125(c)(1)(A); (ii) the contributions and benefits test of Code Section 125(c)(1)(B); and (iii) the key employee concentration test of Code Section 125(b)(2), under which the qualified benefits provided to Key Employees may not exceed 25% of the aggregate qualified benefits provided to all Employees under the Plan. The Administrator shall cause the Plan to be tested no later than the last day of each Plan Year (or at such other times during the Plan Year as the Administrator deems appropriate) and shall take such corrective action, including but not limited to the reduction of non-taxable Benefits described in subsection (b) above, as may be necessary or appropriate to maintain compliance with the applicable nondiscrimination requirements.");
      bodyText(ctx, "(d) Premium-Only Plan Safe Harbor. To the extent the Plan satisfies for a Plan Year the safe harbor for premium-only cafeteria plans described in Proposed Treasury Regulation Section 1.125-7(e) and any successor guidance issued by the Internal Revenue Service (the “POP safe harbor”), the Plan shall be deemed to satisfy the eligibility, contributions and benefits, and key employee concentration tests of Code Section 125 for that Plan Year. The POP safe harbor generally applies for a Plan Year if the Plan satisfies the eligibility test of Code Section 125(c)(1)(A) for the Plan Year. The Administrator shall determine annually whether the Plan qualifies for the POP safe harbor based on the Plan’s design and the Employer’s workforce demographics for the relevant Plan Year.");
      sectionTitle(ctx, "04. Non-Tax Dependent Coverage");
      bodyText(ctx, "If (i) Employee Salary Redirections are made to fund Benefits under the Plan, and (ii) the Employer allows a Participant to elect to cover a Non-Tax Dependent through the Participant\u2019s coverage under group Medical, Dental or Vision benefit(s), a Participant who elects to participate in the Salary Redirection program may pay on a pre-tax basis through salary reduction contributions the Participant\u2019s portion of the premium cost of coverage, provided that the full fair market value of such coverage for any such Non-Tax Dependent shall be includible in the Participant\u2019s gross income as a taxable benefit in accordance with applicable federal income tax rules.");
      sectionTitle(ctx, "05. Health Savings Account Compatibility");
      bodyText(ctx, "To the extent the Employer offers a high-deductible health plan (\u201cHDHP\u201d) that meets the requirements of Code Section 223(c)(2) as one of the Insurance Contracts available under the Plan, an Eligible Employee who is enrolled in such HDHP and who is otherwise eligible to contribute to a Health Savings Account (\u201cHSA\u201d) under Code Section 223 may also elect, through a Salary Redirection under this Plan, to make pre-tax contributions to an HSA established and maintained for the Employee\u2019s benefit, subject to the annual statutory contribution limits set forth in Code Section 223(b).");
      bodyText(ctx, "Eligibility to contribute to an HSA requires, in addition to enrollment in an HDHP: (a) that the Employee not be covered under any other health plan that is not an HDHP, other than permitted insurance and disregarded coverage described in Code Section 223(c) (including, without limitation, dental, vision, accident, disability, long-term care, certain limited-purpose or post-deductible health flexible spending arrangements, and certain employee assistance, disease management, and wellness programs that do not provide significant benefits in the nature of medical care); (b) that the Employee not be enrolled in Medicare; and (c) that the Employee not be claimed as a dependent on another person\u2019s federal income tax return.");
      bodyText(ctx, "The Employee is solely responsible for determining the Employee\u2019s own HSA eligibility, for opening and maintaining an HSA with a qualified HSA trustee or custodian, and for ensuring that contributions to the HSA do not exceed the applicable annual statutory limit. Nothing in this Plan shall be construed to require the Employer to establish, maintain, or fund an HSA on behalf of any Employee, or to verify any Employee\u2019s ongoing HSA eligibility.");
      if (data.benefits.groupTermLife) {
        sectionTitle(ctx, "06. Group Term Life Premium Conversion \u2014 Section 79 Imputed Income");
        bodyText(ctx, "To the extent the Plan permits a Participant to pay Premium Expenses for employer-sponsored Group Term Life insurance on a pre-tax basis through Salary Redirection, only that portion of the Group Term Life premium that is attributable to the first $50,000 of coverage shall be eligible for pre-tax treatment. The cost of Group Term Life coverage in excess of $50,000 is subject to imputed income inclusion under Code Section 79 and the Treasury regulations thereunder, and the Employer shall include such imputed income in the Participant\u2019s wages for federal income tax and FICA purposes in accordance with the Section 79 Table I uniform premium rates published by the Internal Revenue Service.");
        bodyText(ctx, "The Participant shall be solely responsible for any tax consequences arising from coverage in excess of $50,000. Nothing in this Section is intended to alter the tax treatment of Group Term Life insurance under Code Section 79; rather, this Section clarifies the interaction between the cafeteria plan pre-tax election mechanism and the Section 79 imputed-income rules.");
        bodyText(ctx, "Section 79(d) Nondiscrimination. If the Employer’s group term life insurance plan fails the nondiscrimination requirements of Code Section 79(d), the $50,000 cost-of-coverage exclusion provided by Code Section 79(a) shall be unavailable to Key Employees for the Plan Year of the failure, in which case the entire cost of Group Term Life coverage provided to each affected Key Employee (and not merely the cost in excess of $50,000) shall be includible in such Key Employee’s gross income. The Administrator shall test the group term life plan for compliance with Code Section 79(d) annually and shall take such corrective action as may be necessary or appropriate, in a uniform and nondiscriminatory manner.");
      }
    }},

    // Article V - Participant Elections
    { build: (ctx) => {
      articleHeading(ctx, "V. Article - Participant Elections");
      sectionTitle(ctx, "01. Initial Elections");
      bodyText(ctx, "An Employee who meets the Eligibility Requirements of the Plan on the first day of, or during, a Plan Year may elect to participate in this Plan for all or the remainder of such Plan Year, provided he or she elects to do so before his or her effective date of participation, or for a newly Eligible Employee, no more than 30 days after the date on which the Employee first satisfies the Eligibility Requirements of the Plan. For any such newly Eligible Employee, if coverage under the underlying Insurance Contract is effective as of an earlier date, such Employee shall be eligible to participate retroactively as of that coverage effective date. Notwithstanding the foregoing, no Salary Redirection election may apply to a period of coverage that has not commenced under the applicable Insurance Contract; retroactive participation pursuant to this Section is limited to periods for which the Insurer in fact provides coverage to the Participant. Any failure to elect the Benefits set forth herein shall constitute an Employee\u2019s election to not participate in the Plan during that Plan Year until a valid election is otherwise made.");
      sectionTitle(ctx, "02. Subsequent Annual Elections");
      if (data.elections.employeeElections === "first_year_only") {
        bodyText(ctx, "a. A Participant will automatically be enrolled in subsequent plan years unless the Participant terminates his or her participation in the Plan by notifying the Administrator in writing during the Election Period that he or she does not want to participate in the Plan for the next Plan Year;");
        bodyText(ctx, "b. A Participant may terminate his or her participation in the Plan by notifying the Administrator in writing during the Election Period;");
        bodyText(ctx, "c. An Employee who elects to not participate for the Plan Year following the Election Period will have to wait until the next Election Period before again electing to participate in the Plan, except as provided for in the Section titled: \u201cChange of Elections.\u201d");
      } else if (data.elections.employeeElections === "every_year") {
        bodyText(ctx, "Each Participant must complete a new Election to Participate form during each Election Period in order to continue participation in the Plan for the next Plan Year. A Participant who fails to complete a new election form shall be deemed to have elected to not participate in the Plan for the next Plan Year.");
      } else {
        bodyText(ctx, "Participation in the Plan is automatic for all Eligible Employees. No election form is required.");
      }
      sectionTitle(ctx, "03. Change of Elections");
      bodyText(ctx, "a. Any Participant may change a Benefit election after the Plan Year has commenced and make new elections with respect to the remainder of such Plan Year if, under the facts and circumstances, the changes are necessitated by and are consistent with a change in status that is recognized under rules and regulations adopted by the Department of the Treasury. The following events constitute a “change in status” under Treasury Regulation §1.125-4(c). Additional permitted mid-year election change events under Code Section 125 and the Treasury regulations thereunder are described in subsections (b) through (j) below.");
      bulletItem(ctx, "1. Legal Marital Status: events that change a Participant\u2019s legal marital status, including marriage, divorce, death of a spouse, legal separation or annulment;");
      bulletItem(ctx, "2. Number of Dependents: Events that change a Participant\u2019s number of dependents, including birth, adoption, placement for adoption, or death of a dependent;");
      bulletItem(ctx, "3. Employment Status: termination or commencement of employment, a strike or lockout, commencement of or return from an unpaid leave of absence, or a change in worksite;");
      bulletItem(ctx, "4. Dependent satisfies or ceases to satisfy the Eligibility Requirements due to attainment of age, student status, or any similar circumstance;");
      bulletItem(ctx, "5. Residency: A change in the place of residence of the Participant, spouse or dependent.");
      bodyText(ctx, "b. Affected Participants may change an election for accident or health coverage during a Plan Year and make a new election in accordance with the special enrollment rights provided in Code Section 9801(f) pertaining to HIPAA special enrollment rights or the Family and Medical Leave Act, including those authorized under the Children\u2019s Health Insurance Program Reauthorization Act of 2009 (CHIP).");
      bodyText(ctx, "c. In the event of a judgment, decree, or order resulting from a divorce, legal separation, annulment, or change in legal custody (including a qualified medical child support order defined in ERISA Section 609) that requires accident or health coverage for a Participant\u2019s child, the Plan may change an election to provide coverage, or the Participant may cancel coverage if the order requires the former spouse to provide coverage and such coverage is actually provided.");
      bodyText(ctx, "d. Participants may change elections to cancel accident or health coverage if the Participant or spouse or dependent becomes entitled to coverage under Part A or Part B of Medicare or Medicaid. If eligibility for such coverage is lost, the individual may prospectively elect coverage under the Plan.");
      bodyText(ctx, "e. Participants may make a prospective election change to add group health coverage if the Participant or spouse or dependent loses coverage under any group health coverage sponsored by a governmental or educational institution, including CHIP, Indian Health Service, state health benefits risk pool, or a foreign government group health plan.");
      if (data.elections.allowChangeBelow30Hours) {
        bodyText(ctx, "f. A Participant may prospectively revoke his or her election of group health plan coverage if (i) the Participant changes from full-time employment (at least 30 hours of service per week) to part-time employment (less than 30 hours of service per week), even if the Participant continues to be eligible, and (ii) the Participant and any related individuals intend to enroll in another plan that provides minimum essential coverage effective no later than the first day of the second month after the revocation.");
      }
      if (data.elections.allowChangeMarketplace) {
        bodyText(ctx, "g. A Participant may prospectively revoke his or her election of group health plan coverage if (i) the Participant is eligible for a Special Enrollment Period to enroll in a Qualified Health Plan through a Marketplace, or seeks to enroll during the Marketplace\u2019s annual open enrollment period, and (ii) the Participant or covered dependents intend to enroll in a Qualified Health Plan effective no later than the day immediately following the revocation.");
      }
      bodyText(ctx, "h. If the cost of a Benefit provided under the Plan increases or decreases during a Plan Year, the Plan shall automatically increase or decrease the Salary Redirections of all affected Participants. If the cost increases significantly, the Administrator shall permit affected Participants to make corresponding changes, elect similar coverage, or drop coverage if no similar option is available.");
      bodyText(ctx, "i. If coverage under a Benefit is significantly curtailed resulting in a complete loss of coverage, affected Participants may revoke their elections and elect coverage under another plan with similar coverage. If a new Benefit package option is added or significantly improved, affected Participants and eligible employees may elect the new option prospectively.");
      bodyText(ctx, "j. A Participant may make a prospective election change to add group health coverage if such individual loses group health coverage under a governmental or educational institution.");
    }},

    // Article VI - Administration
    { build: (ctx) => {
      articleHeading(ctx, "VI. Article - Administration");
      sectionTitle(ctx, "01. Plan Administration");
      bodyText(ctx, "The Employer shall be the Administrator, unless the Employer elects otherwise. The Employer may appoint any person or persons to perform the duties of the Administrator. The Administrator shall have full power to administer the Plan in all of its details. The Administrator\u2019s powers shall include, but shall not be limited to:");
      bulletItem(ctx, "a. To make and enforce rules and regulations for efficient administration of the Plan;");
      bulletItem(ctx, "b. To interpret the Plan, with interpretations in good faith being final and conclusive;");
      bulletItem(ctx, "c. To decide all questions concerning eligibility and benefits;");
      bulletItem(ctx, "d. To reject elections or limit contributions to avoid discrimination under the Code;");
      bulletItem(ctx, "e. To provide employees with reasonable notification of benefits;");
      bulletItem(ctx, "f. To keep and maintain Plan documents and all records necessary for administration;");
      bulletItem(ctx, "g. To keep procedures for determining qualified medical child support orders under ERISA Section 609;");
      bulletItem(ctx, "h. To appoint agents, counsel, accountants, consultants, and actuaries as required.");
      sectionTitle(ctx, "02. Examination of Records");
      bodyText(ctx, "The Administrator shall make available to each Participant, Eligible Employee and any other Employee of the Employer such records as pertain to their respective interests under the Plan for examination at reasonable times during normal business hours.");
      sectionTitle(ctx, "03. Payment of Expenses");
      bodyText(ctx, "Any reasonable administrative expenses shall be paid by the Employer unless the Employer determines that administrative costs shall be borne by the Participants under the Plan or by any Trust Fund which may be established hereunder. The Administrator may impose reasonable conditions for payments, provided that such conditions shall not discriminate in favor of Highly Compensated Employees.");
      sectionTitle(ctx, "04. Application of Forfeited Amounts");
      bodyText(ctx, "This Plan is structured as a premium-only cafeteria plan under which Salary Redirections are applied to pay Premium Expenses for the elected Insurance Contracts. Accordingly, the Plan does not anticipate the routine generation of forfeitures or experience gains, since Salary Redirections are remitted to Insurers on the Participant’s behalf rather than held in a reimbursement account. To the extent any Salary Redirection amount is withheld from a Participant’s Compensation but cannot be applied to pay a Premium Expense (for example, because the Participant’s coverage terminates before the corresponding period of coverage), such amount shall be refunded to the Participant in accordance with the Section titled: “Termination of Employment” of Article II of this Plan and the Treasury regulations under Code Section 125. Any residual amount that cannot, after reasonable effort, be refunded to the Participant shall be retained by the Employer and applied to defray reasonable administrative expenses of the Plan.");
      sectionTitle(ctx, "05. Insurance Control Clause");
      bodyText(ctx, "In the event of a conflict between the terms of this Plan and the terms of an Insurance Contract, the terms of the Insurance Contract shall control as to those Participants receiving coverage under such Insurance Contract.");
      sectionTitle(ctx, "06. Indemnification of Administrator");
      bodyText(ctx, "The Employer agrees to indemnify and to defend to the fullest extent permitted by law any Employee serving as the Administrator against all liabilities, damages, costs and expenses (including attorney\u2019s fees and amounts paid in settlement of any claims approved by the Employer) occasioned by any act or omission to act in connection with the Plan, if such act or omission is in good faith.");
    }},

    // Article VII + VIII
    { build: (ctx) => {
      articleHeading(ctx, "VII. Article - Amendment or Termination of Plan");
      sectionTitle(ctx, "01. Amendment");
      bodyText(ctx, "The Employer, at any time or from time to time, may amend any or all of the provisions of the Plan without the consent of any Employee or Participant. No amendment shall have the effect of modifying any benefit election of any Participant in effect at the time of such amendment, unless such amendment is made to comply with federal, state or local laws, statutes or regulations.");
      sectionTitle(ctx, "02. Termination");
      bodyText(ctx, "The Employer is establishing this Plan with the intent that it will be maintained for an indefinite period of time. Notwithstanding the foregoing, the Employer reserves the right to terminate the Plan, in whole or in part, at any time. In the event the Plan is terminated, no further contributions shall be made. Benefits under any Insurance Contract shall be paid in accordance with the terms of the Contract. Upon termination of the Plan, any unremitted Salary Redirections held by the Employer shall be returned to the affected Participants as soon as administratively practicable, to the extent permitted by applicable law and the terms of the underlying benefit programs.");
    }},

    // Article VIII - Miscellaneous
    { build: (ctx) => {
      articleHeading(ctx, "VIII. Article - Miscellaneous");
      sectionTitle(ctx, "01. Plan Interpretation");
      bodyText(ctx, "All provisions of this Plan shall be governed and interpreted by the Employer, or its delegated Administrator, as applicable, in its full and complete discretion and shall be otherwise applied in a uniform, nondiscriminatory manner. This Plan shall be read in its entirety and not severed except as provided in the Section titled: \u201cSeverability.\u201d");
      sectionTitle(ctx, "02. Gender and Number");
      bodyText(ctx, "Wherever any words are used herein in the masculine, or feminine, or are gender neutral, they shall be construed as though they were also used in another gender in all cases where they would so apply, and whenever any words are used herein in the singular or plural form, they shall be construed as though they were also used in the other form in all cases where they would so apply.");
      sectionTitle(ctx, "03. Written Document");
      bodyText(ctx, "This Plan document, in conjunction with any separate written document which may be required by law, is intended to satisfy the written Plan requirement of Code Section 125 and any Regulations thereunder relating to Cafeteria Plans.");
      sectionTitle(ctx, "04. Exclusive Benefit");
      bodyText(ctx, "This Plan shall be maintained for the exclusive benefit of the Employees who participate in the Plan.");
      sectionTitle(ctx, "05. Participant\u2019s Rights");
      bodyText(ctx, "This Plan shall not be deemed to constitute an employment contract between the Employer and any Participant or to be a consideration or an inducement for the employment of any Participant or Employee. Nothing contained in this Plan shall be deemed to give any Participant or Employee the right to be retained in the service of the Employer or to interfere with the right of the Employer to discharge any Participant or Employee at any time.");
      sectionTitle(ctx, "06. Action by the Employer");
      bodyText(ctx, "Whenever under the terms of the Plan the Employer is permitted or required to do or perform any act or matter or thing, it shall be done and performed by a person duly authorized by the Employer to do so.");
      sectionTitle(ctx, "07. Employer\u2019s Protective Clauses");
      bodyText(ctx, "a. Upon the failure of the Employer to obtain the insurance contemplated by this Plan, a Participant\u2019s Benefits shall be limited to the insurance premium(s) that remained unpaid for the period in question and the actual insurance proceeds received.");
      bodyText(ctx, "b. The Employer\u2019s liability to a Participant shall only extend to and shall be limited to any payment actually received by the Employer from the Insurer.");
      bodyText(ctx, "c. The Employer shall not be responsible for the validity of any Insurance Contract issued hereunder or for the failure on the part of the Insurer to make payments provided for under any Insurance Contract.");
      sectionTitle(ctx, "08. No Guarantee of Tax Consequences");
      bodyText(ctx, "Neither the Administrator nor the Employer makes any commitment or guarantee that any amounts paid to or for the benefit of a Participant under the Plan will be excludable from the Participant\u2019s gross income for federal or state income tax purposes, or that any other federal or state tax treatment will apply to or be available to any Participant.");
      sectionTitle(ctx, "09. Indemnification of Employer by Participants");
      bodyText(ctx, "If any Participant receives one or more payments or reimbursements under the Plan that are not for a permitted Benefit, such Participant shall indemnify and reimburse the Employer for any liability it may incur for failure to withhold federal or state income tax or Social Security tax from such payments or reimbursements.");
      sectionTitle(ctx, "10. Funding");
      bodyText(ctx, "Unless otherwise required by law, contributions to the Plan need not be placed in trust or dedicated to a specific Benefit, but shall instead be considered general assets of the Employer until the Premium Expense required under the Plan has been paid. No Participant or other person shall have any claim against, right to, or security or other interest in, any fund, account or asset of the Employer from which any payment under the Plan may be made.");
      sectionTitle(ctx, "11. Governing Law");
      bodyText(ctx, `This Plan is governed by the Code and the Treasury regulations issued thereunder (as they might be amended from time to time). In no event does the Employer guarantee the favorable tax treatment sought by this Plan. To the extent not preempted by federal law, the provisions of this Plan shall be construed, enforced and administered according to the laws of the state of ${govLaw}.`);
      sectionTitle(ctx, "12. Severability");
      bodyText(ctx, "If any provision of the Plan is held invalid or unenforceable, its invalidity or unenforceability shall not affect any other provisions of the Plan, and the Plan shall be construed and enforced as if such provision had not been included herein.");
      sectionTitle(ctx, "13. Captions");
      bodyText(ctx, "The captions contained herein are inserted only as a matter of convenience and for reference, and in no way define, limit, enlarge, or describe the scope or intent of the Plan.");
      sectionTitle(ctx, "14. Continuation of Coverage");
      bodyText(ctx, "Notwithstanding anything in the Plan to the contrary, in the event any benefit under this Plan subject to the continuation coverage requirement of Code Section 4980B becomes unavailable, each Participant will be entitled to continuation coverage as prescribed in Code Section 4980B. The detailed COBRA continuation provisions, FMLA and USERRA continuation provisions, and Qualified Medical Child Support Order procedures are set forth in the Articles titled “COBRA Continuation of Coverage,” “FMLA and USERRA Continuation of Coverage,” and “Qualified Medical Child Support Orders” below.");
      sectionTitle(ctx, "15. Health Insurance Portability and Accountability Act");
      bodyText(ctx, "Notwithstanding anything in this Plan to the contrary, this Plan shall be operated in accordance with the Health Insurance Portability and Accountability Act of 1996, as amended (“HIPAA”), and the regulations issued thereunder, including the Privacy Rule (45 C.F.R. Parts 160 and 164, Subparts A and E), the Security Rule (45 C.F.R. Parts 160 and 164, Subparts A and C), and the Breach Notification Rule (45 C.F.R. Part 164, Subpart D), to the extent applicable to the Plan and to the underlying group health plans offered through the Plan.");
      bodyText(ctx, "The Plan Administrator shall designate in writing a Privacy Officer and, to the extent the Plan creates, receives, maintains, or transmits electronic protected health information (“ePHI”), a Security Officer, who shall be responsible for the development, implementation, and ongoing oversight of the policies and procedures necessary to comply with HIPAA’s Privacy, Security, and Breach Notification requirements. The Plan shall maintain written policies and procedures addressing, at a minimum: (a) permitted and required uses and disclosures of protected health information (“PHI”); (b) administrative, physical, and technical safeguards for PHI and ePHI; (c) the rights of individuals with respect to their PHI, including the rights of access, amendment, accounting of disclosures, restriction, and confidential communications; (d) the procedures for responding to a breach of unsecured PHI; (e) the training of workforce members who have access to PHI; and (f) the imposition of appropriate sanctions on workforce members who violate the Plan’s privacy and security policies.");
      bodyText(ctx, "The Plan Administrator shall ensure that any business associate that creates, receives, maintains, or transmits PHI on behalf of the Plan executes a written business associate agreement that satisfies the requirements of 45 C.F.R. § 164.504(e) and 45 C.F.R. § 164.314(a). The Employer, as Plan Sponsor, shall amend the Plan documents to incorporate the certifications and restrictions on Employer use and disclosure of PHI required by 45 C.F.R. § 164.504(f), to the extent applicable.");
      sectionTitle(ctx, "16. Uniformed Services Employment and Reemployment Rights Act");
      bodyText(ctx, "Notwithstanding any provision of this Plan to the contrary, contributions, benefits and service credit with respect to qualified military service shall be provided in accordance with USERRA and the regulations thereunder.");
      sectionTitle(ctx, "17. Genetic Information Nondiscrimination Act");
      bodyText(ctx, "Notwithstanding any provision of this Plan to the contrary, this Plan shall be operated in accordance with GINA and regulations thereunder.");
      if (data.employer.stateOfGoverningLaw === "CA") {
        sectionTitle(ctx, "18. California-Specific Provisions");
        bodyText(ctx, "California Continuation Benefits Replacement Act (Cal-COBRA). To the extent the Employer is subject to the California Continuation Benefits Replacement Act, California Health and Safety Code Section 1366.20 et seq. and California Insurance Code Section 10128.50 et seq. (collectively, “Cal-COBRA”), because the Employer normally employs from two (2) to nineteen (19) employees on at least 50% of its working days during the preceding calendar year (or, in the case of a new employer, the preceding calendar quarter) and the Employer’s group health coverage is provided through an insurance policy or health care service plan contract issued in California, eligible Participants and their qualified beneficiaries may have the right to continue group health coverage under Cal-COBRA following a qualifying event. Cal-COBRA continuation coverage is administered by the issuer of the underlying insurance policy or health care service plan contract, and detailed information about Cal-COBRA, including the maximum duration of coverage (generally 36 months from the date of the qualifying event), the premium requirements (not to exceed 110% of the applicable group rate, or 150% during a disability extension), the election period, and the notice procedures, is available from the insurance carrier and from the Plan Administrator. Cal-COBRA also extends federal COBRA continuation coverage by up to a total of 36 months for qualified beneficiaries whose federal COBRA coverage expires before reaching the 36-month maximum.");
        bodyText(ctx, "Compliance with California Law. The Plan shall be operated in compliance with applicable California law, including the California Insurance Code, the California Health and Safety Code, the California Labor Code, and the California Civil Code (including the California Consumer Privacy Act and the California Privacy Rights Act, to the extent applicable to plan data), in each case to the extent not preempted by federal law (including the Internal Revenue Code, ERISA, and HIPAA).");
      }
    }},

    // Article IX - COBRA
    { build: (ctx) => getCobraPDFBuilder(ctx) },

    // Article X - FMLA and USERRA
    { build: (ctx) => getFmlaUserraPDFBuilder(ctx) },

    // Article XI - QMCSO
    { build: (ctx) => getQmcsoPDFBuilder(ctx) },

    // Adoption Agreement
    { build: (ctx) => {
      articleHeading(ctx, "Adoption Agreement");
      emptyLine(ctx);
      bodyText(ctx, `For ${name}`, { bold: true });
      bodyText(ctx, "Section 125 Premium Only Plan");
      emptyLine(ctx);
      bodyText(ctx, "The undersigned Employer adopted the Premium Only Plan for those Employees who shall qualify as Participants thereunder. It shall be effective as of the date specified below. The Employer hereby selects the following Plan specifications:");
      emptyLine(ctx);
      bodyText(ctx, `1. Name of Employer: ${name}`, { bold: true });
      bodyText(ctx, `2. Effective Date: This adopted Premium Only Plan shall be effective as of ${effective}`, { bold: true });
      bodyText(ctx, `3. Plan Year: Your Plan\u2019s records are maintained on the basis of a twelve-month period. This is known as the Plan Year. The adopted plan year begins on ${pyStart} and ends on ${pyEnd}.`, { bold: true });
      bodyText(ctx, "4. Employer\u2019s Principal Office:", { bold: true });
      bodyText(ctx, addr1, { indent: true });
      bodyText(ctx, addr2, { indent: true });
      bodyText(ctx, "5. Benefits: All the benefits listed below are included in this plan:", { bold: true });
      bodyText(ctx, "Health Plan. Premiums that are payroll deducted on a pre-tax basis may include the following:", { indent: true });
      benefits.forEach((b) => bulletItem(ctx, b));
      signatureBlock(ctx, name);
    }},

    // Certificate of Resolution
    { build: (ctx) => {
      articleHeading(ctx, "CERTIFICATE OF RESOLUTION");
      emptyLine(ctx);
      bodyText(ctx, `The undersigned authorized representative of ${name} (the Employer) hereby certifies that the following resolutions were duly adopted by the governing body of the Employer on ____________________, and that such resolutions have not been modified or rescinded as of the date hereof:`);
      emptyLine(ctx);
      bodyText(ctx, `RESOLVED, that the form of Premium Only Plan under Code Section 125, effective ${effective}, presented to this meeting (and a copy of which is attached hereto) is hereby approved and adopted, and that the proper agents of the Employer are hereby authorized and directed to execute and deliver to the Administrator of said Plan one or more counterparts of the Plan.`);
      emptyLine(ctx);
      bodyText(ctx, "RESOLVED, that the Administrator shall be instructed to take such actions that the Administrator deems necessary and proper in order to implement the Plan, and to set up adequate accounting and administrative procedures for the provision of benefits under the Plan.");
      emptyLine(ctx);
      bodyText(ctx, "RESOLVED, that the proper agents of the Employer shall act as soon as possible to notify the employees of the Employer of the adoption of the Plan and to deliver to each employee a copy of the Summary Plan Description of the Plan, which Summary Plan Description is attached hereto and is hereby approved.");
      emptyLine(ctx);
      bodyText(ctx, `The undersigned further certifies that attached hereto as Exhibits, are true copies of ${name}\u2019s Benefit Plan Document and Summary Plan Description approved and adopted at this meeting.`);
      emptyLine(ctx);
      bodyText(ctx, `Company: ${name}`, { bold: true });
      signatureBlock(ctx, name);
    }},
  ];
}
