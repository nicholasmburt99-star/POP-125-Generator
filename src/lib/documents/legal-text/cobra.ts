// Detailed COBRA continuation provisions — applies if employer normally employed
// 20 or more employees on a typical business day during the preceding calendar year
// AND the plan provides group health benefits. Wrapped in a conditional preamble so
// the document self-applies based on employer size.
//
// Identical text used by POP and Cafeteria, DOCX and PDF.

import type { Paragraph } from "docx";
import type { PDFContext } from "../pdf/pdf-builder";
import {
  articleHeading as docxArticleHeading,
  subheading as docxSubheading,
  body as docxBody,
} from "../docx/docx-builder";
import {
  articleHeading as pdfArticleHeading,
  subheading as pdfSubheading,
  bodyText as pdfBodyText,
} from "../pdf/pdf-builder";

// --- Content ---

const PREAMBLE =
  "If the Employer normally employed 20 or more employees on a typical business day during the preceding calendar year and group health plan benefits have been selected under the Plan, coverage provided under this Plan to a Covered Person may be continued in accordance with the following provisions, the requirements of the Consolidated Omnibus Budget Reconciliation Act of 1985, as amended (“COBRA”), and the regulations issued thereunder. The provisions described in this Article shall be administered in a manner consistent with COBRA and any regulations issued thereunder, and shall be interpreted and applied to give effect to the requirements of COBRA.";

const DEFINITIONS: Array<{ term: string; body: string }> = [
  {
    term: "Continuation Coverage",
    body: "the continuation of coverage which the Plan is required to make available, on an elective basis, under Section 4980B of the Code, Sections 601 through 608 of ERISA, and any successor provisions thereto, including any rules and regulations issued thereunder.",
  },
  {
    term: "Qualified Beneficiary",
    body: "any Covered Person who, on the day before a Qualifying Event, is covered under the Plan as a Covered Member, the spouse of a Covered Member, or the Dependent child of a Covered Member. A child born to, adopted by, or placed for adoption with a Covered Member during a period of Continuation Coverage is also a Qualified Beneficiary.",
  },
  {
    term: "Qualifying Event",
    body: "any of the following events which, but for the Continuation Coverage required by this Article, would result in a loss of coverage to a Qualified Beneficiary: (a) the death of the Covered Member; (b) the termination of the Covered Member’s employment (other than by reason of gross misconduct) or reduction in the Covered Member’s hours of employment; (c) the divorce or legal separation of the Covered Member from the Covered Member’s spouse; (d) the Covered Member’s entitlement to Medicare benefits under Title XVIII of the Social Security Act; (e) a Dependent child ceasing to be a Dependent child under the terms of the Plan; or (f) a proceeding in a case under Title 11, United States Code, with respect to the Employer from whose employment the Covered Member retired at any time.",
  },
  {
    term: "Election Period",
    body: "the period during which a Qualified Beneficiary may elect Continuation Coverage. The Election Period begins on the date the Qualified Beneficiary would otherwise lose coverage on account of a Qualifying Event and ends not earlier than 60 days after the later of (a) the date coverage terminates by reason of the Qualifying Event or (b) the date the Plan Administrator provides the Qualified Beneficiary with notice of the right to elect Continuation Coverage.",
  },
  {
    term: "Covered Member",
    body: "a current or former Participant who is or was covered under a group health benefit option of the Plan on the day before a Qualifying Event.",
  },
  {
    term: "Covered Person",
    body: "a Covered Member, a Covered Member’s spouse, or a Covered Member’s Dependent child who is covered under a group health benefit option of the Plan.",
  },
  {
    term: "Dependent",
    body: "any child of a Covered Member who would qualify as a Dependent under the terms of the underlying group health plan(s) made available through this Plan, including any child born to, adopted by, or placed for adoption with the Covered Member during a period of Continuation Coverage.",
  },
];

const PERIOD_PARAGRAPHS = [
  "Continuation Coverage shall extend, in the case of a Qualifying Event described in (b) above (termination of employment or reduction of hours), for a period of 18 months after the date of the Qualifying Event. In the case of any other Qualifying Event, Continuation Coverage shall extend for a period of 36 months after the date of the Qualifying Event.",
  "If a Qualified Beneficiary is determined under the Social Security Act to have been disabled at any time during the first 60 days of Continuation Coverage, the 18-month period described above shall be extended to 29 months for the disabled Qualified Beneficiary and any non-disabled Qualified Beneficiaries who experienced the same Qualifying Event, provided the Qualified Beneficiary furnishes notice of the disability determination to the Plan Administrator within 60 days after the date of the determination and before the end of the original 18-month period.",
  "If a second Qualifying Event occurs during a period of Continuation Coverage that began as a result of a termination of employment or reduction of hours, Continuation Coverage for the affected Qualified Beneficiaries shall be extended to a maximum of 36 months from the date of the original Qualifying Event, provided the Qualified Beneficiary furnishes notice of the second Qualifying Event to the Plan Administrator within 60 days after the second Qualifying Event.",
  "Notwithstanding the foregoing, Continuation Coverage may be terminated earlier upon the occurrence of any of the following: (a) the date the Employer ceases to provide any group health plan to any employee; (b) the date on which coverage ceases under the Plan by reason of failure to make timely payment of the premium for Continuation Coverage; (c) the date on which the Qualified Beneficiary first becomes, after the date of election, covered under any other group health plan that does not contain any exclusion or limitation with respect to any pre-existing condition of the Qualified Beneficiary; (d) the date on which the Qualified Beneficiary first becomes, after the date of election, entitled to Medicare benefits under Title XVIII of the Social Security Act; or (e) in the case of a disability extension, the first month that begins more than 30 days after a final determination by the Social Security Administration that the disabled Qualified Beneficiary is no longer disabled.",
];

const PREMIUM_PARAGRAPHS = [
  "A Qualified Beneficiary who elects Continuation Coverage may be required to pay a premium for such coverage. The premium charged shall not exceed 102% of the applicable premium for the period of coverage, as determined by the Plan Administrator in accordance with COBRA. Premiums for Continuation Coverage shall be payable on a monthly basis or such other basis as the Plan Administrator may permit.",
  "In the case of a Qualified Beneficiary entitled to a disability extension (i.e., the 19th through 29th months of Continuation Coverage), the premium charged for the disability extension period may be increased to 150% of the applicable premium for similarly situated active employees.",
  "The initial premium payment for Continuation Coverage must be made within 45 days after the date of the Qualified Beneficiary’s election. Subsequent premium payments must be made by the first day of the period of coverage to which the payment relates, subject to a 30-day grace period. If a premium payment is not made within the applicable grace period, Continuation Coverage shall terminate as of the last day of the period for which timely premium payment was made.",
];

const PA_NOTICE_PARAGRAPHS = [
  "Initial (General) Notice. The Plan Administrator shall provide each Covered Member and the Covered Member’s spouse, if any, with a written notice of their rights under COBRA at the time the Covered Member or spouse first becomes covered under the Plan.",
  "Election Notice. Upon receipt of notice of a Qualifying Event, the Plan Administrator shall provide each Qualified Beneficiary with a written notice describing the right to elect Continuation Coverage, the Election Period, the cost of Continuation Coverage, and the procedures for making an election. The Election Notice shall be furnished within 14 days after receipt of notice of the Qualifying Event.",
  "Notice of Unavailability. If the Plan Administrator receives a notice of a Qualifying Event, second Qualifying Event, or disability determination from a Covered Member or Qualified Beneficiary and determines that the affected individual is not entitled to Continuation Coverage (or to an extension of Continuation Coverage), the Plan Administrator shall provide the individual with a written notice of unavailability of coverage explaining the reason for the determination.",
  "Notice of Termination. If Continuation Coverage is terminated before the end of the maximum coverage period, the Plan Administrator shall furnish written notice of the termination to each affected Qualified Beneficiary as soon as practicable following the determination that Continuation Coverage will terminate. The notice shall describe the date of termination, the reason for termination, and any rights the Qualified Beneficiary may have under the Plan or applicable law to elect alternative group or individual coverage.",
];

const QB_NOTICE_PARAGRAPHS = [
  "Each Covered Member or Qualified Beneficiary is responsible for notifying the Plan Administrator of (a) a divorce or legal separation, (b) a Dependent child ceasing to be a Dependent under the terms of the Plan, (c) a determination by the Social Security Administration that a Qualified Beneficiary is disabled or is no longer disabled, and (d) the occurrence of a second Qualifying Event during a period of Continuation Coverage. Notice must be provided to the Plan Administrator in writing within 60 days after the later of the event or the date the Qualified Beneficiary loses (or would lose) coverage as a result of the event. Failure to provide timely notice will result in the loss of the right to Continuation Coverage or the loss of any extension of Continuation Coverage.",
];

const TRADE_ACT_PARAGRAPHS = [
  "A Covered Member who is determined to be eligible for trade adjustment assistance or alternative trade adjustment assistance under the Trade Act of 2002, as amended, and who did not elect Continuation Coverage during the original Election Period, shall have an additional 60-day election period beginning on the first day of the month in which the Covered Member becomes a Trade Act Eligible Individual. Continuation Coverage elected during the additional election period shall begin on the first day of the additional election period and shall not include any period before such date.",
];

const CONSISTENCY_PARAGRAPH =
  "The provisions of this Article are intended to comply with the requirements of COBRA and shall be interpreted and applied in a manner consistent with COBRA and any regulations issued thereunder. To the extent any provision of this Article is inconsistent with COBRA or the regulations issued thereunder, the provisions of COBRA and the regulations shall control.";

// --- DOCX builder ---

export function getCobraDocxParagraphs(): Paragraph[] {
  const p: Paragraph[] = [];
  p.push(docxArticleHeading("COBRA CONTINUATION OF COVERAGE"));
  p.push(docxBody(PREAMBLE));

  p.push(docxSubheading("Definitions"));
  DEFINITIONS.forEach(({ term, body }) => {
    p.push(docxBody(`“${term}” means ${body}`));
  });

  p.push(docxSubheading("Period of Continuation Coverage"));
  PERIOD_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("Premium Requirement"));
  PREMIUM_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("Notices from the Plan Administrator"));
  PA_NOTICE_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("Notices from Covered Members and Qualified Beneficiaries"));
  QB_NOTICE_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("Trade Act Eligible Individuals"));
  TRADE_ACT_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("Consistency with COBRA Regulations"));
  p.push(docxBody(CONSISTENCY_PARAGRAPH));

  return p;
}

// --- PDF builder ---

export function getCobraPDFBuilder(ctx: PDFContext): void {
  pdfArticleHeading(ctx, "COBRA CONTINUATION OF COVERAGE");
  pdfBodyText(ctx, PREAMBLE);

  pdfSubheading(ctx, "Definitions");
  DEFINITIONS.forEach(({ term, body }) => {
    pdfBodyText(ctx, `“${term}” means ${body}`);
  });

  pdfSubheading(ctx, "Period of Continuation Coverage");
  PERIOD_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "Premium Requirement");
  PREMIUM_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "Notices from the Plan Administrator");
  PA_NOTICE_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "Notices from Covered Members and Qualified Beneficiaries");
  QB_NOTICE_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "Trade Act Eligible Individuals");
  TRADE_ACT_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "Consistency with COBRA Regulations");
  pdfBodyText(ctx, CONSISTENCY_PARAGRAPH);
}
