import { put } from "@vercel/blob";
import type { FormData } from "@/types";
import { buildDocx } from "./docx/docx-builder";
import { buildPlanDocumentParagraphs } from "./docx/plan-document";
import { buildSPDParagraphs } from "./docx/spd";
import {
  buildElectionToParticipateParagraphs,
  buildElectionToNotParticipateParagraphs,
  buildRevocationFormParagraphs,
  buildChangeInStatusFormParagraphs,
} from "./docx/forms";
import { createPDF, type PDFSection } from "./pdf/pdf-builder";
import { buildPlanDocumentPDFSections } from "./pdf/plan-document";
import { buildSPDPDFSections } from "./pdf/spd";
import {
  buildElectionToParticipatePDF,
  buildElectionToNotParticipatePDF,
  buildRevocationFormPDF,
  buildChangeInStatusFormPDF,
} from "./pdf/forms";

interface GenerationResult {
  docxUrl: string;
  pdfUrl: string;
}

export async function generateAllDocuments(
  formData: FormData,
  docSetId: string,
): Promise<GenerationResult> {
  const employerSlug = formData.employer.legalBusinessName
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 40);

  // --- DOCX ---
  const planDocParagraphs = buildPlanDocumentParagraphs(formData);
  const spdParagraphs = buildSPDParagraphs(formData);

  const docxSections: { paragraphs: typeof planDocParagraphs }[] = [
    { paragraphs: planDocParagraphs },
    { paragraphs: spdParagraphs },
  ];

  if (formData.elections.includeElectionForms) {
    docxSections.push({ paragraphs: buildElectionToParticipateParagraphs(formData) });
    docxSections.push({ paragraphs: buildElectionToNotParticipateParagraphs(formData) });
    docxSections.push({ paragraphs: buildRevocationFormParagraphs(formData) });
    docxSections.push({ paragraphs: buildChangeInStatusFormParagraphs(formData) });
  }

  const docxBuffer = await buildDocx(docxSections);

  // --- PDF ---
  const pdfSections: PDFSection[] = [
    ...buildPlanDocumentPDFSections(formData),
    ...buildSPDPDFSections(formData),
  ];

  if (formData.elections.includeElectionForms) {
    pdfSections.push(buildElectionToParticipatePDF(formData));
    pdfSections.push(buildElectionToNotParticipatePDF(formData));
    pdfSections.push(buildRevocationFormPDF(formData));
    pdfSections.push(buildChangeInStatusFormPDF(formData));
  }

  const pdfBuffer = await createPDF(pdfSections);

  // --- Upload to Vercel Blob ---
  const docxFilename = `${docSetId}/${employerSlug}_Premium_Only_Plan.docx`;
  const pdfFilename = `${docSetId}/${employerSlug}_Premium_Only_Plan.pdf`;

  const [docxBlob, pdfBlob] = await Promise.all([
    put(docxFilename, docxBuffer, {
      access: "public",
      contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }),
    put(pdfFilename, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
    }),
  ]);

  return {
    docxUrl: docxBlob.url,
    pdfUrl: pdfBlob.url,
  };
}
