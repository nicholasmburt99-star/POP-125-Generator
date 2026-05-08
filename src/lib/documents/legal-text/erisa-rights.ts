// Statement of ERISA Rights — federally required language for ERISA welfare plan SPDs.
// The text follows the model language from Department of Labor guidance and the Bancover
// reference document. Identical for POP and Cafeteria plans, DOCX and PDF.

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

// --- Content (text) ---

const RECEIVE_INFO_PARAGRAPHS = [
  "Examine, without charge, at the plan administrator's office and at other specified locations, such as worksites and union halls, all documents governing the plan, including insurance contracts and collective bargaining agreements, and a copy of the latest annual report (Form 5500 Series) filed by the plan with the U.S. Department of Labor and available at the Public Disclosure Room of the Employee Benefits Security Administration.",
  "Obtain, upon written request to the plan administrator, copies of documents governing the operation of the plan, including insurance contracts and collective bargaining agreements, and copies of the latest annual report (Form 5500 Series) and updated summary plan description. The administrator may make a reasonable charge for the copies.",
  "Receive a summary of the plan's annual financial report if the plan has at least 100 participants. The plan administrator is required by law to furnish each participant of such a plan with a copy of this summary annual report.",
];

const CONTINUE_GROUP_HEALTH_PARAGRAPHS = [
  "Continue health care coverage for yourself, your spouse, or your dependent children if there is a loss of coverage under the plan as a result of a qualifying event. You or your dependents may have to pay for such coverage. Review the summary plan description and the documents governing the medical plan, dental plan, and vision plan for the rules governing your COBRA continuation coverage rights.",
];

const PRUDENT_ACTIONS_PARAGRAPHS = [
  "In addition to creating rights for plan participants, ERISA imposes duties upon the people who are responsible for the operation of the employee benefit plan. The people who operate your plan, called “fiduciaries” of the plan, have a duty to do so prudently and in the interest of you and other plan participants and beneficiaries. No one, including your employer, your union, or any other person, may fire you or otherwise discriminate against you in any way to prevent you from obtaining a welfare benefit or exercising your rights under ERISA.",
];

const ENFORCE_RIGHTS_PARAGRAPHS = [
  "If your claim for a welfare benefit is denied or ignored, in whole or in part, you have a right to know why this was done, to obtain copies of documents relating to the decision without charge, and to appeal any denial, all within certain time schedules.",
  "Under ERISA, there are steps you can take to enforce the above rights. For instance, if you request a copy of plan documents or the latest annual report from the plan and do not receive them within 30 days, you may file suit in a Federal court. In such a case, the court may require the plan administrator to provide the materials and pay you up to $110 a day until you receive the materials, unless the materials were not sent because of reasons beyond the control of the administrator. If you have a claim for benefits which is denied or ignored, in whole or in part, you may file suit in a state or Federal court. In addition, if you disagree with the plan's decision or lack thereof concerning the qualified status of a medical child support order, you may file suit in Federal court. Participants and beneficiaries can obtain, without charge, a copy of the procedures governing qualified medical child support order determinations from the plan administrator. If it should happen that plan fiduciaries misuse the plan's money, or if you are discriminated against for asserting your rights, you may seek assistance from the U.S. Department of Labor, or you may file suit in a Federal court. The court will decide who should pay court costs and legal fees. If you are successful the court may order the person you have sued to pay these costs and fees. If you lose, the court may order you to pay these costs and fees, for example, if it finds your claim is frivolous.",
];

const ASSISTANCE_PARAGRAPHS = [
  "If you have any questions about your plan, you should contact the plan administrator. If you have any questions about this statement or about your rights under ERISA, or if you need assistance in obtaining documents from the plan administrator, you should contact the nearest office of the Employee Benefits Security Administration, U.S. Department of Labor, listed in your telephone directory or the Division of Technical Assistance and Inquiries, Employee Benefits Security Administration, U.S. Department of Labor, 200 Constitution Avenue N.W., Washington, D.C. 20210. You may also obtain certain publications about your rights and responsibilities under ERISA by calling the publications hotline of the Employee Benefits Security Administration.",
];

const INTRO_PARAGRAPH =
  "As a Participant in the Plan, you are entitled to certain rights and protections under the Employee Retirement Income Security Act of 1974 (“ERISA”). ERISA provides that all Plan Participants shall be entitled to:";

// --- DOCX builder ---

export function getErisaRightsDocxParagraphs(): Paragraph[] {
  const p: Paragraph[] = [];
  p.push(docxArticleHeading("STATEMENT OF ERISA RIGHTS"));
  p.push(docxBody(INTRO_PARAGRAPH));

  p.push(docxSubheading("Receive Information About Your Plan and Benefits"));
  RECEIVE_INFO_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("Continue Group Health Plan Coverage"));
  CONTINUE_GROUP_HEALTH_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("Prudent Actions by Plan Fiduciaries"));
  PRUDENT_ACTIONS_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("Enforce Your Rights"));
  ENFORCE_RIGHTS_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  p.push(docxSubheading("Assistance with Your Questions"));
  ASSISTANCE_PARAGRAPHS.forEach((t) => p.push(docxBody(t)));

  return p;
}

// --- PDF builder ---

export function getErisaRightsPDFBuilder(ctx: PDFContext): void {
  pdfArticleHeading(ctx, "STATEMENT OF ERISA RIGHTS");
  pdfBodyText(ctx, INTRO_PARAGRAPH);

  pdfSubheading(ctx, "Receive Information About Your Plan and Benefits");
  RECEIVE_INFO_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "Continue Group Health Plan Coverage");
  CONTINUE_GROUP_HEALTH_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "Prudent Actions by Plan Fiduciaries");
  PRUDENT_ACTIONS_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "Enforce Your Rights");
  ENFORCE_RIGHTS_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));

  pdfSubheading(ctx, "Assistance with Your Questions");
  ASSISTANCE_PARAGRAPHS.forEach((t) => pdfBodyText(ctx, t));
}
