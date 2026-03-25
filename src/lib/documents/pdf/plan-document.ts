import type { FormData } from "@/types";
import type { PDFSection, PDFContext } from "./pdf-builder";
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
    { build: (ctx) => coverPage(ctx, name, addr1, addr2, "Section 125 Premium Only Plan", "Plan Document", effective) },
    { build: (ctx) => {
      articleHeading(ctx, "TABLE OF CONTENTS");
      emptyLine(ctx);
      const toc = ["I. Definitions", "II. Participation", "III. Contributions", "IV. Benefits", "V. Participant Elections", "VI. Administration", "VII. Amendment or Termination", "VIII. Miscellaneous"];
      toc.forEach((t) => bodyText(ctx, t));
    }},
    { build: (ctx) => {
      articleHeading(ctx, "Introduction");
      bodyText(ctx, `The company has adopted this Plan effective ${effective}. Its purpose is to provide benefits for those Employees who shall qualify hereunder. The Plan shall be known as the ${name} Premium Only Plan.`);
      emptyLine(ctx);
      articleHeading(ctx, "I. Article - Definitions");
      definitionItem(ctx, "01", "Administrator", "means the individual(s) or corporation appointed by the Employer to carry out the administration of the Plan.");
      definitionItem(ctx, "02", "Benefit", "means any of the optional benefit choices available to a Participant.");
      definitionItem(ctx, "03", "Code", "means Section 125 of the Internal Revenue Code of 1986, as amended.");
      definitionItem(ctx, "04", "Compensation", "means the total cash remuneration received by the Participant from the Employer during a Plan Year.");
      definitionItem(ctx, "05", "Dependent", "means any individual defined under an Insurance Contract or a Qualifying Child/Relative under the Code.");
      definitionItem(ctx, "06", "Effective Date", `means ${effective}.`);
      definitionItem(ctx, "07", "Election Period", "means the period preceding each Plan Year established by the Administrator for the election of Benefits.");
      definitionItem(ctx, "08", "Eligible Employee", "means any Employee who has satisfied eligibility provisions. 2% shareholders and self-employed individuals are excluded.");
      definitionItem(ctx, "09", "Employee", "means any person employed by the Employer, excluding independent contractors and self-employed individuals.");
      definitionItem(ctx, "10", "Employer", `means the ${entity} that adopts this Plan.`);
      definitionItem(ctx, "11", "Highly Compensated Employee", "means an Employee described in Code Section 125.");
      definitionItem(ctx, "12", "Insurance Contract", "means any contract underwriting a Benefit.");
      definitionItem(ctx, "13", "Plan Year", "means the 12-month period specified in the Adoption Agreement.");
      definitionItem(ctx, "14", "Salary Redirection", "means contributions made by the Employer on behalf of Participants.");
      definitionItem(ctx, "15", "Spouse", "means spouse as defined under applicable federal or state law.");
    }},
    { build: (ctx) => {
      articleHeading(ctx, "II. Article - Participation");
      sectionTitle(ctx, "01. Eligibility");
      bodyText(ctx, "Any Eligible Employee shall be eligible to participate as of the date he or she satisfies the eligibility conditions.");
      sectionTitle(ctx, "02. Effective Date of Participation");
      bodyText(ctx, "An Eligible Employee shall become a Participant effective as of the later of the eligibility date or the Effective Date of this Plan. Rehires within 30 days are reinstated; over 30 days are treated as new.");
      sectionTitle(ctx, "03. Application to Participate");
      bodyText(ctx, "An eligible Employee may complete an Election to Participate form during the applicable Election Period.");
      sectionTitle(ctx, "04. Termination of Participation");
      bodyText(ctx, "Participation ends upon: (a) termination of employment; (b) death; or (c) termination of the Plan.");
    }},
    { build: (ctx) => {
      articleHeading(ctx, "III. Article - Contributions to the Plan");
      sectionTitle(ctx, "01. Salary Redirection");
      bodyText(ctx, "Benefits shall be financed by Salary Redirections on a pro rata basis for each pay period during the Plan Year.");
      sectionTitle(ctx, "02. Application of Contributions");
      bodyText(ctx, "The Employer shall apply Salary Redirections to provide the Benefits elected by affected Participants.");
    }},
    { build: (ctx) => {
      articleHeading(ctx, "IV. Article - Benefits");
      sectionTitle(ctx, "01. Benefit Options");
      bodyText(ctx, "Each Participant may elect to have Salary Redirection amounts applied to optional Benefits permitted under Code Section 125.");
      sectionTitle(ctx, "02. Nondiscrimination Requirements");
      bodyText(ctx, "This Plan is intended to provide benefits on a nondiscriminatory basis per Code Section 125.");
    }},
    { build: (ctx) => {
      articleHeading(ctx, "V. Article - Participant Elections");
      sectionTitle(ctx, "01. Initial Elections");
      bodyText(ctx, "Eligible Employees may elect to participate within 30 days of hire or during the Election Period.");
      sectionTitle(ctx, "02. Subsequent Annual Elections");
      bodyText(ctx, data.elections.employeeElections === "first_year_only"
        ? "Participants are automatically enrolled in subsequent years unless they terminate participation in writing."
        : "Each Participant must complete a new election form each year during the Election Period.");
      sectionTitle(ctx, "03. Change of Elections");
      bodyText(ctx, "Elections may be changed mid-year if consistent with a qualifying change in status:");
      bulletItem(ctx, "Marriage, divorce, death of a spouse, legal separation or annulment");
      bulletItem(ctx, "Birth, adoption, placement for adoption, or death of a dependent");
      bulletItem(ctx, "Change in employment status affecting eligibility");
      bulletItem(ctx, "Dependent eligibility changes (age, student status)");
      bulletItem(ctx, "Change in place of residence");
      if (data.elections.allowChangeBelow30Hours) bulletItem(ctx, "Change from full-time to part-time (below 30 hours/week)");
      if (data.elections.allowChangeMarketplace) bulletItem(ctx, "Eligibility for Marketplace special or annual enrollment");
    }},
    { build: (ctx) => {
      articleHeading(ctx, "VI-VIII. Administration, Amendment, Miscellaneous");
      sectionTitle(ctx, "Plan Administration");
      bodyText(ctx, "The Employer shall be the Administrator with full power to administer the Plan.");
      sectionTitle(ctx, "Amendment and Termination");
      bodyText(ctx, "The Employer may amend or terminate the Plan at any time.");
      sectionTitle(ctx, "Governing Law");
      bodyText(ctx, `This Plan shall be construed according to the laws of the state of ${govLaw}.`);
      sectionTitle(ctx, "Compliance");
      bodyText(ctx, "This Plan shall be operated in accordance with HIPAA, USERRA, and GINA.");
      if (data.elections.includeFmlaLanguage) {
        sectionTitle(ctx, "FMLA");
        bodyText(ctx, "A Participant on unpaid FMLA leave may revoke elections at the beginning of or during the leave.");
      }
    }},
    { build: (ctx) => {
      articleHeading(ctx, "Adoption Agreement");
      emptyLine(ctx);
      bodyText(ctx, `For ${name}`, { bold: true });
      bodyText(ctx, `1. Name of Employer: ${name}`, { bold: true });
      bodyText(ctx, `2. Effective Date: ${effective}`, { bold: true });
      bodyText(ctx, `3. Plan Year: ${pyStart} through ${pyEnd}`, { bold: true });
      bodyText(ctx, `4. Address: ${addr1}, ${addr2}`, { bold: true });
      bodyText(ctx, "5. Benefits:", { bold: true });
      benefits.forEach((b) => bulletItem(ctx, b));
      signatureBlock(ctx, name);
    }},
    { build: (ctx) => {
      articleHeading(ctx, "CERTIFICATE OF RESOLUTION");
      emptyLine(ctx);
      bodyText(ctx, `The undersigned authorized representative of ${name} hereby certifies that the following resolutions were duly adopted by the governing body of the Employer.`);
      emptyLine(ctx);
      bodyText(ctx, `RESOLVED, that the Welfare Benefit Plan, effective ${effective}, is hereby approved and adopted.`);
      emptyLine(ctx);
      bodyText(ctx, "RESOLVED, that the Administrator shall implement the Plan and set up adequate procedures.");
      emptyLine(ctx);
      bodyText(ctx, "RESOLVED, that employees shall be notified and provided a Summary Plan Description.");
      signatureBlock(ctx, name);
    }},
  ];
}
