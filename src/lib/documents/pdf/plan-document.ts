import type { FormData } from "@/types";
import type { PDFSection } from "./pdf-builder";
import {
  coverPage, articleHeading, sectionTitle, definitionItem,
  bodyText, bulletItem, signatureBlock, emptyLine,
} from "./pdf-builder";
import { formatDate, formatMonthDay, stateName, entityLabel, benefitsList } from "../helpers";

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
      definitionItem(ctx, "10", "Employer", `means the ${entity} or any such entity specified in Item 1 of the Adoption Agreement, and any Affiliated Employer (as defined in the Article titled: \u201cDefinitions\u201d), that adopts this Plan; and any successor, that maintain this Plan; and any predecessor that has maintained this Plan.`);
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
      bodyText(ctx, "All other defined terms in this Plan shall have the meanings specified in the various Articles of the Plan in which they appear.");
    }},

    // Article II - Participation
    { build: (ctx) => {
      articleHeading(ctx, "II. Article - Participation");
      sectionTitle(ctx, "01. Eligibility");
      bodyText(ctx, "As to each Benefit provided hereunder, any Eligible Employee shall be eligible to participate as of the date he or she satisfies the eligibility conditions set forth in the policy or plan providing such Benefit (the \u201cEligibility Requirements\u201d), the provisions of which are specifically incorporated herein by reference.");
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
      bodyText(ctx, "When an Employee ceases to be a Participant, the cafeteria plan must pay the Employee any amount the Employee previously paid for coverage or Benefits to the extent the previously paid amount relates to the period from the date the Employee ceases to be a Participant through the end of that Plan Year.");
    }},

    // Article III - Contributions
    { build: (ctx) => {
      articleHeading(ctx, "III. Article - Contributions to the Plan");
      sectionTitle(ctx, "01. Salary Redirection");
      bodyText(ctx, "Benefits under the Plan shall be financed by Salary Redirections sufficient to support Benefits that a Participant has elected hereunder and to pay the Participant\u2019s Premium Expenses. The salary administration program of the Employer shall allow each Participant to agree to reduce his or her pay during a Plan Year by an amount determined necessary to purchase the elected Benefit and to pay the Participant\u2019s Premium Expenses. The amount of such Salary Redirection shall be specified by the Plan Sponsor and shall be applicable for a Plan Year. Notwithstanding the above, for new Participants, the Salary Redirections shall only be applicable from the first day of the pay period following the Employee\u2019s entry date up to and including the last day of the Plan Year.");
      bodyText(ctx, "Any Salary Redirection shall be determined prior to the beginning of a Plan Year (subject to initial elections pursuant to the Section titled: \u201cInitial Elections\u201d) and prior to the end of the Election Period and shall be irrevocable for such Plan Year. However, a Participant may revoke a Benefit election after the Plan Year has commenced and make a new Election to Participate with respect to the remainder of the Plan Year, if both the revocation and the new election are on account of and consistent with a change in status. Salary Redirection amounts shall be contributed on a pro rata basis for each pay period during the Plan Year. All individual Election forms are deemed to be part of this Plan and incorporated herein by reference.");
      sectionTitle(ctx, "02. Application of Contributions");
      bodyText(ctx, "As soon as reasonably practical after each payroll period, the Employer shall apply the Salary Redirections to provide the Benefits elected by the affected Participants. Amounts designated for the Participant\u2019s Premium Expense Reimbursement Account shall likewise be credited to such account for the purpose of paying Premium Expenses.");
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
      bodyText(ctx, "(b) If the Administrator deems it necessary, in order, to avoid discrimination or possible taxation to Highly Compensated Employees, Key Employees or a group of employees in whose favor discrimination is prohibited by Code Section 125, it may, but shall not be required to, reduce contributions or non-taxable Benefits in order to assure compliance with this section. Any act taken by the Administrator under this section shall be carried out in a uniform and nondiscriminatory manner. Contributions which are not utilized to provide Benefits to any Participant by virtue of any administrative act under this paragraph shall be forfeited and deposited into the Plan surplus.");
      sectionTitle(ctx, "04. Non-Tax Dependent Coverage");
      bodyText(ctx, "If (i) Employee Salary Redirections are made to fund Benefits under the Plan, and (ii) the Employer allows a Participant to elect to cover a Non-Tax Dependent through the Participant\u2019s coverage under group Medical, Dental or Vision benefit(s), a Participant who elects to participate in the Salary Redirection program may pay on a pre-tax basis through salary reduction contributions the Participant\u2019s portion of the premium cost of coverage, provided that the full fair market value of such coverage for any such Non-Tax Dependent shall be includible in the Participant\u2019s gross income as a taxable benefit in accordance with applicable federal income tax rules.");
    }},

    // Article V - Participant Elections
    { build: (ctx) => {
      articleHeading(ctx, "V. Article - Participant Elections");
      sectionTitle(ctx, "01. Initial Elections");
      bodyText(ctx, "An Employee who meets the Eligibility Requirements of the Plan on the first day of, or during, a Plan Year may elect to participate in this Plan for all or the remainder of such Plan Year, provided he or she elects to do so before his or her effective date of participation, or for a newly eligible Employee, no more than 30 days after their date of hire. For any such newly Eligible Employee, if coverage is effective as of the date of hire, such Employee shall be eligible to participate retroactively as of their date of hire. Any failure to elect the Benefits set forth herein shall constitute an Employee\u2019s election to not participate in the Plan during that Plan Year until a valid election is otherwise made.");
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
      bodyText(ctx, "a. Any Participant may change a Benefit election after the Plan Year has commenced and make new elections with respect to the remainder of such Plan Year if, under the facts and circumstances, the changes are necessitated by and are consistent with a change in status that is recognized under rules and regulations adopted by the Department of the Treasury. A change in status shall only include the following events:");
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
      sectionTitle(ctx, "04. Application of Benefit Plan Surplus");
      bodyText(ctx, "Any forfeited amounts credited to the Benefit Plan surplus shall first be used to defray any administrative costs and experience losses and thereafter be retained by the Employer. In no event shall such amounts be carried over to reimburse a Participant for expenses incurred during a subsequent Plan Year.");
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
      bodyText(ctx, "The Employer is establishing this Plan with the intent that it will be maintained for an indefinite period of time. Notwithstanding the foregoing, the Employer reserves the right to terminate the Plan, in whole or in part, at any time. In the event the Plan is terminated, no further contributions shall be made. Benefits under any Insurance Contract shall be paid in accordance with the terms of the Contract. Any amounts remaining as of the end of the Plan Year in which Plan termination occurs shall be forfeited and deposited in the Benefit Plan surplus.");
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
      bodyText(ctx, "Notwithstanding anything in the Plan to the contrary, in the event any benefit under this Plan subject to the continuation coverage requirement of Code Section 4980B becomes unavailable, each Participant will be entitled to continuation coverage as prescribed in Code Section 4980B.");
      sectionTitle(ctx, "15. Health Insurance Portability and Accountability Act");
      bodyText(ctx, "Notwithstanding anything in this Plan to the contrary, this Plan shall be operated in accordance with HIPAA and regulations thereunder.");
      sectionTitle(ctx, "16. Uniformed Services Employment and Reemployment Rights Act");
      bodyText(ctx, "Notwithstanding any provision of this Plan to the contrary, contributions, benefits and service credit with respect to qualified military service shall be provided in accordance with USERRA and the regulations thereunder.");
      sectionTitle(ctx, "17. Genetic Information Nondiscrimination Act");
      bodyText(ctx, "Notwithstanding any provision of this Plan to the contrary, this Plan shall be operated in accordance with GINA and regulations thereunder.");
      if (data.elections.includeFmlaLanguage) {
        sectionTitle(ctx, "18. Family and Medical Leave Act");
        bodyText(ctx, "A Participant who takes an unpaid leave of absence under FMLA may revoke his or her election at the beginning of or during the leave. Such a revocation is binding for the balance of the Plan Year. If a Participant chooses to continue coverage during FMLA leave, the Plan Administrator shall select among: (a) Pre-payment before the leave; (b) Payment during the leave on the same schedule; or (c) Advancement by the Employer of required payments.");
      }
    }},

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
      bodyText(ctx, `RESOLVED, that the form of Welfare Benefit Plan, effective ${effective}, presented to this meeting (and a copy of which is attached hereto) is hereby approved and adopted, and that the proper agents of the Employer are hereby authorized and directed to execute and deliver to the Administrator of said Plan one or more counterparts of the Plan.`);
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
