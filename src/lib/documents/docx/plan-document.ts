import { Paragraph } from "docx";
import type { FormData } from "@/types";
import {
  coverPage, articleHeading, sectionTitle, definitionItem,
  body, bodyBold, bullet, signatureBlock, checkboxItem,
  pageBreak, emptyLine, horizontalRule,
} from "./docx-builder";
import { formatDate, formatMonthDay, stateName, entityLabel, benefitsList } from "../helpers";

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

  const p: Paragraph[] = [];

  // ========== TITLE PAGE ==========
  p.push(...coverPage(name, addr1, addr2, "Section 125 Premium Only Plan", "Plan Document", effective));
  p.push(pageBreak());

  // ========== TABLE OF CONTENTS ==========
  p.push(articleHeading("TABLE OF CONTENTS"));
  p.push(emptyLine());
  p.push(body("I. Article - Definitions"));
  p.push(body("II. Article - Participation"));
  p.push(body("III. Article - Contributions to the Plan"));
  p.push(body("IV. Article - Benefits"));
  p.push(body("V. Article - Participant Elections"));
  p.push(body("VI. Article - Administration"));
  p.push(body("VII. Article - Amendment or Termination of Plan"));
  p.push(body("VIII. Article - Miscellaneous"));
  p.push(pageBreak());

  // ========== INTRODUCTION ==========
  p.push(articleHeading("Introduction"));
  p.push(body(`The company has adopted this Plan effective ${effective}. Its purpose is to provide benefits for those Employees who shall qualify hereunder and their Dependents and beneficiaries. The concept of this Plan is to allow Employees to elect between cash compensation or certain nontaxable benefit options as they desire. The Plan shall be known as the ${name} Premium Only Plan (the \u201cPlan\u201d).`));
  p.push(emptyLine());

  // ========== ARTICLE I - DEFINITIONS ==========
  p.push(articleHeading("I. Article - Definitions"));
  p.push(horizontalRule());
  p.push(emptyLine());

  p.push(definitionItem("01", "Administrator", `means the individual(s) or corporation appointed by the Employer to carry out the administration of the Plan. The Employer shall be empowered to appoint and remove the Administrator from time to time as it deems necessary for the proper administration of the plan. In the event an Administrator has not been appointed, or resigns from an appointment, the Employer shall be deemed to be the Administrator.`));

  p.push(definitionItem("02", "Benefit", `means any of the optional benefit choices available to a Participant as outlined in the Section titled: \u201cBenefit Options\u201d.`));

  p.push(definitionItem("03", "Code", `means Section 125 of the Internal Revenue Code of 1986, as amended or replaced from time to time, and any governing regulations or applicable guidance thereunder.`));

  p.push(definitionItem("04", "Compensation", `means the total cash remuneration received by the Participant from the Employer during a Plan Year, prior to any reductions pursuant to an Election to Participate form authorized hereunder.`));

  p.push(definitionItem("05", "Dependent", `means any individual who is so defined under an Insurance Contract or who is (i) a Qualifying Child (within the meaning of Code Section 152(c), subject to the exceptions of Code Section 152(b)) or Participant\u2019s child (within the meaning of Code Section 152(f)(1)) who has not attained age 27 as of the end of the taxable year, or (ii) a Qualifying Relative who qualifies as a dependent under an Insurance Contract or under (within the meaning of Code Section 152(d), subject to the exceptions of Code Section 152(b)) (as modified by Code Section 105(b)), as applicable. Certain provisions of \u201cMichelle\u2019s Law,\u201d in which the requirement that a Dependent child have a full-time status in order to extend coverage past a stated age, will generally not apply if the child\u2019s failure to maintain full-time status is due to a medically necessary leave of absence or other change in enrollment (such as a reduction of hours). Notwithstanding anything in the Plan to the contrary, the Plan will comply with Michelle\u2019s Law.`));

  p.push(definitionItem("06", "Effective Date", `means the effective date of the Plan which is ${effective}.`));

  p.push(definitionItem("07", "Election Period", `means the period immediately preceding the beginning of each Plan Year established by the Administrator for the election of Benefits and Salary Redirections, such period to be applied on a uniform and nondiscriminatory basis for all Employees and Participants. However, an Employee\u2019s initial Election Period shall be determined pursuant to the Section titled: \u201cInitial Elections\u201d.`));

  p.push(definitionItem("08", "Eligible Employee", `means any Employee who has satisfied the provisions of the Section titled: \u201cEligibility\u201d. However, 2% shareholders as defined under Code Section 1372(b) and self-employed individuals as defined under Code Section 401(c) shall not be eligible to participate in this Plan. An individual shall not be an \u201cEligible Employee\u201d if such individual is not reported on the payroll records of the Employer as a common law employee. In particular, it is expressly intended that individuals not treated as common law employees by the Employer on its payroll records are not \u201cEligible Employees\u201d and are excluded from Plan participation even if a court or administrative agency determines that such individuals are common law employees and not independent contractors.`));

  p.push(definitionItem("09", "Employee", `means any person who is employed by the Employer, but generally excludes any person who is employed as an independent contractor and any person who is considered self-employed under Code Section 401(c), as well as any person who is a greater than two percent (2%) shareholder in a Subchapter S corporation, a partner in a partnership or an owner or member of a limited liability company that elects partnership status on its tax return. The term Employee shall include leased employees within the meaning of Code Section 414(n)(2), unless excluded by the terms of an Insurance Contract.`));

  p.push(definitionItem("10", "Employer", `means the ${entity} or any such entity specified in Item 1 of the Adoption Agreement, and any Affiliated Employer (as defined in the Article titled: \u201cDefinitions\u201d), that adopts this Plan; and any successor, that maintain this Plan; and any predecessor that has maintained this Plan.`));

  p.push(definitionItem("11", "Highly Compensated Employee", `means, for the purposes of determining discrimination, an Employee so described in Code Section 125 and the Treasury Regulations thereunder.`));

  p.push(definitionItem("12", "Insurance Contract", `means any contract issued by an Insurer underwriting a Benefit, or any self-funded arrangement providing any Benefit offered for health and welfare coverage to Eligible Employees of the Employer.`));

  p.push(definitionItem("13", "Insurance Premium Payment Plan", `means the plan of benefits contained in the Section titled: \u201cBenefit Options\u201d of this Plan, that provides for the payment of Premium Expenses.`));

  p.push(definitionItem("14", "Insurer", `means any insurance company that underwrites a Benefit or any self-funded arrangement under this Plan.`));

  p.push(definitionItem("15", "Key Employee", `means an employee defined in Code Section 416(i)(1) and the Treasury regulations thereunder.`));

  p.push(definitionItem("16", "Participant", `means any Eligible Employee who elects to become a Participant pursuant to the Section titled: \u201cApplication to Participate\u201d and has not for any reason become ineligible to participate further in the Plan.`));

  p.push(definitionItem("17", "Plan", `means the Section 125 Premium Only Plan described in this instrument, including all amendments thereto.`));

  p.push(definitionItem("18", "Plan Year", `means the 12-month period beginning and ending on the dates specified in the Adoption Agreement. The Plan Year shall be the coverage period for the Benefits provided for under this Plan. In the event a Participant commences participation during a Plan Year, then the initial coverage period shall be that portion of the Plan Year commencing on such Participant\u2019s date of entry and ending on the last day of such Plan Year.`));

  p.push(definitionItem("19", "Premium Expenses", `or \u201cPremiums\u201d mean the Participant\u2019s cost for the insured Benefits described in the Section titled: \u201cBenefit Options\u201d.`));

  p.push(definitionItem("20", "Regulations", `means either temporary, proposed or final regulations, as applicable, issued from the Department of Treasury, as well as any guidance or interpretations issued in connection therewith.`));

  p.push(definitionItem("21", "Salary Redirection", `means the contributions made by the Employer on behalf of Participants in accordance with the Section titled: \u201cSalary Redirection\u201d. These contributions shall be allocated to the funds or accounts established for cost of applicable Benefits provided under the Plan pursuant to the Participants\u2019 elections made under the Article titled: \u201cParticipant Elections\u201d.`));

  p.push(definitionItem("22", "Spouse", `means \u201cspouse\u201d as defined in an Insurance Contract, then, for purposes of coverage under that Insurance Contract only, \u201cspouse\u201d shall have the meaning stated in the Insurance Contract. In all other cases, \u201cspouse\u201d shall have the meaning stated under applicable federal or state law.`));

  p.push(definitionItem("23", "Uniformed Services", `means the Armed Forces, the Army National Guard, and the Air National Guard when engaged in active duty for training, inactive duty training, or full-time National Guard duty, the commissioned corps of the Public Health Service, and any other category of persons designated by the President of the United States in time of war or emergency.`));

  p.push(body("All other defined terms in this Plan shall have the meanings specified in the various Articles of the Plan in which they appear."));

  // ========== ARTICLE II - PARTICIPATION ==========
  p.push(pageBreak());
  p.push(articleHeading("II. Article - Participation"));
  p.push(horizontalRule());

  p.push(sectionTitle("01. Eligibility"));
  p.push(body(`As to each Benefit provided hereunder, any Eligible Employee shall be eligible to participate as of the date he or she satisfies the eligibility conditions set forth in the policy or plan providing such Benefit (the \u201cEligibility Requirements\u201d), the provisions of which are specifically incorporated herein by reference.`));

  p.push(sectionTitle("02. Effective Date of Participation"));
  p.push(body(`(a) An Eligible Employee shall become a Participant effective as of the later of the date on which he or she satisfies the Eligibility Requirements of the Plan or the Effective Date of this Plan.`));
  p.push(body(`(b) If an Eligible Employee terminates employment after commencing participation in the Plan, except as otherwise provided in the applicable policy or plan providing a Benefit, and such terminated Eligible Employee is rehired within 30 days or less of the date of termination of employment, such rehired Eligible Employee shall not be considered a newly eligible employee and will be reinstated with the same election(s) such individual had before termination. If a terminated Eligible Employee is rehired more than 30 days following termination of employment and is otherwise eligible to participate in the Plan, the individual shall be treated as a newly Eligible Employee and may make a new election under procedures otherwise set forth within this section or the Section titled: \u201cInitial Elections\u201d below as applicable.`));

  p.push(sectionTitle("03. Application to Participate"));
  p.push(body(`An Employee who is eligible to participate in this Plan may, during the applicable Election Period, complete an Election to Participate form that the Administrator shall furnish to the Employee. The Election to Participate form is an irrevocable election made by the Employee to redirect and reduce taxable compensation to cover the Employee\u2019s applicable cost of Benefits elected, which shall be applicable until the end of the current Plan Year, unless the Participant is entitled to change his or her Benefit elections pursuant to the Section titled: \u201cChange of Elections\u201d.`));
  p.push(body(`Such election shall be effective for the first pay period beginning on or after the Employee\u2019s effective date of participation pursuant to the Section titled: \u201cEffective Date of Participation\u201d.`));

  p.push(sectionTitle("04. Termination of Participation"));
  p.push(body(`A Participant shall no longer participate in this Plan upon the occurrence of any of the following events: (a) His or her termination of employment, subject to the provisions of the Section titled: \u201cTermination of Employment\u201d; (b) His or her death; or (c) The termination of this Plan, subject to the provisions of the Section titled: \u201cTermination\u201d.`));

  p.push(sectionTitle("05. Termination of Employment"));
  p.push(body(`If a Participant terminates employment with the Employer for any reason other than death, his or her participation in the Plan shall cease, subject to the Participant\u2019s right to continue coverage under any Insurance Contract for which premiums have already been paid.`));
  p.push(body(`When an Employee ceases to be a Participant, the cafeteria plan must pay the Employee any amount the Employee previously paid for coverage or Benefits to the extent the previously paid amount relates to the period from the date the Employee ceases to be a Participant through the end of that Plan Year.`));

  // ========== ARTICLE III - CONTRIBUTIONS ==========
  p.push(pageBreak());
  p.push(articleHeading("III. Article - Contributions to the Plan"));
  p.push(horizontalRule());

  p.push(sectionTitle("01. Salary Redirection"));
  p.push(body(`Benefits under the Plan shall be financed by Salary Redirections sufficient to support Benefits that a Participant has elected hereunder and to pay the Participant\u2019s Premium Expenses. The salary administration program of the Employer shall allow each Participant to agree to reduce his or her pay during a Plan Year by an amount determined necessary to purchase the elected Benefit and to pay the Participant\u2019s Premium Expenses. The amount of such Salary Redirection shall be specified by the Plan Sponsor and shall be applicable for a Plan Year. Notwithstanding the above, for new Participants, the Salary Redirections shall only be applicable from the first day of the pay period following the Employee\u2019s entry date up to and including the last day of the Plan Year. These contributions shall be allocated to the funds or accounts established under the Plan pursuant to the Participants\u2019 elections made in accordance with the Article titled: \u201cParticipant Elections\u201d.`));
  p.push(body(`Any Salary Redirection shall be determined prior to the beginning of a Plan Year (subject to initial elections pursuant to the Section titled: \u201cInitial Elections\u201d) and prior to the end of the Election Period and shall be irrevocable for such Plan Year. However, a Participant may revoke a Benefit election after the Plan Year has commenced and make a new Election to Participate (or decline participation on the Election to Not Participate form) with respect to the remainder of the Plan Year, if both the revocation and the new election are on account of and consistent with a change in status and such other permitted events as determined under the Article titled: \u201cParticipant Elections\u201d of the Plan and consistent with the rules and regulations of the Department of the Treasury. Salary Redirection amounts shall be contributed on a pro rata basis for each pay period during the Plan Year. All individual Election forms are deemed to be part of this Plan and incorporated herein by reference.`));

  p.push(sectionTitle("02. Application of Contributions"));
  p.push(body(`As soon as reasonably practical after each payroll period, the Employer shall apply the Salary Redirections to provide the Benefits elected by the affected Participants. Amounts designated for the Participant\u2019s Premium Expense Reimbursement Account shall likewise be credited to such account for the purpose of paying Premium Expenses.`));

  p.push(sectionTitle("03. Periodic Contributions"));
  p.push(body(`Notwithstanding the requirement provided above and in other Articles of this Plan that Salary Redirections be contributed to the Plan by the Employer on behalf of an Employee on a level and pro rata basis for each payroll period, the Employer and Administrator may implement a procedure in which Salary Redirections are contributed throughout the Plan Year on a periodic basis that is not pro rata for each payroll period. In the event Salary Redirections are not made on a pro rata basis, upon termination of participation, a Participant may be entitled to a refund of such Salary Redirections pursuant to the Section titled: \u201cTermination of Employment\u201d.`));

  // ========== ARTICLE IV - BENEFITS ==========
  p.push(pageBreak());
  p.push(articleHeading("IV. Article - Benefits"));
  p.push(horizontalRule());

  p.push(sectionTitle("01. Benefit Options"));
  p.push(body(`Each Participant may elect to have his or her full compensation paid to him in taxable compensation or elect to have the amount of his or her Salary Redirection amounts applied to any one or more of the optional Benefits or any other group-insured or self-funded Benefit permitted under Code Section 125, that is offered by the Employer as set forth in the Adoption Agreement.`));
  p.push(body(`The Employer may select suitable health and hospitalization Insurance Contracts for use in providing health Benefits, which policies will provide uniform benefits for all Participants electing this Benefit.`));

  p.push(sectionTitle("02. Description of Benefits"));
  p.push(body(`Each Eligible Employee may elect to have the Administrator pay those contributions that the Employee is required to make to the Benefit options described under the Section titled: \u201cBenefit Options\u201d, as a condition for the Employee and his or her Dependents to participate in those Benefit options.`));

  p.push(sectionTitle("03. Nondiscrimination Requirements"));
  p.push(body(`(a) It is the intent of this Plan to provide benefits to a classification of Employees that the Secretary of the Treasury finds not to be discriminatory in favor of the group in whose favor discrimination is prohibited under Code Section 125 or applicable Regulations thereunder.`));
  p.push(body(`(b) If the Administrator deems it necessary, in order, to avoid discrimination or possible taxation to Highly Compensated Employees, Key Employees or a group of employees in whose favor discrimination is prohibited by Code Section 125, it may, but shall not be required to, reduce contributions or non-taxable Benefits in order to assure compliance with this section. Any act taken by the Administrator under this section shall be carried out in a uniform and nondiscriminatory manner. If the Administrator decides to reduce contributions or non-taxable Benefits, it shall be done in the following manner. First, the non-taxable Benefits of the affected Participant (either an employee who is highly compensated or a Key Employee, whichever is applicable) who has the highest amount of non-taxable Benefits for the Plan Year shall have his or her non-taxable benefits reduced until the discrimination tests set forth in this Section are satisfied or until the amount of his or her non-taxable Benefits equals the non-taxable Benefits of the affected Participant who has the second highest amount of non-taxable Benefits. This process shall continue until the nondiscrimination tests set forth in this Section are satisfied. With respect to any affected Participant who has had Benefits reduced pursuant to this Section, the reduction shall be made proportionately among all insured Benefits. Contributions which are not utilized to provide Benefits to any Participant by virtue of any administrative act under this paragraph shall be forfeited and deposited into the Plan surplus.`));

  p.push(sectionTitle("04. Non-Tax Dependent Coverage"));
  p.push(body(`If (i) Employee Salary Redirections are made to fund Benefits under the Plan, and (ii) the Employer allows a Participant to elect to cover a Non-Tax Dependent through the Participant\u2019s coverage under group Medical, Dental or Vision benefit(s), a Participant who elects to participate in the Salary Redirection program may pay on a pre-tax basis through salary reduction contributions the Participant\u2019s portion of the premium cost of coverage under the Employer\u2019s Medical, Dental or Vision Benefits, provided that the full fair market value of such Medical, Dental or Vision coverage for any such Non-Tax Dependent shall be includible in the Participant\u2019s gross income as a taxable benefit in accordance with applicable federal income tax rules. For purposes of this Plan, the Participant electing coverage for Non-Tax Dependent(s) shall be treated as receiving, at the time that coverage is received, cash compensation equal to the full fair market value of such coverage and then as having purchased the coverage with after-tax employee contributions.`));

  // ========== ARTICLE V - PARTICIPANT ELECTIONS ==========
  p.push(pageBreak());
  p.push(articleHeading("V. Article - Participant Elections"));
  p.push(horizontalRule());

  p.push(sectionTitle("01. Initial Elections"));
  p.push(body(`An Employee who meets the Eligibility Requirements of the Plan on the first day of, or during, a Plan Year may elect to participate in this Plan for all or the remainder of such Plan Year, provided he or she elects to do so before his or her effective date of participation pursuant to the Section titled: \u201cEffective Date of Participation\u201d. or for a newly eligible Employee, no more than 30 days after their date of hire. For any such newly Eligible Employee, if coverage is effective as of the date of hire, such Employee shall be eligible to participate retroactively as of their date of hire. Newly Eligible Employee Election amounts will be collected the first pay period on or after his or her election was received. However, if such Employee does not complete an application to participate and a benefit election form and deliver them to the Administrator before such date, his or her Election Period shall extend 30 calendar days after such date, or for such further period as the Administrator shall determine and apply on a uniform and nondiscriminatory basis. However, any election during the extended 30-day election period pursuant to this Section shall not be effective until the first pay period following the later of such Participant\u2019s effective date of participation pursuant to the Section titled: \u201cEffective Date of Participation\u201d or the date of the receipt of the election form by the Administrator, and shall be limited to the Benefit expenses incurred for the balance of the Plan Year for which the election is made. Any failure to elect the Benefits set forth herein shall constitute an Employee\u2019s election to not participate in the Plan during that Plan Year until a valid election is otherwise made in the manner set forth herein.`));

  p.push(sectionTitle("02. Subsequent Annual Elections"));
  if (data.elections.employeeElections === "first_year_only") {
    p.push(body(`a. A Participant will automatically be enrolled in subsequent plan years unless the Participant terminates his or her participation in the Plan by notifying the Administrator in writing during the Election Period that he or she does not want to participate in the Plan for the next Plan Year;`));
    p.push(body(`b. A Participant may terminate his or her participation in the Plan by notifying the Administrator in writing during the Election Period that he or she does not want to participate in the Plan for the next Plan Year;`));
    p.push(body(`c. An Employee who elects to not participate for the Plan Year following the Election Period will have to wait until the next Election Period before again electing to participate in the Plan, except as provided for in the Section titled: \u201cChange of Elections\u201d.`));
  } else if (data.elections.employeeElections === "every_year") {
    p.push(body(`Each Participant must complete a new Election to Participate form during each Election Period in order to continue participation in the Plan for the next Plan Year. A Participant who fails to complete a new election form shall be deemed to have elected to not participate in the Plan for the next Plan Year.`));
  } else {
    p.push(body(`Participation in the Plan is automatic for all Eligible Employees. No election form is required.`));
  }

  p.push(sectionTitle("03. Change of Elections"));
  p.push(body(`a. Any Participant may change a Benefit election after the Plan Year has commenced and make new elections with respect to the remainder of such Plan Year if, under the facts and circumstances, the changes are necessitated by and are consistent with a change in status that is recognized under rules and regulations adopted by the Department of the Treasury. Notwithstanding anything herein to the contrary, if the rules and regulations conflict with provisions of this Plan, then such rules and regulations shall control.`));
  p.push(body(`In general, a change in election is not consistent if the change in status is the Participant\u2019s divorce, annulment or legal separation from a spouse, the death of a spouse or dependent, or a dependent ceasing to satisfy the Eligibility Requirements for coverage, and the Participant\u2019s election under the Plan is to cancel accident or health insurance coverage for any individual other than the one involved in such an event. In addition, if the Participant, spouse or dependent gains or loses eligibility for coverage under a family member\u2019s plan as a result of a change in marital status or a change in employment status, then a Participant\u2019s election under the Plan to cease or decrease coverage for that individual under the Plan is consistent with that change in status only if coverage for that individual becomes applicable or is increased under the family member\u2019s plan.`));
  p.push(body(`Regardless of the consistency requirement, if the individual, the individual\u2019s spouse, or dependent, becomes eligible for continuation coverage under the Employer\u2019s group health plan as provided in Code Section 4980B or any similar state law, then the individual may elect to increase payments under this Plan in order to pay for the continuation coverage. However, this does not apply for COBRA eligibility due to divorce, annulment or legal separation.`));
  p.push(body(`Any new election shall be effective at such time as the Administrator shall prescribe, but not earlier than the first pay period beginning after the election form is completed and returned to the Administrator. For the purposes of this subsection, a change in status shall only include the following events or other events permitted by Treasury regulations:`));

  p.push(bullet("1. Legal Marital Status: events that change a Participant\u2019s legal marital status, including marriage, divorce, death of a spouse, legal separation or annulment;"));
  p.push(bullet("2. Number of Dependents: Events that change a Participant\u2019s number of dependents, including birth, adoption, placement for adoption, or death of a dependent;"));
  p.push(bullet("3. Employment Status: Any of the following events that change the employment status of the Participant, spouse, or dependent: termination or commencement of employment, a strike or lockout, commencement of return from an unpaid leave of absence, or a change in worksite. In addition, if the eligibility conditions of this Plan or another employee benefit plan of the employer of the spouse, or dependent, depend on the employment status of that individual and there is a change in that individual\u2019s employment status with the consequence that the individual becomes (or ceases to be) eligible under the applicable plan, then that change constitutes a change in employment under this subsection;"));
  p.push(bullet("4. Dependent satisfies or ceases to satisfy the Eligibility Requirements: an event that causes the Participant\u2019s dependent to satisfy or cease to satisfy the requirements for coverage due to attainment of age, student status, or any similar circumstance; and"));
  p.push(bullet("5. Residency: A change in the place of residence of the Participant, spouse or dependent."));

  p.push(body(`b. Notwithstanding subsection (a), affected Participants may change an election for accident or health coverage during a Plan Year and make a new election in accordance with the special enrollment rights provided in Code Section 9801(f) pertaining to HIPAA special enrollment rights or the Family and Medical Leave Act. An affected Participant may change an election for accident or health coverage during a Plan Year and make a new election in accordance with the special enrollment rights provided in Code Section 9801(f), including those authorized under the provisions of the Children\u2019s Health Insurance Program Reauthorization Act of 2009 (CHIP); provided that such Participant meets the sixty (60) day notice requirement imposed by Code Section 9801(f) (or such longer period as may be permitted by the Plan and communicated to Participants). Such change shall take place on a prospective basis, unless required by Code Section 9801(f) to be retroactive.`));

  p.push(body(`c. Notwithstanding subsection (a), in the event of a judgment, decree, or order (\u201corder\u201d) resulting from a divorce, legal separation, annulment, or change in legal custody (including a qualified medical child support order defined in ERISA Section 609) that requires accident or health coverage for a Participant\u2019s child (including a foster child who is a dependent of the Participant):`));
  p.push(bullet("1. The Plan may change an election in order to provide coverage for the child if the order requires coverage under the Participant\u2019s plan; or"));
  p.push(bullet("2. The Participant shall be permitted to change an election in order to cancel coverage for the child if the order requires the former spouse to provide coverage for such child, under that individual\u2019s plan, and such coverage is actually provided."));

  p.push(body(`d. Notwithstanding subsection (a), Participants may change elections in order to cancel accident or health coverage for the Participant or the Participant\u2019s spouse or dependent if the Participant or the Participant\u2019s spouse or dependent is enrolled in the accident or health coverage of the Employer and becomes entitled to coverage (i.e., enrolled) under Part A or Part B of the Title XVIII of the Social Security Act (Medicare) or Title XIX of the Social Security Act (Medicaid), other than coverage consisting solely of benefits under section 1928 of the Social Security Act (the program for distribution of pediatric vaccines). If the Participant or the Participant\u2019s spouse or dependent who has been entitled to Medicaid or Medicare coverage loses such eligibility, that individual may prospectively elect coverage under the Plan if a benefit package option under the Plan provides similar coverage.`));

  p.push(body(`e. Notwithstanding subsection (a), Participants may make a prospective election change to add group health coverage for the Participant or the Participant\u2019s spouse or dependent if the Participant or the Participant\u2019s spouse or dependent loses coverage under any group health coverage sponsored by a governmental or educational institution, including (but not limited to) the following: a state children\u2019s health insurance program (CHIP) under Title XXI of the Social Security Act; a medical care program of an Indian Tribal government, the Indian Health Service, or a tribal organization; a state health benefits risk pool; or a foreign government group health plan, subject to the terms and limitations of the applicable benefit package option(s).`));

  if (data.elections.allowChangeBelow30Hours) {
    p.push(body(`f. Notwithstanding subsection (a), a Participant may prospectively revoke his or her election of group health plan coverage if (i) the Participant changes from full-time employment (i.e., at least 30 hours of service per week) to part-time employment (i.e., less than 30 hours of service per week), even if the Participant continues to be eligible for coverage under the group health plan, and (ii) the Participant, and any related individuals whose coverage is also to be revoked, intend to enroll in another plan that provides minimum essential coverage and is effective no later than the first day of the second month after the month during which the revocation is effective.`));
  }

  if (data.elections.allowChangeMarketplace) {
    p.push(body(`g. Notwithstanding subsection (a), a Participant may prospectively revoke his or her election of group health plan coverage if (i) the Participant is eligible for a Special Enrollment Period to enroll in a Qualified Health Plan through a Marketplace, or seeks to enroll in a Qualified Health Plan through a Marketplace during the Marketplace\u2019s annual open enrollment period, and (ii) the Participant, or any covered dependents intend to enroll in a Qualified Health Plan through a Marketplace that is effective no later than the day immediately following the effective date of the revocation.`));
  }

  p.push(body(`h. Notwithstanding subsection (a), if the cost of a Benefit provided under the Plan increases or decreases during a Plan Year, then the Plan shall automatically increase or decrease, as the case may be, the Salary Redirections of all affected Participants for such Benefit. Alternatively, if the cost of a benefit package option increases significantly, the Administrator shall permit the affected Participants to either make corresponding changes in their payments or revoke their elections and, in lieu thereof, receive on a prospective basis coverage under another benefit package option with similar coverage; or drop coverage prospectively if there is no other benefit package option available that provides similar coverage. This Plan treats coverage by another employer, such as a spouse\u2019s or dependent\u2019s employer, as similar coverage.`));

  p.push(body(`i. Notwithstanding subsection (a), if the cost of a Benefit package option provided under the plan decreases significantly during a Plan Year, the Administrator shall permit the affected Participants to make corresponding changes in their payments; and employees who are otherwise eligible under the Plan may elect the Benefit package option, subject to the terms and limitations of the Benefit package option.`));
  p.push(body(`If the coverage under a Benefit is significantly curtailed, and such curtailment results in a complete loss of coverage, affected Participants may revoke their elections of such Benefit and, in lieu thereof, elect to receive on a prospective basis coverage under another plan with similar coverage, or drop coverage prospectively if there is no other Benefit package option available that provides similar coverage.`));
  p.push(body(`If, during the period of coverage, a new Benefit package option or other coverage option is added (or an existing Benefit package option or other coverage option is eliminated) or a significantly improved existing Benefit package option is added, then the affected Participants and employees who are otherwise eligible under the Plan may elect the newly-added or significantly improved option (or elect another option if an option has been eliminated) prospectively and make corresponding election changes with respect to other Benefit package options providing similar coverage.`));

  p.push(body(`j. Notwithstanding subsection (a), a Participant may make a prospective election change to add group health coverage for the Participant, or the Participant\u2019s Spouse or Dependent, if such individual loses group health coverage under a governmental or educational institution, including a state children\u2019s health insurance program under the Social Security Act, the Indian Health Service or a health program offered by an Indian tribal government, a state health benefits risk pool, or a foreign government group health plan.`));

  // ========== ARTICLE VI - ADMINISTRATION ==========
  p.push(pageBreak());
  p.push(articleHeading("VI. Article - Administration"));
  p.push(horizontalRule());

  p.push(sectionTitle("01. Plan Administration"));
  p.push(body(`The Employer shall be the Administrator, unless the Employer elects otherwise. The Employer may appoint any person or persons, including, but not limited to, one or more Employees of the Employer, to perform the duties of the Administrator. Any person so appointed shall signify acceptance by filing written acceptance with the Employer. An Administrator may resign by delivering a written resignation to the Employer, to take effect at a date specified therein, or upon delivery to the Employer if no date is specified. The Administrator may be removed by the Employer by delivering a written notice of removal to the Administrator, to take effect at a date specified therein, or upon delivery to the Administrator if no date is specified. Upon the resignation or removal of any individual performing the duties of the Administrator, the Employer may designate a successor.`));
  p.push(body(`The operation of the Plan shall be under the supervision of the Administrator. It shall be a principal duty of the Administrator to see that the Plan is carried out in accordance with its terms, and for the exclusive benefit of Employees entitled to participate in the Plan. The Administrator shall have full power to administer the Plan in all of its details, subject, however, to the pertinent provisions of the Code. The Administrator\u2019s powers shall include, but shall not be limited to the following authority, in addition to all other powers provided by this Plan:`));
  p.push(bullet("a. To make and enforce such rules and regulations as the Administrator deems necessary or proper for the efficient administration of the Plan;"));
  p.push(bullet("b. To interpret the Plan, the Administrator\u2019s interpretations thereof in good faith to be final and conclusive on all persons claiming benefits by operation of the Plan;"));
  p.push(bullet("c. To decide all questions concerning the Plan and the eligibility of any person to participate in the Plan and to receive benefits provided under the Plan;"));
  p.push(bullet("d. To reject elections or to limit contributions or Benefits for certain Highly Compensated Participants if it deems such to be desirable in order to avoid discrimination under the Plan in violation of applicable provisions of the Code;"));
  p.push(bullet("e. To provide Employees with a reasonable notification of their benefits available under the Plan;"));
  p.push(bullet("f. To keep and maintain the Plan documents and all other records pertaining to and necessary for the administration of the Plan;"));
  p.push(bullet("g. To keep and communicate procedures to determine whether a medical child support order is qualified under ERISA Section 609; and"));
  p.push(bullet("h. To appoint such agents, counsel, accountants, consultants, and actuaries as may be required to assist in administering the Plan."));
  p.push(body(`Any procedure, discretionary act, interpretation or construction taken by the Administrator shall be done in a nondiscriminatory manner based upon uniform principles consistently applied and shall be consistent with the intent that the Plan shall continue to comply with the terms of Code Section 125 and the Treasury regulations thereunder.`));

  p.push(sectionTitle("02. Examination of Records"));
  p.push(body(`The Administrator shall make available to each Participant, Eligible Employee and any other Employee of the Employer such records as pertain to their respective interests under the Plan for examination at reasonable times during normal business hours.`));

  p.push(sectionTitle("03. Payment of Expenses"));
  p.push(body(`Any reasonable administrative expenses shall be paid by the Employer unless the Employer determines that administrative costs shall be borne by the Participants under the Plan or by any Trust Fund which may be established hereunder. The Administrator may impose reasonable conditions for payments, provided that such conditions shall not discriminate in favor of Highly Compensated Employees.`));

  p.push(sectionTitle("04. Application of Benefit Plan Surplus"));
  p.push(body(`Any forfeited amounts credited to the Benefit Plan surplus by virtue of the failure of a Participant to incur a qualified expense may, but need not be, separately accounted for after the close of the Plan Year in which such forfeitures arose. In no event shall such amounts be carried over to reimburse a Participant for expenses incurred during a subsequent Plan Year for the same or any other Benefit available under the Plan; nor shall amounts forfeited by a particular Participant be made available to such Participant in any other form or manner, except as permitted by Treasury regulations. Amounts in the Benefit Plan surplus shall first be used to defray any administrative costs and experience losses and thereafter be retained by the Employer.`));

  p.push(sectionTitle("05. Insurance Control Clause"));
  p.push(body(`In the event of a conflict between the terms of this Plan and the terms of an Insurance Contract of a particular Insurer or other benefit program that is self-insured whose product is then being used in conjunction with this Plan, the terms of the Insurance Contract shall control as to those Participants receiving coverage under such Insurance Contract. For this purpose, the Insurance Contract shall control in defining the persons eligible for insurance, the dates of their eligibility, the conditions which must be satisfied to become insured, if any, the Benefits Participants are entitled to and the circumstances under which insurance terminates.`));

  p.push(sectionTitle("06. Indemnification of Administrator"));
  p.push(body(`The Employer agrees to indemnify and to defend to the fullest extent permitted by law any Employee serving as the Administrator or as a member of a committee designated as Administrator (including any Employee or former Employee who previously served as Administrator or as a member of such committee) against all liabilities, damages, costs and expenses (including attorney\u2019s fees and amounts paid in settlement of any claims approved by the Employer) occasioned by any act or omission to act in connection with the Plan, if such act or omission is in good faith.`));

  // ========== ARTICLE VII - AMENDMENT OR TERMINATION ==========
  p.push(pageBreak());
  p.push(articleHeading("VII. Article - Amendment or Termination of Plan"));
  p.push(horizontalRule());

  p.push(sectionTitle("01. Amendment"));
  p.push(body(`The Employer, at any time or from time to time, may amend any or all of the provisions of the Plan without the consent of any Employee or Participant. No amendment shall have the effect of modifying any benefit election of any Participant in effect at the time of such amendment, unless such amendment is made to comply with federal, state or local laws, statutes or regulations.`));

  p.push(sectionTitle("02. Termination"));
  p.push(body(`The Employer is establishing this Plan with the intent that it will be maintained for an indefinite period of time. Notwithstanding the foregoing, the Employer reserves the right to terminate the Plan, in whole or in part, at any time. In the event the Plan is terminated, no further contributions shall be made. Benefits under any Insurance Contract shall be paid in accordance with the terms of the Contract.`));
  p.push(body(`Any amounts remaining in any such fund or account as of the end of the Plan Year in which Plan termination occurs shall be forfeited and deposited in the Benefit Plan surplus.`));

  // ========== ARTICLE VIII - MISCELLANEOUS ==========
  p.push(pageBreak());
  p.push(articleHeading("VIII. Article - Miscellaneous"));
  p.push(horizontalRule());

  p.push(sectionTitle("01. Plan Interpretation"));
  p.push(body(`All provisions of this Plan shall be governed and interpreted by the Employer, or its delegated Administrator, as applicable, in its full and complete discretion and shall be otherwise applied in a uniform, nondiscriminatory manner. This Plan shall be read in its entirety and not severed except as provided in the Section titled: \u201cSeverability\u201d.`));

  p.push(sectionTitle("02. Gender and Number"));
  p.push(body(`Wherever any words are used herein in the masculine, or feminine, or are gender neutral, they shall be construed as though they were also used in another gender in all cases where they would so apply, and whenever any words are used herein in the singular or plural form, they shall be construed as though they were also used in the other form in all cases where they would so apply.`));

  p.push(sectionTitle("03. Written Document"));
  p.push(body(`This Plan document, in conjunction with any separate written document which may be required by law, is intended to satisfy the written Plan requirement of Code Section 125 and any Regulations thereunder relating to Cafeteria Plans.`));

  p.push(sectionTitle("04. Exclusive Benefit"));
  p.push(body(`This Plan shall be maintained for the exclusive benefit of the Employees who participate in the Plan.`));

  p.push(sectionTitle("05. Participant\u2019s Rights"));
  p.push(body(`This Plan shall not be deemed to constitute an employment contract between the Employer and any Participant or to be a consideration or an inducement for the employment of any Participant or Employee. Nothing contained in this Plan shall be deemed (i) to give any Participant, or (ii) Employee the right to be retained in the service of the Employer or to interfere with the right of the Employer to discharge any Participant or Employee at any time regardless of the effect which such discharge shall have upon him as a Participant of this Plan.`));

  p.push(sectionTitle("06. Action by the Employer"));
  p.push(body(`Whenever under the terms of the Plan the Employer is permitted or required to do or perform any act or matter or thing, it shall be done and performed by a person duly authorized by the Employer to do so.`));

  p.push(sectionTitle("07. Employer\u2019s Protective Clauses"));
  p.push(body(`a. Upon the failure of the Employer to obtain the insurance contemplated by this Plan (whether as a result of negligence, gross neglect or otherwise), a Participant\u2019s Benefits shall be limited to the insurance premium(s), if any, that remained unpaid for the period in question and the actual insurance proceeds, if any, received by the Employer or the Participant as a result of the Participant\u2019s claim.`));
  p.push(body(`b. The Employer\u2019s liability to a Participant shall only extend to and shall be limited to any payment actually received by the Employer from the Insurer. In the event that the full insurance Benefit contemplated is not promptly received by the Employer within a reasonable time after submission of a claim, then the Employer shall notify the Participant of such facts and the Employer shall no longer have any legal obligation whatsoever (except to execute any document called for by a settlement reached by the Participant). The Participant shall be free to settle, compromise or refuse the claim as the Participant, in his or her sole discretion, shall see fit.`));
  p.push(body(`c. The Employer shall not be responsible for the validity of any Insurance Contract issued hereunder or for the failure on the part of the Insurer to make payments provided for under any Insurance Contract. Once insurance is applied for or obtained, the Employer shall not be liable for any loss which may result from the failure to pay Premiums to the extent Premium notices are not received by the Employer.`));

  p.push(sectionTitle("08. No Guarantee of Tax Consequences"));
  p.push(body(`Neither the Administrator nor the Employer makes any commitment or guarantee that any amounts paid to or for the benefit of a Participant under the Plan will be excludable from the Participant\u2019s gross income for federal or state income tax purposes, or that any other federal or state tax treatment will apply to or be available to any Participant. Notwithstanding the foregoing, the rights of Participants under this Plan shall be legally enforceable.`));

  p.push(sectionTitle("09. Indemnification of Employer by Participants"));
  p.push(body(`If any Participant receives one or more payments or reimbursements under the Plan that are not for a permitted Benefit, such Participant shall indemnify and reimburse the Employer for any liability it may incur for failure to withhold federal or state income tax or Social Security tax from such payments or reimbursements. However, such indemnification and reimbursement shall not exceed the amount of additional federal and state income tax that the Participant would have owed if the payments or reimbursements had been made to the Participant as regular cash compensation, plus the Participant\u2019s share of any Social Security tax that would have been paid on such compensation, less any such additional income and Social Security tax actually paid by the Participant.`));

  p.push(sectionTitle("10. Funding"));
  p.push(body(`Unless otherwise required by law, contributions to the Plan need not be placed in trust or dedicated to a specific Benefit, but shall instead be considered general assets of the Employer until the Premium Expense required under the Plan has been paid. Furthermore, and unless otherwise required by law, nothing herein shall be construed to require the Employer or the Administrator to maintain any fund or segregate any amount for the benefit of any Participant, and no Participant or other person shall have any claim against, right to, or security or other interest in, any fund, account or asset of the Employer from which any payment under the Plan may be made.`));

  p.push(sectionTitle("11. Governing Law"));
  p.push(body(`This Plan is governed by the Code and the Treasury regulations issued thereunder (as they might be amended from time to time). In no event does the Employer guarantee the favorable tax treatment sought by this Plan. To the extent not preempted by federal law, the provisions of this Plan shall be construed, enforced and administered according to the laws of the state of ${govLaw}.`));

  p.push(sectionTitle("12. Severability"));
  p.push(body(`If any provision of the Plan is held invalid or unenforceable, its invalidity or unenforceability shall not affect any other provisions of the Plan, and the Plan shall be construed and enforced as if such provision had not been included herein.`));

  p.push(sectionTitle("13. Captions"));
  p.push(body(`The captions contained herein are inserted only as a matter of convenience and for reference, and in no way define, limit, enlarge, or describe the scope or intent of the Plan, nor in any way shall they affect the Plan or the construction of any provision thereof.`));

  p.push(sectionTitle("14. Continuation of Coverage"));
  p.push(body(`Notwithstanding anything in the Plan to the contrary, in the event any benefit under this Plan subject to the continuation coverage requirement of Code Section 4980B becomes unavailable, each Participant will be entitled to continuation coverage as prescribed in Code Section 4980B.`));

  p.push(sectionTitle("15. Health Insurance Portability and Accountability Act"));
  p.push(body(`Notwithstanding anything in this Plan to the contrary, this Plan shall be operated in accordance with HIPAA and regulations thereunder.`));

  p.push(sectionTitle("16. Uniformed Services Employment and Reemployment Rights Act"));
  p.push(body(`Notwithstanding any provision of this Plan to the contrary, contributions, benefits and service credit with respect to qualified military service shall be provided in accordance with USERRA and the regulations thereunder, as well as any other applicable Regulations specific to the rights and obligations of Employers with Employees on active military leave.`));

  p.push(sectionTitle("17. Genetic Information Nondiscrimination Act"));
  p.push(body(`Notwithstanding any provision of this Plan to the contrary, this Plan shall be operated in accordance with GINA and regulations thereunder.`));

  if (data.elections.includeFmlaLanguage) {
    p.push(sectionTitle("18. Family and Medical Leave Act"));
    p.push(body(`A Participant who takes an unpaid leave of absence under FMLA may revoke his or her Participation Agreement at the beginning of or during the leave. Such a revocation is binding on the Participant for the balance of the Plan Year and may not be changed until the next Period of Coverage, except for a revoked election under a group health plan which the Participant shall have the right to reinstate at the end of the FMLA leave period.`));
    p.push(body(`If a Participant chooses to continue coverage under the Employer\u2019s group health plan during an unpaid leave of absence under FMLA, the Plan Administrator shall select among the following options for required payments during the leave of absence:`));
    p.push(bullet("(a) Pre-payment by the Participant before the commencement of the leave through pre-tax or after-tax payments under a Participation Agreement, from any taxable compensation, including cashing out of unused sick or vacation days, provided all other Plan requirements are met; provided, however, that pre-payment shall not be the sole option offered to a Participant on FMLA leave;"));
    p.push(bullet("(b) Payment by the Participant of required payments during the leave on the same schedule as payments would be made if the Participant were not on leave, or under another schedule permitted under Department of Labor regulations. The Employer shall not be required to continue group health plan coverage of a Participant who fails to make required payments while on FMLA leave; or"));
    p.push(bullet("(c) Advancement by the Employer of the Participant\u2019s required payments while the Participant is on FMLA leave. The Employer shall be entitled to recover such advanced amounts when the Participant returns from FMLA leave by payroll deduction."));
  }

  // ========== ADOPTION AGREEMENT ==========
  p.push(pageBreak());
  p.push(articleHeading("Adoption Agreement"));
  p.push(horizontalRule());
  p.push(emptyLine());
  p.push(bodyBold(`For ${name}`));
  p.push(body("Section 125 Premium Only Plan"));
  p.push(emptyLine());
  p.push(body(`The undersigned Employer adopted the Premium Only Plan for those Employees who shall qualify as Participants thereunder. It shall be effective as of the date specified below. The Employer hereby selects the following Plan specifications:`));
  p.push(emptyLine());
  p.push(bodyBold(`1. Name of Employer: ${name}`));
  p.push(bodyBold(`2. Effective Date: This adopted Premium Only Plan shall be effective as of ${effective}`));
  p.push(bodyBold(`3. Plan Year: Your Plan\u2019s records are maintained on the basis of a twelve-month period. This is known as the Plan Year. The adopted plan year begins on ${pyStart} and ends on ${pyEnd}.`));
  p.push(bodyBold(`4. Employer\u2019s Principal Office:`));
  p.push(body(addr1, { indent: true }));
  p.push(body(addr2, { indent: true }));
  p.push(bodyBold(`5. Benefits: All the benefits listed below are included in this plan:`));
  p.push(body("Health Plan. Premiums that are payroll deducted on a pre-tax basis may include the following:", { indent: true }));
  benefits.forEach((b) => p.push(bullet(b)));
  p.push(emptyLine());
  p.push(...signatureBlock(name));

  // ========== CERTIFICATE OF RESOLUTION ==========
  p.push(pageBreak());
  p.push(articleHeading("CERTIFICATE OF RESOLUTION"));
  p.push(horizontalRule());
  p.push(emptyLine());
  p.push(body(`The undersigned authorized representative of ${name} (the Employer) hereby certifies that the following resolutions were duly adopted by the governing body of the Employer on ____________________, and that such resolutions have not been modified or rescinded as of the date hereof:`));
  p.push(emptyLine());
  p.push(body(`RESOLVED, that the form of Welfare Benefit Plan, effective ${effective}, presented to this meeting (and a copy of which is attached hereto) is hereby approved and adopted, and that the proper agents of the Employer are hereby authorized and directed to execute and deliver to the Administrator of said Plan one or more counterparts of the Plan.`));
  p.push(emptyLine());
  p.push(body(`RESOLVED, that the Administrator shall be instructed to take such actions that the Administrator deems necessary and proper in order to implement the Plan, and to set up adequate accounting and administrative procedures for the provision of benefits under the Plan.`));
  p.push(emptyLine());
  p.push(body(`RESOLVED, that the proper agents of the Employer shall act as soon as possible to notify the employees of the Employer of the adoption of the Plan and to deliver to each employee a copy of the Summary Plan Description of the Plan, which Summary Plan Description is attached hereto and is hereby approved.`));
  p.push(emptyLine());
  p.push(body(`The undersigned further certifies that attached hereto as Exhibits, are true copies of ${name}\u2019s Benefit Plan Document and Summary Plan Description approved and adopted at this meeting.`));
  p.push(emptyLine());
  p.push(bodyBold(`Company: ${name}`));
  p.push(...signatureBlock(name));

  return p;
}
