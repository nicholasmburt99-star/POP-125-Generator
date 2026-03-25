import PDFDocument from "pdfkit";
import type { FormData } from "@/types";
import type { PDFSection } from "./pdf-builder";
import {
  coverPage,
  articleHeading,
  sectionTitle,
  definitionItem,
  bodyText,
  bulletItem,
  signatureBlock,
  pageBreak,
  emptyLine,
} from "./pdf-builder";
import {
  formatDate,
  formatMonthDay,
  stateName,
  entityLabel,
  benefitsList,
} from "../helpers";

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
    // Cover page
    {
      build: (doc) => {
        coverPage(doc, name, addr1, addr2, "Section 125 Premium Only Plan", "Plan Document", effective);
      },
    },
    // TOC
    {
      build: (doc) => {
        articleHeading(doc, "TABLE OF CONTENTS");
        emptyLine(doc);
        bodyText(doc, "I. Article - Definitions");
        bodyText(doc, "II. Article - Participation");
        bodyText(doc, "III. Article - Contributions to the Plan");
        bodyText(doc, "IV. Article - Benefits");
        bodyText(doc, "V. Article - Participant Elections");
        bodyText(doc, "VI. Article - Administration");
        bodyText(doc, "VII. Article - Amendment or Termination of Plan");
        bodyText(doc, "VIII. Article - Miscellaneous");
      },
    },
    // Introduction + Article I
    {
      build: (doc) => {
        articleHeading(doc, "Introduction");
        bodyText(doc, `The company has adopted this Plan effective ${effective}. Its purpose is to provide benefits for those Employees who shall qualify hereunder and their Dependents and beneficiaries. The concept of this Plan is to allow Employees to elect between cash compensation or certain nontaxable benefit options as they desire. The Plan shall be known as the ${name} Premium Only Plan (the \u201cPlan\u201d).`);
        emptyLine(doc);

        articleHeading(doc, "I. Article - Definitions");
        definitionItem(doc, "01", "Administrator", "means the individual(s) or corporation appointed by the Employer to carry out the administration of the Plan. The Employer shall be empowered to appoint and remove the Administrator from time to time as it deems necessary for the proper administration of the plan. In the event an Administrator has not been appointed, or resigns from an appointment, the Employer shall be deemed to be the Administrator.");
        definitionItem(doc, "02", "Benefit", "means any of the optional benefit choices available to a Participant as outlined in the Section titled: \u201cBenefit Options\u201d.");
        definitionItem(doc, "03", "Code", "means Section 125 of the Internal Revenue Code of 1986, as amended or replaced from time to time, and any governing regulations or applicable guidance thereunder.");
        definitionItem(doc, "04", "Compensation", "means the total cash remuneration received by the Participant from the Employer during a Plan Year, prior to any reductions pursuant to an Election to Participate form authorized hereunder.");
        definitionItem(doc, "05", "Dependent", "means any individual who is so defined under an Insurance Contract or who is (i) a Qualifying Child (within the meaning of Code Section 152(c)) or Participant\u2019s child who has not attained age 27 as of the end of the taxable year, or (ii) a Qualifying Relative who qualifies as a dependent under an Insurance Contract. The Plan will comply with Michelle\u2019s Law.");
        definitionItem(doc, "06", "Effective Date", `means the effective date of the Plan which is ${effective}.`);
        definitionItem(doc, "07", "Election Period", "means the period immediately preceding the beginning of each Plan Year established by the Administrator for the election of Benefits and Salary Redirections.");
        definitionItem(doc, "08", "Eligible Employee", "means any Employee who has satisfied the provisions of the Section titled: \u201cEligibility\u201d. However, 2% shareholders and self-employed individuals shall not be eligible to participate in this Plan.");
        definitionItem(doc, "09", "Employee", "means any person who is employed by the Employer, but generally excludes independent contractors, self-employed individuals, and greater than 2% shareholders in a Subchapter S corporation.");
        definitionItem(doc, "10", "Employer", `means the ${entity} or any such entity specified in the Adoption Agreement that adopts this Plan.`);
        definitionItem(doc, "11", "Highly Compensated Employee", "means an Employee so described in Code Section 125 and the Treasury Regulations thereunder.");
        definitionItem(doc, "12", "Insurance Contract", "means any contract issued by an Insurer underwriting a Benefit, or any self-funded arrangement providing any Benefit offered for health and welfare coverage.");
        definitionItem(doc, "13", "Insurance Premium Payment Plan", "means the plan of benefits contained in the Section titled: \u201cBenefit Options\u201d that provides for the payment of Premium Expenses.");
        definitionItem(doc, "14", "Insurer", "means any insurance company that underwrites a Benefit or any self-funded arrangement under this Plan.");
        definitionItem(doc, "15", "Key Employee", "means an employee defined in Code Section 416(i)(1) and the Treasury regulations thereunder.");
        definitionItem(doc, "16", "Participant", "means any Eligible Employee who elects to become a Participant and has not become ineligible to participate further in the Plan.");
        definitionItem(doc, "17", "Plan", "means the Section 125 Premium Only Plan described in this instrument, including all amendments thereto.");
        definitionItem(doc, "18", "Plan Year", "means the 12-month period beginning and ending on the dates specified in the Adoption Agreement.");
        definitionItem(doc, "19", "Premium Expenses", "or \u201cPremiums\u201d mean the Participant\u2019s cost for the insured Benefits described in the Section titled: \u201cBenefit Options\u201d.");
        definitionItem(doc, "20", "Salary Redirection", "means the contributions made by the Employer on behalf of Participants in accordance with the Section titled: \u201cSalary Redirection.\u201d");
        definitionItem(doc, "21", "Spouse", "means \u201cspouse\u201d as defined in an Insurance Contract or under applicable federal or state law.");
        definitionItem(doc, "22", "Uniformed Services", "means the Armed Forces, the Army National Guard, the Air National Guard, the commissioned corps of the Public Health Service, and any other category designated by the President.");
      },
    },
    // Article II - Participation
    {
      build: (doc) => {
        articleHeading(doc, "II. Article - Participation");
        sectionTitle(doc, "01. Eligibility");
        bodyText(doc, "As to each Benefit provided hereunder, any Eligible Employee shall be eligible to participate as of the date he or she satisfies the eligibility conditions set forth in the policy or plan providing such Benefit.");
        sectionTitle(doc, "02. Effective Date of Participation");
        bodyText(doc, "(a) An Eligible Employee shall become a Participant effective as of the later of the date on which he or she satisfies the Eligibility Requirements of the Plan or the Effective Date of this Plan.");
        bodyText(doc, "(b) If an Eligible Employee terminates and is rehired within 30 days, the prior election(s) shall be reinstated. If rehired more than 30 days later, the individual shall be treated as a newly Eligible Employee.");
        sectionTitle(doc, "03. Application to Participate");
        bodyText(doc, "An Employee who is eligible to participate may complete an Election to Participate form during the applicable Election Period. The election is irrevocable for the Plan Year unless the Participant qualifies for a change in status.");
        sectionTitle(doc, "04. Termination of Participation");
        bodyText(doc, "A Participant shall no longer participate upon: (a) termination of employment; (b) death; or (c) termination of this Plan.");
        sectionTitle(doc, "05. Termination of Employment");
        bodyText(doc, "If a Participant terminates employment, participation ceases, subject to the right to continue coverage under any Insurance Contract for which premiums have already been paid.");
      },
    },
    // Article III - Contributions
    {
      build: (doc) => {
        articleHeading(doc, "III. Article - Contributions to the Plan");
        sectionTitle(doc, "01. Salary Redirection");
        bodyText(doc, "Benefits under the Plan shall be financed by Salary Redirections sufficient to support Benefits elected and to pay the Participant\u2019s Premium Expenses. Salary Redirection amounts shall be contributed on a pro rata basis for each pay period during the Plan Year.");
        sectionTitle(doc, "02. Application of Contributions");
        bodyText(doc, "As soon as reasonably practical after each payroll period, the Employer shall apply the Salary Redirections to provide the Benefits elected by the affected Participants.");
        sectionTitle(doc, "03. Periodic Contributions");
        bodyText(doc, "The Employer and Administrator may implement a procedure in which Salary Redirections are contributed on a periodic basis that is not pro rata for each payroll period.");
      },
    },
    // Article IV - Benefits
    {
      build: (doc) => {
        articleHeading(doc, "IV. Article - Benefits");
        sectionTitle(doc, "01. Benefit Options");
        bodyText(doc, "Each Participant may elect to have his or her full compensation paid in taxable compensation or elect to have Salary Redirection amounts applied to any one or more of the optional Benefits permitted under Code Section 125.");
        sectionTitle(doc, "02. Description of Benefits");
        bodyText(doc, "Each Eligible Employee may elect to have the Administrator pay contributions required for participation in the Benefit options.");
        sectionTitle(doc, "03. Nondiscrimination Requirements");
        bodyText(doc, "It is the intent of this Plan to provide benefits to a classification of Employees not discriminatory in favor of the group prohibited under Code Section 125.");
      },
    },
    // Article V - Elections
    {
      build: (doc) => {
        articleHeading(doc, "V. Article - Participant Elections");
        sectionTitle(doc, "01. Initial Elections");
        bodyText(doc, "An Employee who meets the Eligibility Requirements may elect to participate for all or the remainder of a Plan Year, provided election is made before the effective date of participation or within 30 days of hire.");
        sectionTitle(doc, "02. Subsequent Annual Elections");
        bodyText(doc,
          data.elections.employeeElections === "first_year_only"
            ? "A Participant will automatically be enrolled in subsequent plan years unless the Participant terminates participation in writing during the Election Period."
            : data.elections.employeeElections === "every_year"
            ? "Each Participant must complete a new Election to Participate form each year during the Election Period."
            : "Participation in the Plan is automatic for all Eligible Employees."
        );
        sectionTitle(doc, "03. Change of Elections");
        bodyText(doc, "Any Participant may change a Benefit election after the Plan Year has commenced if the changes are necessitated by and consistent with a change in status recognized under Treasury regulations:");
        bulletItem(doc, "Legal Marital Status: marriage, divorce, death of a spouse, legal separation or annulment");
        bulletItem(doc, "Number of Dependents: birth, adoption, placement for adoption, or death of a dependent");
        bulletItem(doc, "Employment Status: termination or commencement of employment, strike or lockout, unpaid leave of absence, or change in worksite");
        bulletItem(doc, "Dependent satisfies or ceases to satisfy eligibility requirements");
        bulletItem(doc, "Residency: a change in place of residence of the Participant, spouse or dependent");
        if (data.elections.allowChangeBelow30Hours) {
          bulletItem(doc, "A change from full-time (30+ hours/week) to part-time employment, provided the Participant intends to enroll in another plan with minimum essential coverage");
        }
        if (data.elections.allowChangeMarketplace) {
          bulletItem(doc, "Eligibility for a Special Enrollment Period or annual open enrollment in a Qualified Health Plan through a Marketplace");
        }
      },
    },
    // Article VI - Administration
    {
      build: (doc) => {
        articleHeading(doc, "VI. Article - Administration");
        sectionTitle(doc, "01. Plan Administration");
        bodyText(doc, "The Employer shall be the Administrator, unless the Employer elects otherwise. The Administrator shall have full power to administer the Plan in all of its details.");
        sectionTitle(doc, "02. Examination of Records");
        bodyText(doc, "The Administrator shall make available to each Participant such records as pertain to their interests under the Plan for examination at reasonable times.");
        sectionTitle(doc, "03. Payment of Expenses");
        bodyText(doc, "Administrative expenses shall be paid by the Employer unless the Employer determines costs shall be borne by Participants.");
        sectionTitle(doc, "04. Indemnification of Administrator");
        bodyText(doc, "The Employer agrees to indemnify and defend any Employee serving as Administrator against all liabilities occasioned by any act or omission in good faith.");
      },
    },
    // Article VII + VIII
    {
      build: (doc) => {
        articleHeading(doc, "VII. Article - Amendment or Termination of Plan");
        sectionTitle(doc, "01. Amendment");
        bodyText(doc, "The Employer may amend any or all provisions of the Plan at any time without the consent of any Employee or Participant.");
        sectionTitle(doc, "02. Termination");
        bodyText(doc, "The Employer reserves the right to terminate the Plan, in whole or in part, at any time. In the event of termination, no further contributions shall be made.");

        articleHeading(doc, "VIII. Article - Miscellaneous");
        sectionTitle(doc, "01. Plan Interpretation");
        bodyText(doc, "All provisions shall be governed and interpreted by the Employer or its delegated Administrator in a uniform, nondiscriminatory manner.");
        sectionTitle(doc, "02. Exclusive Benefit");
        bodyText(doc, "This Plan shall be maintained for the exclusive benefit of the Employees who participate in the Plan.");
        sectionTitle(doc, "03. Participant\u2019s Rights");
        bodyText(doc, "This Plan shall not constitute an employment contract or inducement for employment.");
        sectionTitle(doc, "04. Governing Law");
        bodyText(doc, `This Plan is governed by the Code and Treasury regulations. To the extent not preempted by federal law, it shall be construed according to the laws of the state of ${govLaw}.`);
        sectionTitle(doc, "05. Severability");
        bodyText(doc, "If any provision is held invalid, it shall not affect other provisions of the Plan.");
        sectionTitle(doc, "06. Continuation of Coverage");
        bodyText(doc, "Each Participant will be entitled to continuation coverage as prescribed in Code Section 4980B.");
        sectionTitle(doc, "07. HIPAA / USERRA / GINA");
        bodyText(doc, "This Plan shall be operated in accordance with HIPAA, USERRA, and GINA and regulations thereunder.");
        if (data.elections.includeFmlaLanguage) {
          sectionTitle(doc, "08. Family and Medical Leave Act");
          bodyText(doc, "A Participant who takes unpaid FMLA leave may revoke his or her election at the beginning of or during the leave.");
        }
      },
    },
    // Adoption Agreement
    {
      build: (doc) => {
        articleHeading(doc, "Adoption Agreement");
        emptyLine(doc);
        bodyText(doc, `For ${name}`, { bold: true });
        bodyText(doc, "Section 125 Premium Only Plan");
        emptyLine(doc);
        bodyText(doc, "The undersigned Employer adopted the Premium Only Plan for those Employees who shall qualify as Participants thereunder.");
        emptyLine(doc);
        bodyText(doc, `1. Name of Employer: ${name}`, { bold: true });
        bodyText(doc, `2. Effective Date: ${effective}`, { bold: true });
        bodyText(doc, `3. Plan Year: Begins on ${pyStart} and ends on ${pyEnd}.`, { bold: true });
        bodyText(doc, "4. Employer\u2019s Principal Office:", { bold: true });
        bodyText(doc, addr1, { indent: true });
        bodyText(doc, addr2, { indent: true });
        bodyText(doc, "5. Benefits:", { bold: true });
        benefits.forEach((b) => bulletItem(doc, b));
        signatureBlock(doc, name);
      },
    },
    // Certificate of Resolution
    {
      build: (doc) => {
        articleHeading(doc, "CERTIFICATE OF RESOLUTION");
        emptyLine(doc);
        bodyText(doc, `The undersigned authorized representative of ${name} (the Employer) hereby certifies that the following resolutions were duly adopted by the governing body of the Employer on ____________________, and that such resolutions have not been modified or rescinded as of the date hereof:`);
        emptyLine(doc);
        bodyText(doc, `RESOLVED, that the form of Welfare Benefit Plan, effective ${effective}, is hereby approved and adopted, and that the proper agents of the Employer are authorized to execute and deliver to the Administrator one or more counterparts of the Plan.`);
        emptyLine(doc);
        bodyText(doc, "RESOLVED, that the Administrator shall take such actions necessary to implement the Plan and set up adequate accounting and administrative procedures.");
        emptyLine(doc);
        bodyText(doc, "RESOLVED, that the proper agents shall notify employees of the adoption of the Plan and deliver to each employee a copy of the Summary Plan Description.");
        emptyLine(doc);
        bodyText(doc, `Company: ${name}`, { bold: true });
        signatureBlock(doc, name);
      },
    },
  ];
}
