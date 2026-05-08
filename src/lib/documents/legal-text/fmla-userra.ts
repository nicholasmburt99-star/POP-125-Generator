// FMLA and USERRA continuation provisions for group health benefits offered
// through this Plan. Identical text used by POP and Cafeteria, DOCX and PDF.

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

const FMLA_INTRO =
  "If the Employer is subject to the Family and Medical Leave Act of 1993, as amended (“FMLA”), and a Participant takes a leave of absence that qualifies as FMLA leave, the Participant may continue group health coverage under this Plan during the FMLA leave on the same terms as if the Participant had continued working. The Participant remains responsible for the Participant’s share of any required premium during the FMLA leave.";

const FMLA_PAYMENT_PARAGRAPHS = [
  "Pre-Pay Option. The Participant may elect to pre-pay the Participant’s share of premiums on a pre-tax basis (subject to applicable limits) before the FMLA leave begins, with such pre-payment treated as a salary reduction made under the Plan.",
  "Pay-as-You-Go Option. The Participant may elect to pay the Participant’s share of premiums on the same schedule as if the Participant were continuing to work, on an after-tax basis, by submitting payment directly to the Plan Administrator on or before the date premiums are due.",
  "Catch-Up Option. With the agreement of the Plan Administrator and the Participant, payment of the Participant’s share of premiums may be advanced by the Employer during the FMLA leave, with the Participant repaying the Employer (on a pre-tax basis through salary reduction or, if necessary, on an after-tax basis) upon return from the FMLA leave.",
];

const FMLA_REINSTATEMENT_PARAGRAPH =
  "If the Participant fails to return from FMLA leave, the Employer may recover the Participant’s share of premiums paid by the Employer during the FMLA leave to the extent permitted by FMLA. A Participant who returns to work following an FMLA leave shall be reinstated in coverage on the same terms as before the leave, with no waiting period and no requalification requirements, except as otherwise permitted by FMLA.";

const USERRA_INTRO =
  "If a Participant is absent from work by reason of service in the uniformed services, the Participant and the Participant’s covered Dependents may elect to continue group health coverage under this Plan in accordance with the Uniformed Services Employment and Reemployment Rights Act of 1994, as amended (“USERRA”).";

const USERRA_PARAGRAPHS = [
  "USERRA continuation coverage may be elected for a period of up to 24 months from the date the Participant’s absence for uniformed service begins, or, if shorter, the period beginning on the date the Participant’s absence begins and ending on the day after the Participant fails to apply for or return to a position of employment as required under USERRA.",
  "If the period of uniformed service is less than 31 days, the Participant cannot be required to pay more than the Participant’s share of premiums (i.e., the same employee share that applied immediately before the leave). If the period of uniformed service is 31 days or more, the Participant may be required to pay up to 102% of the full premium for the coverage elected.",
  "Upon completion of uniformed service and reemployment in accordance with USERRA, the Participant shall be reinstated in coverage with no waiting period and no exclusion for conditions arising during or before the uniformed service (other than for an injury or illness determined by the Secretary of Veterans Affairs to have been incurred in, or aggravated during, performance of uniformed service).",
];

// --- DOCX builder ---

export function getFmlaUserraDocxParagraphs(): Paragraph[] {
  const p: Paragraph[] = [];
  p.push(docxArticleHeading("FMLA AND USERRA CONTINUATION OF COVERAGE"));

  p.push(docxSubheading("Family and Medical Leave Act (FMLA)"));
  p.push(docxBody(FMLA_INTRO));
  p.push(docxBody("During an FMLA leave, the Participant may pay the Participant’s share of premiums under any of the following options offered by the Plan Administrator:"));
  FMLA_PAYMENT_PARAGRAPHS.forEach((t) => p.push(docxBody(t, { indent: true })));
  p.push(docxBody(FMLA_REINSTATEMENT_PARAGRAPH));

  p.push(docxSubheading("Uniformed Services Employment and Reemployment Rights Act (USERRA)"));
  p.push(docxBody(USERRA_INTRO));
  USERRA_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  return p;
}

// --- PDF builder ---

export function getFmlaUserraPDFBuilder(ctx: PDFContext): void {
  pdfArticleHeading(ctx, "FMLA AND USERRA CONTINUATION OF COVERAGE");

  pdfSubheading(ctx, "Family and Medical Leave Act (FMLA)");
  pdfBodyText(ctx, FMLA_INTRO);
  pdfBodyText(ctx, "During an FMLA leave, the Participant may pay the Participant’s share of premiums under any of the following options offered by the Plan Administrator:");
  FMLA_PAYMENT_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t, { indent: true }));
  pdfBodyText(ctx, FMLA_REINSTATEMENT_PARAGRAPH);

  pdfSubheading(ctx, "Uniformed Services Employment and Reemployment Rights Act (USERRA)");
  pdfBodyText(ctx, USERRA_INTRO);
  USERRA_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));
}
