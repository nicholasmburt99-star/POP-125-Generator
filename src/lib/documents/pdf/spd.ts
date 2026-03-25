import type { FormData } from "@/types";
import type { PDFSection } from "./pdf-builder";
import {
  coverPage,
  articleHeading,
  sectionTitle,
  bodyText,
  bulletItem,
  emptyLine,
} from "./pdf-builder";
import { formatDate, formatMonthDay, benefitsList } from "../helpers";

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
    // Cover
    {
      build: (doc) => {
        coverPage(doc, name, addr1, addr2, "Section 125 Premium Only Plan", "Summary Plan Description", effective);
      },
    },
    // Intro + Overview
    {
      build: (doc) => {
        articleHeading(doc, "INTRODUCTION");
        bodyText(doc, `The Company\u2019s Premium Only Plan (\u201cPlan\u201d) has been established to allow Eligible Employees to pay for certain benefits on a pre-tax basis. Read this Summary Plan Description (\u201cSPD\u201d) carefully so that you understand the provisions of the Plan and the benefits you will receive.`);
        emptyLine(doc);
        bodyText(doc, "The Plan is subject to the Internal Revenue Code and other federal and state laws. This Plan may be amended or terminated by the Company.");

        articleHeading(doc, "Overview");
        sectionTitle(doc, "General Information");
        bodyText(doc, `1. The name of the Plan is the ${name} Premium Only Plan.`);
        bodyText(doc, `2. The company has adopted this Plan effective ${effective}.`);
        bodyText(doc, `3. The Plan Year begins on ${pyStart} and ends on ${pyEnd}.`);
        bodyText(doc, "4. This Plan is unfunded \u2014 funds come from the general assets of the Employer.");
        emptyLine(doc);
        sectionTitle(doc, "Employer Information");
        bodyText(doc, name, { bold: true });
        bodyText(doc, addr1);
        bodyText(doc, addr2);
        bodyText(doc, `Federal Employer I.D. Number: ${ein}`);
        emptyLine(doc);
        sectionTitle(doc, "Plan Administrator Information");
        bodyText(doc, name, { bold: true });
        bodyText(doc, addr1);
        bodyText(doc, addr2);
        bodyText(doc, `Federal Employer I.D. Number: ${ein}`);
        bodyText(doc, "The Administrator keeps the records for the Plan and will answer any questions you may have.");
        emptyLine(doc);
        sectionTitle(doc, "Service of Legal Process");
        bodyText(doc, name, { bold: true });
        bodyText(doc, addr1);
        bodyText(doc, addr2);
        bodyText(doc, "The type of Plan administration is Employer Administration.");
      },
    },
    // Plan Details
    {
      build: (doc) => {
        articleHeading(doc, "Plan Details");

        sectionTitle(doc, "01. How Does This Plan Operate?");
        bodyText(doc, "Before the start of each Plan Year, you will be able to elect to have some of your future salary contributed to the Plan in lieu of receiving those amounts in cash. The portion of your pay contributed to the Plan is not subject to State or Federal income or Social Security taxes.");

        sectionTitle(doc, "02. What Happens to Contributions Made to the Plan?");
        bodyText(doc, "The contributions deducted from your paycheck will be used to pay your portion of employer-sponsored benefit coverage. Any unused amounts will be forfeited.");

        sectionTitle(doc, "03. When Is the Election Period for Our Plan?");
        bodyText(doc, "Your initial election period starts on the date you first meet eligibility requirements and ends 30 days thereafter. The Administrator will inform you each year about subsequent election periods.");

        sectionTitle(doc, "04. May I Change My Elections During the Plan Year?");
        bodyText(doc, "Generally, you cannot change elections after the beginning of the Plan Year. Exceptions include:");
        bulletItem(doc, "Marriage, divorce, death of a spouse, legal separation or annulment");
        bulletItem(doc, "Change in the number of dependents");
        bulletItem(doc, "Changes in employment status affecting eligibility");
        bulletItem(doc, "A dependent satisfies or ceases to satisfy eligibility requirements");
        bulletItem(doc, "A change in place of residence");
        if (data.elections.allowChangeBelow30Hours) {
          bulletItem(doc, "Reduction in work hours below 30 per week");
        }
        if (data.elections.allowChangeMarketplace) {
          bulletItem(doc, "Eligibility for Marketplace enrollment during special or annual enrollment");
        }

        sectionTitle(doc, "05. May I Make New Elections in Future Plan Years?");
        bodyText(doc,
          data.elections.employeeElections === "first_year_only"
            ? "You will automatically be enrolled in subsequent plan years unless you terminate participation in writing during the Election Period."
            : "You must complete a new election form each year during the Election Period."
        );

        sectionTitle(doc, "06. What Insurance Coverage May I Purchase?");
        bodyText(doc, "You may purchase:");
        benefits.forEach((b) => bulletItem(doc, b));

        sectionTitle(doc, "07. Will My Social Security Benefits Be Affected?");
        bodyText(doc, "Your Social Security benefits may be slightly reduced because pre-tax contributions reduce the amount of contributions to Social Security.");

        sectionTitle(doc, "08. What Happens If I Terminate Employment?");
        bodyText(doc, "You will remain covered by insurance only for the period for which premiums have been paid prior to termination. Unused amounts will be forfeited.");
      },
    },
  ];
}
