import { PDFDocument, PDFPage, PDFFont, StandardFonts, rgb } from "pdf-lib";

const FONT_SIZE = 10.5;
const HEADING_SIZE = 14;
const SUBHEADING_SIZE = 12;
const TITLE_SIZE = 18;
const MARGIN = 72;
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = FONT_SIZE * 1.4;

export interface PDFSection {
  build: (ctx: PDFContext) => void;
}

export interface PDFContext {
  doc: PDFDocument;
  page: PDFPage;
  font: PDFFont;
  fontBold: PDFFont;
  y: number;
  setY: (val: number) => void;
  newPage: () => void;
  ensureSpace: (needed: number) => void;
}

export async function createPDF(sections: PDFSection[]): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const ctx: PDFContext = {
    doc,
    page,
    font,
    fontBold,
    y,
    setY(val: number) {
      ctx.y = val;
    },
    newPage() {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      ctx.page = page;
      ctx.y = PAGE_HEIGHT - MARGIN;
    },
    ensureSpace(needed: number) {
      if (ctx.y - needed < MARGIN) {
        ctx.newPage();
      }
    },
  };

  sections.forEach((section, i) => {
    if (i > 0) ctx.newPage();
    section.build(ctx);
  });

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

// --- Drawing helpers ---

export function coverPage(
  ctx: PDFContext,
  employerName: string,
  addr1: string,
  addr2: string,
  docTitle: string,
  subtitle: string,
  effectiveDate: string,
) {
  ctx.y = PAGE_HEIGHT - 250;
  drawCentered(ctx, employerName, TITLE_SIZE, true);
  ctx.y -= 20;
  drawCentered(ctx, addr1, FONT_SIZE, false);
  ctx.y -= 4;
  drawCentered(ctx, addr2, FONT_SIZE, false);
  ctx.y -= 80;
  drawCentered(ctx, docTitle, HEADING_SIZE, true);
  ctx.y -= 20;
  drawCentered(ctx, subtitle, SUBHEADING_SIZE, true);
  ctx.y -= 20;
  drawCentered(ctx, `Effective ${effectiveDate}`, FONT_SIZE, false);
}

export function articleHeading(ctx: PDFContext, text: string) {
  ctx.ensureSpace(50);
  ctx.y -= 20;
  drawCentered(ctx, text, SUBHEADING_SIZE, true);
  // Horizontal rule
  ctx.y -= 6;
  const lineY = ctx.y;
  ctx.page.drawLine({
    start: { x: MARGIN + 80, y: lineY },
    end: { x: PAGE_WIDTH - MARGIN - 80, y: lineY },
    thickness: 0.5,
    color: rgb(0.6, 0.6, 0.6),
  });
  ctx.y -= 12;
}

export function sectionTitle(ctx: PDFContext, text: string) {
  ctx.ensureSpace(30);
  ctx.y -= 10;
  const f = ctx.fontBold;
  ctx.page.drawText(text, { x: MARGIN, y: ctx.y, size: FONT_SIZE, font: f });
  // Underline
  const textWidth = f.widthOfTextAtSize(text, FONT_SIZE);
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y - 2 },
    end: { x: MARGIN + textWidth, y: ctx.y - 2 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  ctx.y -= LINE_HEIGHT + 4;
}

export function definitionItem(ctx: PDFContext, number: string, term: string, bodyStr: string) {
  ctx.ensureSpace(30);
  ctx.y -= 6;
  const prefix = `${number}. "${term}" `;
  // Draw the prefix bold
  const prefixWidth = ctx.fontBold.widthOfTextAtSize(prefix, FONT_SIZE);
  ctx.page.drawText(prefix, { x: MARGIN + 20, y: ctx.y, size: FONT_SIZE, font: ctx.fontBold });
  // Draw body text wrapped
  drawWrapped(ctx, bodyStr, FONT_SIZE, false, MARGIN + 20 + prefixWidth, CONTENT_WIDTH - 20);
  ctx.y -= 4;
}

export function bodyText(ctx: PDFContext, text: string, opts?: { bold?: boolean; indent?: boolean }) {
  ctx.ensureSpace(20);
  const x = opts?.indent ? MARGIN + 36 : MARGIN;
  const w = opts?.indent ? CONTENT_WIDTH - 36 : CONTENT_WIDTH;
  drawWrapped(ctx, text, FONT_SIZE, opts?.bold, x, w);
  ctx.y -= 4;
}

export function bulletItem(ctx: PDFContext, text: string) {
  ctx.ensureSpace(20);
  const bulletX = MARGIN + 18;
  const textX = MARGIN + 32;
  ctx.page.drawText("\u2022", { x: bulletX, y: ctx.y, size: FONT_SIZE, font: ctx.font });
  drawWrapped(ctx, text, FONT_SIZE, false, textX, CONTENT_WIDTH - 40);
  ctx.y -= 2;
}

export function checkboxItem(ctx: PDFContext, text: string, opts?: { bold?: boolean }) {
  ctx.ensureSpace(20);
  ctx.page.drawRectangle({
    x: MARGIN + 18,
    y: ctx.y - 2,
    width: 10,
    height: 10,
    borderWidth: 0.8,
    borderColor: rgb(0, 0, 0),
    color: rgb(1, 1, 1),
  });
  const f = opts?.bold ? ctx.fontBold : ctx.font;
  ctx.page.drawText(text, { x: MARGIN + 34, y: ctx.y, size: FONT_SIZE, font: f });
  ctx.y -= LINE_HEIGHT + 2;
}

export function signatureBlock(ctx: PDFContext, companyName: string) {
  ctx.y -= 30;
  ctx.ensureSpace(120);
  const f = ctx.fontBold;
  ctx.page.drawText(companyName.toUpperCase(), { x: MARGIN, y: ctx.y, size: FONT_SIZE, font: f });
  ctx.y -= 30;
  drawLabelLine(ctx, "Signature");
  ctx.y -= 20;
  drawLabelLine(ctx, "Printed Name");
  ctx.y -= 20;
  drawLabelLine(ctx, "Title");
  ctx.y -= 20;
  drawLabelLine(ctx, "Date");
}

export function dualSignatureBlock(ctx: PDFContext) {
  ctx.y -= 30;
  ctx.ensureSpace(100);
  ctx.page.drawText("___________________________________________          _______________", { x: MARGIN, y: ctx.y, size: FONT_SIZE, font: ctx.font });
  ctx.y -= LINE_HEIGHT;
  ctx.page.drawText("Employee\u2019s Signature                                                                  Date", { x: MARGIN, y: ctx.y, size: FONT_SIZE, font: ctx.font });
  ctx.y -= 30;
  ctx.page.drawText("___________________________________________          _______________", { x: MARGIN, y: ctx.y, size: FONT_SIZE, font: ctx.font });
  ctx.y -= LINE_HEIGHT;
  ctx.page.drawText("Employer\u2019s Authorized Representative                                      Date", { x: MARGIN, y: ctx.y, size: FONT_SIZE, font: ctx.font });
}

export function formHeader(ctx: PDFContext, companyName: string, formTitle: string, pyStart: string, pyEnd: string) {
  drawCentered(ctx, formTitle, HEADING_SIZE, true);
  ctx.y -= 16;
  bodyText(ctx, `For ${companyName}`, { bold: true });
  bodyText(ctx, "Section 125 Premium Only Plan");
  bodyText(ctx, `Plan Year ${pyStart} through ${pyEnd}`, { bold: true });
  ctx.y -= 8;
  ctx.page.drawText("Employee Name  ________________________          Employee Number  ____________", { x: MARGIN, y: ctx.y, size: FONT_SIZE, font: ctx.fontBold });
  ctx.y -= LINE_HEIGHT + 8;
}

export function emptyLine(ctx: PDFContext) {
  ctx.y -= LINE_HEIGHT;
}

// --- Internal drawing utilities ---

function drawCentered(ctx: PDFContext, text: string, size: number, bold: boolean) {
  const f = bold ? ctx.fontBold : ctx.font;
  const textWidth = f.widthOfTextAtSize(text, size);
  const x = (PAGE_WIDTH - textWidth) / 2;
  ctx.page.drawText(text, { x, y: ctx.y, size, font: f });
  ctx.y -= size * 1.4;
}

function drawLabelLine(ctx: PDFContext, label: string) {
  ctx.page.drawText(`${label}:  ___________________________________________`, {
    x: MARGIN,
    y: ctx.y,
    size: FONT_SIZE,
    font: ctx.font,
  });
  ctx.y -= LINE_HEIGHT;
}

function drawWrapped(ctx: PDFContext, text: string, size: number, bold: boolean | undefined, startX: number, maxWidth: number) {
  const f = bold ? ctx.fontBold : ctx.font;
  const words = text.split(" ");
  let line = "";
  let x = startX;
  let firstLine = true;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const testWidth = f.widthOfTextAtSize(testLine, size);

    if (testWidth > (firstLine ? maxWidth - (startX - MARGIN) : maxWidth) && line) {
      ctx.ensureSpace(LINE_HEIGHT);
      ctx.page.drawText(line, { x, y: ctx.y, size, font: f });
      ctx.y -= LINE_HEIGHT;
      line = word;
      x = MARGIN;
      firstLine = false;
    } else {
      line = testLine;
    }
  }

  if (line) {
    ctx.ensureSpace(LINE_HEIGHT);
    ctx.page.drawText(line, { x, y: ctx.y, size, font: f });
    ctx.y -= LINE_HEIGHT;
  }
}
