// Qualified Medical Child Support Order (QMCSO) procedures — required written
// procedures under ERISA §609(a). Identical text used by POP and Cafeteria,
// DOCX and PDF.

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

const INTRO_PARAGRAPH =
  "The Plan Administrator shall establish reasonable written procedures for determining whether a medical child support order is a Qualified Medical Child Support Order (“QMCSO”) and for administering benefits under any QMCSO, in accordance with Section 609 of ERISA. The following definitions and procedures shall apply.";

const DEFINITIONS: Array<{ term: string; body: string }> = [
  {
    term: "Alternate Recipient",
    body: "any child of a Participant who is recognized under a Medical Child Support Order as having a right to enrollment under a group health plan with respect to the Participant.",
  },
  {
    term: "Child",
    body: "the natural child, adopted child, or child placed for adoption with a Participant.",
  },
  {
    term: "Medical Child Support Order (MCSO)",
    body: "any judgment, decree, or order (including approval of a settlement agreement) that (a) provides for child support with respect to a child of a Participant under a group health plan or provides for health benefit coverage to such a child, is ordered under State domestic relations law (including a community property law), and relates to benefits under such plan; or (b) enforces a State law relating to medical child support described in Section 1908 of the Social Security Act with respect to a group health plan.",
  },
  {
    term: "National Medical Support Notice (NMSN)",
    body: "a notice issued by a State child support enforcement agency that meets the requirements of Section 401 of the Child Support Performance and Incentive Act of 1998 and Section 609(a)(5)(C) of ERISA, and that is treated as a Qualified Medical Child Support Order if it satisfies those requirements.",
  },
  {
    term: "Qualified Medical Child Support Order (QMCSO)",
    body: "a Medical Child Support Order which creates or recognizes the existence of an Alternate Recipient’s right, or assigns to an Alternate Recipient the right, to receive benefits for which a Participant is eligible under the Plan, and which the Plan Administrator has determined satisfies the requirements of Section 609 of ERISA.",
  },
];

const REQUIRED_CONTENT_PARAGRAPHS = [
  "A Medical Child Support Order will be deemed a QMCSO only if it clearly specifies (a) the name and last known mailing address (if any) of the Participant and the name and mailing address of each Alternate Recipient covered by the order (substitution of the address of a State or local official is permitted); (b) a reasonable description of the type of coverage to be provided to each Alternate Recipient, or the manner in which such type of coverage is to be determined; (c) the period to which the order applies; and (d) each plan to which the order applies.",
  "A Medical Child Support Order shall not be deemed a QMCSO if it requires the Plan to provide any type or form of benefit, or any option, not otherwise provided under the Plan, except to the extent necessary to meet the requirements of a State law described in Section 1908 of the Social Security Act.",
];

const PROCEDURES_PARAGRAPHS = [
  "Upon receipt of a Medical Child Support Order, the Plan Administrator shall promptly notify the Participant and each Alternate Recipient named in the order (or their designated representatives) of the receipt of the order and the Plan’s procedures for determining whether the order is a QMCSO.",
  "Within a reasonable period after receipt of the order, the Plan Administrator shall determine whether the order is a QMCSO and shall notify the Participant and each Alternate Recipient (or their designated representatives) of the determination. If the order is determined to be a QMCSO, the Plan Administrator shall enroll the Alternate Recipient(s) under the Plan in accordance with the order and shall treat them as covered Dependents of the Participant for purposes of eligibility, claims, appeals, and continuation coverage.",
  "During any period in which the qualified status of a Medical Child Support Order is being determined, the Plan Administrator shall defer enrollment of the Alternate Recipient under the Plan until the determination is made. If the order is determined to be a QMCSO, the Plan Administrator shall enroll the Alternate Recipient retroactively to the date the order required coverage to begin, to the extent permitted by the applicable Insurance Contract. If the order is determined not to be a QMCSO, the Plan Administrator shall notify the parties of the determination in writing, and no enrollment of the Alternate Recipient shall occur pursuant to the order.",
];

const NMSN_PARAGRAPHS = [
  "A National Medical Support Notice that meets the requirements of Section 609(a)(5)(C) of ERISA shall be treated as a QMCSO. Upon receipt of an NMSN, the Plan Administrator shall, within 40 business days after the date of the notice (or earlier if reasonable), (a) notify the State child support enforcement agency that issued the notice whether coverage of the Alternate Recipient is available under the terms of the Plan and, if so, whether the Alternate Recipient is covered as a result of the notice and the effective date of coverage, and (b) furnish the Alternate Recipient (and the custodial parent, legal guardian, or State official acting on the Alternate Recipient’s behalf) a description of the coverage available and any forms or documents necessary to effectuate the coverage.",
  "If the Plan provides multiple coverage options, and neither the NMSN nor the custodial parent (or relevant State agency) selects a coverage option within a reasonable period of time, the Plan Administrator shall enroll the Alternate Recipient in the Plan’s default option, if any, or in a coverage option determined by the Plan Administrator to be appropriate.",
];

const PAYMENT_PARAGRAPHS = [
  "Any payment for benefits made by the Plan pursuant to a QMCSO in reimbursement for expenses paid by an Alternate Recipient or the Alternate Recipient’s custodial parent or legal guardian shall be made to the Alternate Recipient or the Alternate Recipient’s custodial parent or legal guardian.",
];

const FIDUCIARY_PARAGRAPH =
  "A Plan fiduciary who acts in accordance with the procedures described in this Article shall be deemed to have satisfied his or her fiduciary duties under ERISA with respect to the Plan’s administration of medical child support orders. The Plan Administrator shall provide, free of charge, a copy of the Plan’s QMCSO procedures to any Participant or Alternate Recipient upon request.";

// --- DOCX builder ---

export function getQmcsoDocxParagraphs(): Paragraph[] {
  const p: Paragraph[] = [];
  p.push(docxArticleHeading("QUALIFIED MEDICAL CHILD SUPPORT ORDERS"));
  p.push(docxBody(INTRO_PARAGRAPH));

  p.push(docxSubheading("Definitions"));
  DEFINITIONS.forEach(({ term, body }) => {
    p.push(docxBody(`“${term}” means ${body}`));
  });

  p.push(docxSubheading("Required Content of a Medical Child Support Order"));
  REQUIRED_CONTENT_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("Plan Procedures Upon Receipt of a Medical Child Support Order"));
  PROCEDURES_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("National Medical Support Notices"));
  NMSN_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("Payments to Alternate Recipient or Custodial Parent"));
  PAYMENT_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("Fiduciary Discharge"));
  p.push(docxBody(FIDUCIARY_PARAGRAPH));

  return p;
}

// --- PDF builder ---

export function getQmcsoPDFBuilder(ctx: PDFContext): void {
  pdfArticleHeading(ctx, "QUALIFIED MEDICAL CHILD SUPPORT ORDERS");
  pdfBodyText(ctx, INTRO_PARAGRAPH);

  pdfSubheading(ctx, "Definitions");
  DEFINITIONS.forEach(({ term, body }) => {
    pdfBodyText(ctx, `“${term}” means ${body}`);
  });

  pdfSubheading(ctx, "Required Content of a Medical Child Support Order");
  REQUIRED_CONTENT_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "Plan Procedures Upon Receipt of a Medical Child Support Order");
  PROCEDURES_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "National Medical Support Notices");
  NMSN_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "Payments to Alternate Recipient or Custodial Parent");
  PAYMENT_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "Fiduciary Discharge");
  pdfBodyText(ctx, FIDUCIARY_PARAGRAPH);
}
