import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
  UnderlineType,
  Packer,
  SectionType,
  Footer,
  PageNumber,
  TabStopType,
  TabStopPosition,
  HorizontalPositionAlign,
} from "docx";

// Sterling style: Arial/Calibri 10-11pt body, clean modern look
export const FONT = "Calibri";
export const FONT_SIZE = 21; // half-points: 21 = 10.5pt
export const HEADING_FONT_SIZE = 28; // 14pt
export const SUBHEADING_SIZE = 24; // 12pt
export const TITLE_SIZE = 36; // 18pt

// --- Title / Cover Page ---

export function coverPage(
  employerName: string,
  addressLine1: string,
  addressLine2: string,
  docTitle: string,
  docSubtitle: string,
  effectiveDate: string,
): Paragraph[] {
  return [
    new Paragraph({ spacing: { before: 6000 } }),
    centeredText(employerName, TITLE_SIZE, true),
    new Paragraph({ spacing: { before: 200 } }),
    centeredText(addressLine1, FONT_SIZE),
    centeredText(addressLine2, FONT_SIZE),
    new Paragraph({ spacing: { before: 800 } }),
    centeredText(docTitle, HEADING_FONT_SIZE, true),
    new Paragraph({ spacing: { before: 200 } }),
    centeredText(docSubtitle, SUBHEADING_SIZE, true),
    new Paragraph({ spacing: { before: 200 } }),
    centeredText(`Effective ${effectiveDate}`, FONT_SIZE),
  ];
}

// --- Section Divider (used between major doc sections) ---

export function sectionDividerPage(title: string): Paragraph[] {
  return [
    new Paragraph({ spacing: { before: 6000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: title,
          font: FONT,
          size: HEADING_FONT_SIZE,
          bold: true,
        }),
      ],
    }),
  ];
}

// --- Headings ---

export function articleHeading(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 480, after: 240 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: SUBHEADING_SIZE,
        bold: true,
      }),
    ],
  });
}

export function sectionTitle(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 320, after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: FONT_SIZE,
        bold: true,
        underline: { type: UnderlineType.SINGLE },
      }),
    ],
  });
}

// --- Numbered definition (e.g. "01. "Administrator" means...") ---

export function definitionItem(
  number: string,
  term: string,
  body: string,
): Paragraph {
  return new Paragraph({
    spacing: { before: 160, after: 80 },
    indent: { left: 460, hanging: 460 },
    children: [
      new TextRun({ text: `${number}. `, font: FONT, size: FONT_SIZE, bold: true }),
      new TextRun({
        text: `"${term}"`,
        font: FONT,
        size: FONT_SIZE,
        bold: true,
        underline: { type: UnderlineType.SINGLE },
      }),
      new TextRun({ text: ` ${body}`, font: FONT, size: FONT_SIZE }),
    ],
  });
}

// --- Body Text ---

export function body(text: string, opts?: { indent?: boolean; bold?: boolean; spacing?: number }): Paragraph {
  return new Paragraph({
    spacing: { before: opts?.spacing ?? 120, after: 80 },
    indent: opts?.indent ? { left: 720 } : undefined,
    children: [
      new TextRun({
        text,
        font: FONT,
        size: FONT_SIZE,
        bold: opts?.bold,
      }),
    ],
  });
}

export function bodyBold(text: string): Paragraph {
  return body(text, { bold: true });
}

// --- Bullets ---

export function bullet(text: string, level: number = 0): Paragraph {
  const indent = 720 + level * 360;
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: indent, hanging: 280 },
    children: [
      new TextRun({ text: `\u2022  ${text}`, font: FONT, size: FONT_SIZE }),
    ],
  });
}

// --- Checkbox items (for forms) ---

export function checkboxItem(text: string, opts?: { bold?: boolean }): Paragraph {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    indent: { left: 460 },
    children: [
      new TextRun({ text: "\u2610  ", font: FONT, size: SUBHEADING_SIZE }),
      new TextRun({
        text,
        font: FONT,
        size: FONT_SIZE,
        bold: opts?.bold,
      }),
    ],
  });
}

// --- Signature Block ---

export function signatureBlock(companyName: string): Paragraph[] {
  return [
    emptyLine(),
    emptyLine(),
    bodyBold(companyName.toUpperCase()),
    emptyLine(),
    labelAndLine("Signature"),
    emptyLine(),
    labelAndLine("Printed Name"),
    emptyLine(),
    labelAndLine("Title"),
    emptyLine(),
    labelAndLine("Date"),
  ];
}

export function dualSignatureBlock(): Paragraph[] {
  return [
    emptyLine(),
    emptyLine(),
    new Paragraph({
      spacing: { before: 80 },
      children: [
        new TextRun({ text: "___________________________________________", font: FONT, size: FONT_SIZE }),
        new TextRun({ text: "          ", font: FONT, size: FONT_SIZE }),
        new TextRun({ text: "_______________", font: FONT, size: FONT_SIZE }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Employee\u2019s Signature", font: FONT, size: FONT_SIZE }),
        new TextRun({ text: "                                                                          ", font: FONT, size: FONT_SIZE }),
        new TextRun({ text: "Date", font: FONT, size: FONT_SIZE }),
      ],
    }),
    emptyLine(),
    emptyLine(),
    new Paragraph({
      spacing: { before: 80 },
      children: [
        new TextRun({ text: "___________________________________________", font: FONT, size: FONT_SIZE }),
        new TextRun({ text: "          ", font: FONT, size: FONT_SIZE }),
        new TextRun({ text: "_______________", font: FONT, size: FONT_SIZE }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Accepted and agreed to by the Employer\u2019s Authorized Representative", font: FONT, size: FONT_SIZE }),
        new TextRun({ text: "     ", font: FONT, size: FONT_SIZE }),
        new TextRun({ text: "Date", font: FONT, size: FONT_SIZE }),
      ],
    }),
  ];
}

// --- Form header (employee name/number fields) ---

export function formHeader(
  companyName: string,
  formTitle: string,
  pyStart: string,
  pyEnd: string,
  planTypeLabel: string = "Section 125 Premium Only Plan",
): Paragraph[] {
  return [
    articleHeading(formTitle),
    emptyLine(),
    body(`For ${companyName}`, { bold: true }),
    body(planTypeLabel),
    body(`Plan Year ${pyStart} through ${pyEnd}`, { bold: true }),
    emptyLine(),
    new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({ text: "Employee Name  ", font: FONT, size: FONT_SIZE, bold: true }),
        new TextRun({ text: "________________________", font: FONT, size: FONT_SIZE }),
        new TextRun({ text: "          Employee Number  ", font: FONT, size: FONT_SIZE, bold: true }),
        new TextRun({ text: "____________", font: FONT, size: FONT_SIZE }),
      ],
    }),
    emptyLine(),
  ];
}

// --- Utilities ---

export function centeredText(text: string, size: number, bold?: boolean): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text, font: FONT, size, bold }),
    ],
  });
}

function labelAndLine(label: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}:  `, font: FONT, size: FONT_SIZE }),
      new TextRun({ text: "___________________________________________", font: FONT, size: FONT_SIZE }),
    ],
  });
}

export function pageBreak(): Paragraph {
  return new Paragraph({ children: [new PageBreak()] });
}

export function emptyLine(): Paragraph {
  return new Paragraph({ spacing: { before: 80, after: 80 }, children: [] });
}

export function horizontalRule(): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 },
    children: [
      new TextRun({
        text: "________________________________________",
        font: FONT,
        size: FONT_SIZE,
        color: "999999",
      }),
    ],
  });
}

// --- Build the final DOCX from an array of sections ---

export async function buildDocx(sections: { paragraphs: Paragraph[]; newPage?: boolean }[]): Promise<Buffer> {
  const docSections = sections.map((s, i) => ({
    properties: {
      ...(i > 0 ? { type: SectionType.NEXT_PAGE } : {}),
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: s.paragraphs,
  }));

  const doc = new Document({ sections: docSections });
  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}

// Simple single-section build (backward compat)
export async function buildDocxSimple(paragraphs: Paragraph[]): Promise<Buffer> {
  return buildDocx([{ paragraphs }]);
}

// --- Cafeteria Adoption Agreement helpers ---

// Renders a checkbox-style line in the JT2 format: "[ X ] text" or "[ ] text"
// Use indent for nested numbered/lettered items.
export function checkboxLine(checked: boolean, text: string, opts?: { indent?: number; bold?: boolean }): Paragraph {
  const indent = opts?.indent ?? 0;
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 360 + indent * 360 },
    children: [
      new TextRun({
        text: checked ? "[ X ]  " : "[  ]  ",
        font: FONT,
        size: FONT_SIZE,
        bold: checked,
      }),
      new TextRun({
        text,
        font: FONT,
        size: FONT_SIZE,
        bold: opts?.bold,
      }),
    ],
  });
}

// Renders a numbered line for the Adoption Agreement (e.g. "1. Name of adopting employer: Acme")
export function numberedLine(number: string, label: string, value: string, opts?: { indent?: number; valueBold?: boolean }): Paragraph {
  const indent = opts?.indent ?? 0;
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 360 + indent * 360, hanging: 360 },
    children: [
      new TextRun({ text: `${number}. `, font: FONT, size: FONT_SIZE, bold: true }),
      new TextRun({ text: `${label}${value ? ":" : ""} `, font: FONT, size: FONT_SIZE }),
      new TextRun({ text: value, font: FONT, size: FONT_SIZE, bold: opts?.valueBold ?? true, underline: value ? { type: UnderlineType.SINGLE } : undefined }),
    ],
  });
}

// Section letter heading (e.g. "A. GENERAL INFORMATION AND DEFINITIONS") underlined
export function legalSection(letter: string, title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 320, after: 120 },
    children: [
      new TextRun({
        text: `${letter}.  ${title.toUpperCase()}`,
        font: FONT,
        size: FONT_SIZE,
        bold: true,
        underline: { type: UnderlineType.SINGLE },
      }),
    ],
  });
}

// A bold inline subheading like "Eligible Employees" or "Carryover"
export function subheading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: FONT_SIZE,
        bold: true,
      }),
    ],
  });
}

// Italic note paragraph like "NOTE: ..."
export function noteText(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
    children: [
      new TextRun({
        text: `NOTE: ${text}`,
        font: FONT,
        size: FONT_SIZE - 1,
        italics: true,
      }),
    ],
  });
}
