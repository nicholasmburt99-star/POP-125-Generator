import { put } from "@vercel/blob";
import type { FormData } from "@/types";
import { buildDocx } from "./docx/docx-builder";
import { buildPlanDocumentParagraphs } from "./docx/plan-document";
import { buildSPDParagraphs } from "./docx/spd";
import { buildCafeteriaPlanParagraphs } from "./docx/cafeteria-plan";
import { buildCafeteriaSPDParagraphs } from "./docx/cafeteria-spd";
import { createPDF, type PDFSection } from "./pdf/pdf-builder";
import { buildPlanDocumentPDFSections } from "./pdf/plan-document";
import { buildSPDPDFSections } from "./pdf/spd";
import { buildCafeteriaPlanPDFSections } from "./pdf/cafeteria-plan";
import { buildCafeteriaSPDPDFSections } from "./pdf/cafeteria-spd";

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

  const isCafeteria = formData.plan.planType === "cafeteria";
  const planLabelForFile = isCafeteria ? "Cafeteria_Plan" : "Premium_Only_Plan";

  // --- DOCX ---
  const docxSections: { paragraphs: ReturnType<typeof buildPlanDocumentParagraphs> }[] = [];

  if (isCafeteria) {
    docxSections.push({ paragraphs: buildCafeteriaPlanParagraphs(formData) });
    docxSections.push({ paragraphs: buildCafeteriaSPDParagraphs(formData) });
  } else {
    docxSections.push({ paragraphs: buildPlanDocumentParagraphs(formData) });
    docxSections.push({ paragraphs: buildSPDParagraphs(formData) });
  }

  const docxBuffer = await buildDocx(docxSections);

  // --- PDF ---
  const pdfSections: PDFSection[] = [];

  if (isCafeteria) {
    pdfSections.push(...buildCafeteriaPlanPDFSections(formData));
    pdfSections.push(...buildCafeteriaSPDPDFSections(formData));
  } else {
    pdfSections.push(...buildPlanDocumentPDFSections(formData));
    pdfSections.push(...buildSPDPDFSections(formData));
  }

  const pdfBuffer = await createPDF(pdfSections);

  // --- Upload to Vercel Blob ---
  // Use timestamp to bust CDN cache on regeneration
  const ts = Date.now();
  const docxFilename = `${docSetId}/${employerSlug}_${planLabelForFile}_${ts}.docx`;
  const pdfFilename = `${docSetId}/${employerSlug}_${planLabelForFile}_${ts}.pdf`;

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
