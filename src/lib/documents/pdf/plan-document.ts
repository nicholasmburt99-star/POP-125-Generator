import type { FormData } from "@/types";
import type { PDFSection } from "./pdf-builder";
import {
  coverPage, articleHeading, sectionTitle, definitionItem,
  bodyText, bulletItem, checkboxItem, signatureBlock, emptyLine,
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

    // Introduction + Article I Definitions
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
      definitionItem(ctx, "07", "Election Period", "means the period immediately preceding the beginning of each Plan Year established by the Administrator for the election of Benefits and Salary Redirections, such period to be applied on a uniform and nondiscriminatory basis for all Employees and Participants.");
      definitionItem(ctx, "08", "Eligible Employee", "means any Employee who has satisfied the provisions of the Section titled: \u201cEligibility.\u201d However, 2% shareholders as defined under Code Section 1372(b) and self-employed individuals as defined under Code Section 401(c) shall not be eligible to participate in this Plan. An individual shall not be an \u201cEligible Employee\u201d if such individual is not reported on the payroll records of the Employer as a common law employee.");
      definitionItem(ctx, "09", "Employee", "means any person who is employed by the Employer, but generally excludes any person who is employed as an independent contractor and any person who is considered self-employed under Code Section 401(c), as well as any person who is a greater than two percent (2%) shareholder in a Subchapter S corporation, a partner in a partnership or an owner or member of a limited liability company that elects partnership status on its tax return.");
      definitionItem(ctx, "10", "Employer", `means the ${entity} or any such entity specified in Item 1 of the Adoption Agreement, and any Affiliated Employer that adopts this Plan; and any successor, that maintain this Plan; and any predecessor that has maintained this Plan.`);
      definitionItem(ctx, "11", "Highly Compensated Employee", "means, for the purposes of determining discrimination, an Employee so described in Code Section 125 and the Treasury Regulations thereunder.");
      definitionItem(ctx, "12", "Insurance Contract", "means any contract issued by an Insurer underwriting a Benefit, or any self-funded arrangement providing any Benefit offered for health and welfare coverage to Eligible Employees of the Employer.");
      definitionItem(ctx, "13", "Insurance Premium Payment Plan", "means the plan of benefits contained in the Section titled: \u201cBenefit Options\u201d of this Plan, that provides for the payment of Premium Expenses.");
      definitionItem(ctx, "14", "Insurer", "means any insurance company that underwrites a Benefit or any self-funded arrangement under this Plan.");
      definitionItem(ctx, "15", "Key Employee", "means an employee defined in Code Section 416(i)(1) and the Treasury regulations thereunder.");
      definitionItem(ctx, "16", "Participant", "means any Eligible Employee who elects to become a Participant pursuant to the Section titled: \u201cApplication to Participate\u201d and has not for any reason become ineligible to participate further in the Plan.");
      definitionItem(ctx, "17", "Plan", "means the Section 125 Premium Only Plan described in this instrument, including all amendments thereto.");
      definitionItem(ctx, "18", "Plan Year", "means the 12-month period beginning and ending on the dates specified in the Adoption Agreement. The Plan Year shall be the coverage period for the Benefits provided for under this Plan.");
      definitionItem(ctx, "19", "Premium Expenses", "or \u201cPremiums\u201d mean the Participant\u2019s cost for the insured Benefits described in the Section titled: \u201cBenefit Options.\u201d");
      definitionItem(ctx, "20", "Regulations", "means either temporary, proposed or final regulations, as applicable, issued from the Department of Treasury, as well as any guidance or interpretations issued in connection therewith.");
      definitionItem(ctx, "21", "Salary Redirection", "means the contributions made by the Employer on behalf of Participants in accordance with the Section titled: \u201cSalary Redirection.\u201d These contributions shall be allocated to the funds or accounts established for cost of applicable Benefits provided under the Plan pursuant to the Participants\u2019 elections made under the Article titled: \u201cParticipant Elections.\u201d");
      definitionItem(ctx, "22", "Spouse", "means \u201cspouse\u201d as defined in an Insurance Contract, then, for purposes of coverage under that Insurance Contract only, \u201cspouse\u201d shall have the meaning stated in the Insurance Contract. In all other cases, \u201cspouse\u201d shall have the meaning stated under applicable federal or state law.");
      definitionItem(ctx, "23", "Uniformed Services", "means the Armed Forces, the Army National Guard, and the Air National Guard when engaged in active duty for training, inactive duty training, or full-time National Guard duty, the commissioned corps of the Public Health Service, and any other category of persons designated by the President of the United States in time of war or emergency.");
    }},

    // Article II - Participation
    { build: (ctx) => {
      articleHeading(ctx, "II. Article - Participation");
      sectionTitle(ctx, "01. Eligibility");
      bodyText(ctx, "As to each Benefit provided hereunder, any Eligible Employee shall be eligible to participate as of the date he or she satisfies the eligibility conditions set forth in the policy or plan providing such Benefit (the \u201cEligibility Requirements\u201d), the provisions of which are specifically incorporated herein by reference.");
      sectionTitle(ctx, "02. Effective Date of Participation");
      bodyText(ctx, "(a) An Eligible Employee shall become a Participant effective as of the later of the date on which he or she satisfies the Eligibility Requirements of the Plan or the Effective Date of this Plan.");
      bodyText(ctx, "(b) If an Eligible Employee terminates employment after commencing participation in the Plan, and such terminated Eligible Employee is rehired within 30 days or less of the date of termination of employment, such rehired Eligible Employee shall not be considered a newly eligible employee and will be reinstated with the same election(s) such individual had before termination. If a terminated Eligible Employee is rehired more than 30 days following termination of employment and is otherwise eligible to participate in the Plan, the individual shall be treated as a newly Eligible Employee.");
      sectionTitle(ctx, "03. Application to Participate");
      bodyText(ctx, "An Employee who is eligible to participate in this Plan may, during the applicable Election Period, complete an Election to Participate form that the Administrator shall furnish to the Employee. The Election to Participate form is an irrevocable election made by the Employee to redirect and reduce taxable compensation to cover the Employee\u2019s applicable cost of Benefits elected, which shall be applicable until the end of the current Plan Year, unless the Participant is entitled to change his or her Benefit elections pursuant to the Section titled: \u201cChange of Elections.\u201d");
      sectionTitle(ctx, "04. Termination of Participation");
      bodyText(ctx, "A Participant shall no longer participate in this Plan upon the occurrence of any of the following events: (a) His or her termination of employment; (b) His or her death; or (c) The termination of this Plan.");
      sectionTitle(ctx, "05. Termination of Employment");
      bodyText(ctx, "If a Participant terminates employment with the Employer for any reason other than death, his or her participation in the Plan shall cease, subject to the Participant\u2019s right to continue coverage under any Insurance Contract for which premiums have already been paid.");
      bodyText(ctx, "When an Employee ceases to be a Participant, the cafeteria plan must pay the Employee any amount the Employee previously paid for coverage or Benefits to the extent the previously paid amount relates to the period from the date the Employee ceases to be a Participant through the end of that Plan Year.");
    }},

    // Article III - Contributions
    { build: (ctx) => {
      articleHeading(ctx, "III. Article - Contributions to the Plan");
      sectionTitle(ctx, "01. Salary Redirection");
      bodyText(ctx, "Benefits under the Plan shall be financed by Salary Redirections sufficient to support Benefits that a Participant has elected hereunder and to pay the Participant\u2019s Premium Expenses. The salary administration program of the Employer shall allow each Participant to agree to reduce his or her pay during a Plan Year by an amount determined necessary to purchase the elected Benefit and to pay the Participant\u2019s Premium Expenses. Salary Redirection amounts shall be contributed on a pro rata basis for each pay period during the Plan Year. All individual Election forms are deemed to be part of this Plan and incorporated herein by reference.");
      bodyText(ctx, "Any Salary Redirection shall be determined prior to the beginning of a Plan Year and prior to the end of the Election Period and shall be irrevocable for such Plan Year. However, a Participant may revoke a Benefit election after the Plan Year has commenced and make a new Election to Participate with respect to the remainder of the Plan Year, if both the revocation and the new election are on account of and consistent with a change in status.");
      sectionTitle(ctx, "02. Application of Contributions");
      bodyText(ctx, "As soon as reasonably practical after each payroll period, the Employer shall apply the Salary Redirections to provide the Benefits elected by the affected Participants.");
      sectionTitle(ctx, "03. Periodic Contributions");
      bodyText(ctx, "The Employer and Administrator may implement a procedure in which Salary Redirections are contributed throughout the Plan Year on a periodic basis that is not pro rata for each payroll period. In the event Salary Redirections are not made on a pro rata basis, upon termination of participation, a Participant may be entitled to a refund.");
    }},

    // Article IV - Benefits
    { build: (ctx) => {
      articleHeading(ctx, "IV. Article - Benefits");
      sectionTitle(ctx, "01. Benefit Options");
      bodyText(ctx, "Each Participant may elect to have his or her full compensation paid in taxable compensation or elect to have the amount of his or her Salary Redirection amounts applied to any one or more of the optional Benefits or any other group-insured or self-funded Benefit permitted under Code Section 125, that is offered by the Employer as set forth in the Adoption Agreement.");
      sectionTitle(ctx, "02. Description of Benefits");
      bodyText(ctx, "Each Eligible Employee may elect to have the Administrator pay those contributions that the Employee is required to make to the Benefit options described under the Section titled: \u201cBenefit Options,\u201d as a condition for the Employee and his or her Dependents to participate in those Benefit options.");
      sectionTitle(ctx, "03. Nondiscrimination Requirements");
      bodyText(ctx, "(a) It is the intent of this Plan to provide benefits to a classification of Employees that the Secretary of the Treasury finds not to be discriminatory in favor of the group in whose favor discrimination is prohibited under Code Section 125 or applicable Regulations thereunder.");
      bodyText(ctx, "(b) If the Administrator deems it necessary to avoid discrimination or possible taxation to Highly Compensated Employees, Key Employees or a group of employees in whose favor discrimination is prohibited by Code Section 125, it may reduce contributions or non-taxable Benefits in order to assure compliance. The reduction shall be made proportionately among all insured Benefits. Forfeited contributions shall be deposited into the Plan surplus.");
      sectionTitle(ctx, "04. Non-Tax Dependent Coverage");
      bodyText(ctx, "If the Employer allows a Participant to elect to cover a Non-Tax Dependent through group Medical, Dental or Vision benefit(s), the full fair market value of such coverage for any Non-Tax Dependent shall be includible in the Participant\u2019s gross income as a taxable benefit in accordance with applicable federal income tax rules.");
    }},

    // Article V - Participant Elections
    { build: (ctx) => {
      articleHeading(ctx, "V. Article - Participant Elections");
      sectionTitle(ctx, "01. Initial Elections");
      bodyText(ctx, "An Employee who meets the Eligibility Requirements of the Plan on the first day of, or during, a Plan Year may elect to participate in this Plan for all or the remainder of such Plan Year, provided he or she elects to do so before his or her effective date of participation, or for a newly eligible Employee, no more than 30 days after their date of hire. For any such newly Eligible Employee, if coverage is effective as of the date of hire, such Employee shall be eligible to participate retroactively as of their date of hire.");
      sectionTitle(ctx, "02. Subsequent Annual Elections");
      bodyText(ctx, data.elections.employeeElections === "first_year_only"
        ? "A Participant will automatically be enrolled in subsequent plan years unless the Participant terminates his or her participation in the Plan by notifying the Administrator in writing during the Election Period."
        : data.elections.employeeElections === "every_year"
        ? "Each Participant must complete a new Election to Participate form during each Election Period in order to continue participation."
        : "Participation in the Plan is automatic for all Eligible Employees. No election form is required.");
      sectionTitle(ctx, "03. Change of Elections");
      bodyText(ctx, "a. Any Participant may change a Benefit election after the Plan Year has commenced and make new elections with respect to the remainder of such Plan Year if the changes are necessitated by and consistent with a change in status recognized under rules and regulations adopted by the Department of the Treasury. A change in status shall include:");
      bulletItem(ctx, "1. Legal Marital Status: marriage, divorce, death of a spouse, legal separation or annulment;");
      bulletItem(ctx, "2. Number of Dependents: birth, adoption, placement for adoption, or death of a dependent;");
      bulletItem(ctx, "3. Employment Status: termination or commencement of employment, a strike or lockout, commencement of or return from an unpaid leave of absence, or a change in worksite;");
      bulletItem(ctx, "4. Dependent satisfies or ceases to satisfy eligibility requirements due to attainment of age, student status, or any similar circumstance;");
      bulletItem(ctx, "5. Residency: a change in the place of residence of the Participant, spouse or dependent.");
      bodyText(ctx, "b. Affected Participants may change an election for accident or health coverage during a Plan Year in accordance with HIPAA special enrollment rights under Code Section 9801(f), including those authorized under CHIP. Such change shall take place on a prospective basis, unless required by Code Section 9801(f) to be retroactive.");
      bodyText(ctx, "c. In the event of a judgment, decree, or order resulting from a divorce, legal separation, annulment, or change in legal custody that requires accident or health coverage for a Participant\u2019s child, the Plan may change an election to provide or cancel coverage as required by the order.");
      bodyText(ctx, "d. Participants may change elections to cancel coverage if they become entitled to Medicare or Medicaid, or to add coverage if they lose such eligibility.");
      bodyText(ctx, "e. Participants may add group health coverage if they lose coverage under a governmental or educational institution.");
      if (data.elections.allowChangeBelow30Hours) {
        bodyText(ctx, "f. A Participant may prospectively revoke group health plan coverage if the Participant changes from full-time employment (at least 30 hours per week) to part-time employment (less than 30 hours per week), provided the Participant intends to enroll in another plan that provides minimum essential coverage.");
      }
      if (data.elections.allowChangeMarketplace) {
        bodyText(ctx, "g. A Participant may prospectively revoke group health plan coverage if eligible for a Special Enrollment Period to enroll in a Qualified Health Plan through a Marketplace, or during the Marketplace\u2019s annual open enrollment period.");
      }
      bodyText(ctx, "h. If the cost of a Benefit increases or decreases during a Plan Year, the Plan shall automatically adjust Salary Redirections. If the cost increases significantly, Participants may make corresponding changes, elect similar coverage, or drop coverage.");
      bodyText(ctx, "i. If coverage under a Benefit is significantly curtailed resulting in a complete loss of coverage, affected Participants may revoke elections and elect coverage under another plan with similar coverage. If a new Benefit package option is added or significantly improved, Participants may elect the new option prospectively.");
      bodyText(ctx, "j. A Participant may add group health coverage if such individual loses group health coverage under a governmental or educational institution.");
    }},

    // Article VI - Administration
    { build: (ctx) => {
      articleHeading(ctx, "VI. Article - Administration");
      sectionTitle(ctx, "01. Plan Administration");
      bodyText(ctx, "The Employer shall be the Administrator, unless the Employer elects otherwise. The Administrator shall have full power to administer the Plan in all of its details, subject to the pertinent provisions of the Code. The Administrator\u2019s powers shall include:");
      bulletItem(ctx, "a. To make and enforce rules and regulations for efficient administration;");
      bulletItem(ctx, "b. To interpret the Plan, with interpretations in good faith being final and conclusive;");
      bulletItem(ctx, "c. To decide all questions concerning eligibility and benefits;");
      bulletItem(ctx, "d. To reject elections or limit contributions to avoid discrimination;");
      bulletItem(ctx, "e. To provide employees with reasonable notification of benefits;");
      bulletItem(ctx, "f. To keep and maintain Plan documents and records;");
      bulletItem(ctx, "g. To keep procedures for determining qualified medical child support orders; and");
      bulletItem(ctx, "h. To appoint agents, counsel, accountants, consultants, and actuaries.");
      sectionTitle(ctx, "02. Examination of Records");
      bodyText(ctx, "The Administrator shall make available to each Participant and Eligible Employee such records as pertain to their respective interests under the Plan for examination at reasonable times during normal business hours.");
      sectionTitle(ctx, "03. Payment of Expenses");
      bodyText(ctx, "Any reasonable administrative expenses shall be paid by the Employer unless the Employer determines that administrative costs shall be borne by the Participants under the Plan.");
      sectionTitle(ctx, "04. Application of Benefit Plan Surplus");
      bodyText(ctx, "Any forfeited amounts credited to the Benefit Plan surplus shall first be used to defray any administrative costs and experience losses and thereafter be retained by the Employer.");
      sectionTitle(ctx, "05. Insurance Control Clause");
      bodyText(ctx, "In the event of a conflict between the terms of this Plan and the terms of an Insurance Contract, the terms of the Insurance Contract shall control as to those Participants receiving coverage under such Insurance Contract.");
      sectionTitle(ctx, "06. Indemnification of Administrator");
      bodyText(ctx, "The Employer agrees to indemnify and to defend to the fullest extent permitted by law any Employee serving as the Administrator against all liabilities, damages, costs and expenses occasioned by any act or omission to act in connection with the Plan, if such act or omission is in good faith.");
    }},

    // Article VII + VIII
    { build: (ctx) => {
      articleHeading(ctx, "VII. Article - Amendment or Termination of Plan");
      sectionTitle(ctx, "01. Amendment");
      bodyText(ctx, "The Employer, at any time or from time to time, may amend any or all of the provisions of the Plan without the consent of any Employee or Participant. No amendment shall have the effect of modifying any benefit election of any Participant in effect at the time of such amendment, unless such amendment is made to comply with federal, state or local laws, statutes or regulations.");
      sectionTitle(ctx, "02. Termination");
      bodyText(ctx, "The Employer is establishing this Plan with the intent that it will be maintained for an indefinite period of time. Notwithstanding the foregoing, the Employer reserves the right to terminate the Plan, in whole or in part, at any time. In the event the Plan is terminated, no further contributions shall be made. Benefits under any Insurance Contract shall be paid in accordance with the terms of the Contract. Any amounts remaining as of the end of the Plan Year in which termination occurs shall be forfeited and deposited in the Benefit Plan surplus.");

      articleHeading(ctx, "VIII. Article - Miscellaneous");
      sectionTitle(ctx, "01. Plan Interpretation");
      bodyText(ctx, "All provisions of this Plan shall be governed and interpreted by the Employer, or its delegated Administrator, in its full and complete discretion and shall be applied in a uniform, nondiscriminatory manner.");
      sectionTitle(ctx, "02. Gender and Number");
      bodyText(ctx, "Wherever any words are used herein in the masculine, feminine, or gender neutral, they shall be construed as though they were also used in another gender, and singular/plural forms shall be interchangeable.");
      sectionTitle(ctx, "03. Written Document");
      bodyText(ctx, "This Plan document is intended to satisfy the written Plan requirement of Code Section 125 and any Regulations thereunder relating to Cafeteria Plans.");
      sectionTitle(ctx, "04. Exclusive Benefit");
      bodyText(ctx, "This Plan shall be maintained for the exclusive benefit of the Employees who participate in the Plan.");
      sectionTitle(ctx, "05. Participant\u2019s Rights");
      bodyText(ctx, "This Plan shall not be deemed to constitute an employment contract between the Employer and any Participant or to be a consideration or an inducement for the employment of any Participant or Employee.");
      sectionTitle(ctx, "06. Employer\u2019s Protective Clauses");
      bodyText(ctx, "Upon failure of the Employer to obtain insurance, a Participant\u2019s Benefits shall be limited to unpaid premiums and actual insurance proceeds. The Employer\u2019s liability shall be limited to payments actually received from the Insurer. The Employer shall not be responsible for the validity of any Insurance Contract.");
      sectionTitle(ctx, "07. No Guarantee of Tax Consequences");
      bodyText(ctx, "Neither the Administrator nor the Employer makes any commitment or guarantee that any amounts paid under the Plan will be excludable from the Participant\u2019s gross income for federal or state income tax purposes.");
      sectionTitle(ctx, "08. Indemnification of Employer by Participants");
      bodyText(ctx, "If any Participant receives payments that are not for a permitted Benefit, such Participant shall indemnify and reimburse the Employer for any liability it may incur for failure to withhold federal or state income tax or Social Security tax from such payments.");
      sectionTitle(ctx, "09. Funding");
      bodyText(ctx, "Unless otherwise required by law, contributions to the Plan need not be placed in trust or dedicated to a specific Benefit, but shall instead be considered general assets of the Employer until the Premium Expense required under the Plan has been paid.");
      sectionTitle(ctx, "10. Governing Law");
      bodyText(ctx, `This Plan is governed by the Code and the Treasury regulations issued thereunder. To the extent not preempted by federal law, the provisions of this Plan shall be construed, enforced and administered according to the laws of the state of ${govLaw}.`);
      sectionTitle(ctx, "11. Severability");
      bodyText(ctx, "If any provision of the Plan is held invalid or unenforceable, its invalidity or unenforceability shall not affect any other provisions of the Plan.");
      sectionTitle(ctx, "12. Continuation of Coverage");
      bodyText(ctx, "Each Participant will be entitled to continuation coverage as prescribed in Code Section 4980B.");
      sectionTitle(ctx, "13. HIPAA / USERRA / GINA");
      bodyText(ctx, "This Plan shall be operated in accordance with HIPAA, USERRA, and GINA and regulations thereunder.");
      if (data.elections.includeFmlaLanguage) {
        sectionTitle(ctx, "14. Family and Medical Leave Act");
        bodyText(ctx, "A Participant who takes an unpaid leave of absence under FMLA may revoke his or her election at the beginning of or during the leave. If a Participant chooses to continue coverage during FMLA leave, the Plan Administrator shall select among: (a) Pre-payment before the leave; (b) Payment during the leave on the same schedule; or (c) Advancement by the Employer of required payments.");
      }
    }},

    // Adoption Agreement
    { build: (ctx) => {
      articleHeading(ctx, "Adoption Agreement");
      emptyLine(ctx);
      bodyText(ctx, `For ${name}`, { bold: true });
      bodyText(ctx, "Section 125 Premium Only Plan");
      emptyLine(ctx);
      bodyText(ctx, "The undersigned Employer adopted the Premium Only Plan for those Employees who shall qualify as Participants thereunder. The Employer hereby selects the following Plan specifications:");
      emptyLine(ctx);
      bodyText(ctx, `1. Name of Employer: ${name}`, { bold: true });
      bodyText(ctx, `2. Effective Date: ${effective}`, { bold: true });
      bodyText(ctx, `3. Plan Year: Begins on ${pyStart} and ends on ${pyEnd}.`, { bold: true });
      bodyText(ctx, "4. Employer\u2019s Principal Office:", { bold: true });
      bodyText(ctx, `${addr1}, ${addr2}`, { indent: true });
      bodyText(ctx, "5. Benefits:", { bold: true });
      benefits.forEach((b) => bulletItem(ctx, b));
      signatureBlock(ctx, name);
    }},

    // Certificate of Resolution
    { build: (ctx) => {
      articleHeading(ctx, "CERTIFICATE OF RESOLUTION");
      emptyLine(ctx);
      bodyText(ctx, `The undersigned authorized representative of ${name} (the Employer) hereby certifies that the following resolutions were duly adopted by the governing body of the Employer on ____________________, and that such resolutions have not been modified or rescinded as of the date hereof:`);
      emptyLine(ctx);
      bodyText(ctx, `RESOLVED, that the form of Welfare Benefit Plan, effective ${effective}, presented to this meeting is hereby approved and adopted, and that the proper agents of the Employer are hereby authorized and directed to execute and deliver to the Administrator one or more counterparts of the Plan.`);
      emptyLine(ctx);
      bodyText(ctx, "RESOLVED, that the Administrator shall be instructed to take such actions necessary and proper to implement the Plan and set up adequate accounting and administrative procedures for the provision of benefits under the Plan.");
      emptyLine(ctx);
      bodyText(ctx, "RESOLVED, that the proper agents of the Employer shall act as soon as possible to notify the employees of the adoption of the Plan and deliver to each employee a copy of the Summary Plan Description.");
      emptyLine(ctx);
      bodyText(ctx, `Company: ${name}`, { bold: true });
      signatureBlock(ctx, name);
    }},
  ];
}
