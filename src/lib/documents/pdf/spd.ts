import type { FormData } from "@/types";
import type { PDFSection } from "./pdf-builder";
import { coverPage, articleHeading, sectionTitle, bodyText, bulletItem, emptyLine } from "./pdf-builder";
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
    { build: (ctx) => coverPage(ctx, name, addr1, addr2, "Section 125 Premium Only Plan", "Summary Plan Description", effective) },
    { build: (ctx) => {
      articleHeading(ctx, "INTRODUCTION");
      bodyText(ctx, `The Company\u2019s Premium Only Plan has been established to allow Eligible Employees to pay for certain benefits on a pre-tax basis. Read this Summary Plan Description carefully so that you understand the provisions of the Plan.`);
      emptyLine(ctx);
      articleHeading(ctx, "Overview");
      sectionTitle(ctx, "General Information");
      bodyText(ctx, `1. The name of the Plan is the ${name} Premium Only Plan.`);
      bodyText(ctx, `2. The company has adopted this Plan effective ${effective}.`);
      bodyText(ctx, `3. The Plan Year begins on ${pyStart} and ends on ${pyEnd}.`);
      bodyText(ctx, "4. This Plan is unfunded.");
      emptyLine(ctx);
      sectionTitle(ctx, "Employer / Plan Administrator / Agent for Legal Process");
      bodyText(ctx, name, { bold: true });
      bodyText(ctx, `${addr1}, ${addr2}`);
      bodyText(ctx, `Federal Employer I.D. Number: ${ein}`);
    }},
    { build: (ctx) => {
      articleHeading(ctx, "Plan Details");
      sectionTitle(ctx, "01. How Does This Plan Operate?");
      bodyText(ctx, "You may elect to have salary contributed to the Plan to pay for benefits on a pre-tax basis, reducing your State and Federal income and Social Security taxes.");
      sectionTitle(ctx, "02. What Happens to Contributions?");
      bodyText(ctx, "Contributions are used to pay your portion of employer-sponsored benefit coverage. Unused amounts are forfeited.");
      sectionTitle(ctx, "03. Election Period");
      bodyText(ctx, "Your initial election period starts on the date you meet eligibility requirements and ends 30 days thereafter.");
      sectionTitle(ctx, "04. May I Change Elections During the Plan Year?");
      bodyText(ctx, "Generally no, unless you have a qualifying change in status:");
      bulletItem(ctx, "Marriage, divorce, death of a spouse, legal separation or annulment");
      bulletItem(ctx, "Change in the number of dependents");
      bulletItem(ctx, "Changes in employment status affecting eligibility");
      bulletItem(ctx, "A dependent satisfies or ceases to satisfy eligibility requirements");
      bulletItem(ctx, "A change in place of residence");
      if (data.elections.allowChangeBelow30Hours) bulletItem(ctx, "Reduction in work hours below 30 per week");
      if (data.elections.allowChangeMarketplace) bulletItem(ctx, "Eligibility for Marketplace enrollment");
      sectionTitle(ctx, "05. Future Plan Year Elections");
      bodyText(ctx, data.elections.employeeElections === "first_year_only"
        ? "You will be automatically enrolled unless you terminate participation in writing."
        : "You must complete a new election form each year.");
      sectionTitle(ctx, "06. What Coverage May I Purchase?");
      benefits.forEach((b) => bulletItem(ctx, b));
      sectionTitle(ctx, "07. Social Security Impact");
      bodyText(ctx, "Your Social Security benefits may be slightly reduced due to pre-tax contributions.");
      sectionTitle(ctx, "08. Termination of Employment");
      bodyText(ctx, "You remain covered only for the period for which premiums have been paid. Unused amounts are forfeited.");
    }},
  ];
}
