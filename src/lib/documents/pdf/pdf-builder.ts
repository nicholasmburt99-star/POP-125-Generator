import PDFDocument from "pdfkit";

const FONT = "Helvetica";
const FONT_BOLD = "Helvetica-Bold";
const FONT_SIZE = 10.5;
const HEADING_SIZE = 14;
const SUBHEADING_SIZE = 12;
const TITLE_SIZE = 18;
const MARGIN = 72; // 1 inch
const PAGE_WIDTH = 612; // Letter
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

export interface PDFSection {
  build: (doc: InstanceType<typeof PDFDocument>) => void;
}

export function createPDF(sections: PDFSection[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      bufferPages: true,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    sections.forEach((section, i) => {
      if (i > 0) doc.addPage();
      section.build(doc);
    });

    doc.end();
  });
}

// --- Helper functions that write directly to a PDFDocument ---

export function coverPage(
  doc: InstanceType<typeof PDFDocument>,
  employerName: string,
  addr1: string,
  addr2: string,
  docTitle: string,
  subtitle: string,
  effectiveDate: string,
) {
  doc.moveDown(12);
  doc.font(FONT_BOLD).fontSize(TITLE_SIZE).text(employerName, { align: "center" });
  doc.moveDown(0.5);
  doc.font(FONT).fontSize(FONT_SIZE).text(addr1, { align: "center" });
  doc.text(addr2, { align: "center" });
  doc.moveDown(3);
  doc.font(FONT_BOLD).fontSize(HEADING_SIZE).text(docTitle, { align: "center" });
  doc.moveDown(0.5);
  doc.font(FONT_BOLD).fontSize(SUBHEADING_SIZE).text(subtitle, { align: "center" });
  doc.moveDown(0.5);
  doc.font(FONT).fontSize(FONT_SIZE).text(`Effective ${effectiveDate}`, { align: "center" });
}

export function articleHeading(doc: InstanceType<typeof PDFDocument>, text: string) {
  ensureSpace(doc, 60);
  doc.moveDown(1);
  doc.font(FONT_BOLD).fontSize(SUBHEADING_SIZE).text(text, { align: "center" });
  // Horizontal rule
  const y = doc.y + 4;
  doc.moveTo(MARGIN + 80, y).lineTo(PAGE_WIDTH - MARGIN - 80, y).strokeColor("#999999").lineWidth(0.5).stroke();
  doc.moveDown(0.8);
}

export function sectionTitle(doc: InstanceType<typeof PDFDocument>, text: string) {
  ensureSpace(doc, 40);
  doc.moveDown(0.5);
  doc.font(FONT_BOLD).fontSize(FONT_SIZE).text(text, { underline: true });
  doc.moveDown(0.3);
}

export function definitionItem(
  doc: InstanceType<typeof PDFDocument>,
  number: string,
  term: string,
  bodyText: string,
) {
  ensureSpace(doc, 30);
  doc.moveDown(0.3);
  const startX = MARGIN + 30;
  doc.font(FONT_BOLD).fontSize(FONT_SIZE).text(`${number}. `, MARGIN, doc.y, { continued: true });
  doc.font(FONT_BOLD).text(`"${term}" `, { continued: true, underline: true });
  doc.font(FONT).text(bodyText, { underline: false, width: CONTENT_WIDTH - 30, indent: 0 });
  doc.moveDown(0.2);
}

export function bodyText(doc: InstanceType<typeof PDFDocument>, text: string, opts?: { bold?: boolean; indent?: boolean }) {
  ensureSpace(doc, 20);
  const x = opts?.indent ? MARGIN + 36 : MARGIN;
  const w = opts?.indent ? CONTENT_WIDTH - 36 : CONTENT_WIDTH;
  doc.font(opts?.bold ? FONT_BOLD : FONT).fontSize(FONT_SIZE).text(text, x, doc.y, { width: w });
  doc.moveDown(0.3);
}

export function bulletItem(doc: InstanceType<typeof PDFDocument>, text: string) {
  ensureSpace(doc, 20);
  const bulletX = MARGIN + 18;
  const textX = MARGIN + 32;
  doc.font(FONT).fontSize(FONT_SIZE).text("\u2022", bulletX, doc.y, { continued: false });
  doc.font(FONT).fontSize(FONT_SIZE).text(text, textX, doc.y - doc.currentLineHeight(), { width: CONTENT_WIDTH - 40 });
  doc.moveDown(0.15);
}

export function checkboxItem(doc: InstanceType<typeof PDFDocument>, text: string, opts?: { bold?: boolean }) {
  ensureSpace(doc, 20);
  doc.font(FONT).fontSize(SUBHEADING_SIZE).text("\u2610", MARGIN + 18, doc.y, { continued: true });
  doc.font(opts?.bold ? FONT_BOLD : FONT).fontSize(FONT_SIZE).text(`  ${text}`);
  doc.moveDown(0.15);
}

export function signatureBlock(doc: InstanceType<typeof PDFDocument>, companyName: string) {
  doc.moveDown(2);
  doc.font(FONT_BOLD).fontSize(FONT_SIZE).text(companyName.toUpperCase());
  doc.moveDown(1.5);
  labelAndLine(doc, "Signature");
  doc.moveDown(1);
  labelAndLine(doc, "Printed Name");
  doc.moveDown(1);
  labelAndLine(doc, "Title");
  doc.moveDown(1);
  labelAndLine(doc, "Date");
}

export function dualSignatureBlock(doc: InstanceType<typeof PDFDocument>) {
  doc.moveDown(2);
  doc.font(FONT).fontSize(FONT_SIZE);
  doc.text("___________________________________________          _______________");
  doc.text("Employee\u2019s Signature                                                                          Date");
  doc.moveDown(1.5);
  doc.text("___________________________________________          _______________");
  doc.text("Accepted and agreed to by the Employer\u2019s Authorized Representative     Date");
}

export function formHeader(
  doc: InstanceType<typeof PDFDocument>,
  companyName: string,
  formTitle: string,
  pyStart: string,
  pyEnd: string,
) {
  doc.font(FONT_BOLD).fontSize(HEADING_SIZE).text(formTitle, { align: "center" });
  doc.moveDown(0.8);
  doc.font(FONT_BOLD).fontSize(FONT_SIZE).text(`For ${companyName}`);
  doc.font(FONT).text("Section 125 Premium Only Plan");
  doc.font(FONT_BOLD).text(`Plan Year ${pyStart} through ${pyEnd}`);
  doc.moveDown(0.5);
  doc.font(FONT_BOLD).fontSize(FONT_SIZE).text("Employee Name  ", { continued: true });
  doc.font(FONT).text("________________________          ", { continued: true });
  doc.font(FONT_BOLD).text("Employee Number  ", { continued: true });
  doc.font(FONT).text("____________");
  doc.moveDown(0.8);
}

function labelAndLine(doc: InstanceType<typeof PDFDocument>, label: string) {
  doc.font(FONT).fontSize(FONT_SIZE).text(`${label}:  ___________________________________________`);
}

function ensureSpace(doc: InstanceType<typeof PDFDocument>, needed: number) {
  const bottomMargin = MARGIN;
  const pageHeight = 792; // Letter height
  if (doc.y + needed > pageHeight - bottomMargin) {
    doc.addPage();
  }
}

export function emptyLine(doc: InstanceType<typeof PDFDocument>) {
  doc.moveDown(0.5);
}

export function pageBreak(doc: InstanceType<typeof PDFDocument>) {
  doc.addPage();
}
