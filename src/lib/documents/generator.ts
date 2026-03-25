import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import type { FormData } from "@/types";
import { buildDocx, pageBreak } from "./docx/docx-builder";
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

  // Save files
  const outputDir = join(process.cwd(), "public", "generated", docSetId);
  await mkdir(outputDir, { recursive: true });

  const docxFilename = `${employerSlug}_Premium_Only_Plan.docx`;
  const pdfFilename = `${employerSlug}_Premium_Only_Plan.pdf`;

  await Promise.all([
    writeFile(join(outputDir, docxFilename), docxBuffer),
    writeFile(join(outputDir, pdfFilename), pdfBuffer),
  ]);

  const docxUrl = `/generated/${docSetId}/${docxFilename}`;
  const pdfUrl = `/generated/${docSetId}/${pdfFilename}`;

  return { docxUrl, pdfUrl };
}
