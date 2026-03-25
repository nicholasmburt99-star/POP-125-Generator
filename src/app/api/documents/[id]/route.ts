import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateAllDocuments } from "@/lib/documents/generator";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const doc = await prisma.documentSet.findUnique({ where: { id } });
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(doc);
}

// PUT: update form data and regenerate documents
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const formData = await request.json();

  try {
    // Update the record to generating status
    await prisma.documentSet.update({
      where: { id },
      data: {
        employerName: formData.employer.legalBusinessName,
        employerEin: formData.employer.ein,
        formData: formData,
        status: "generating",
      },
    });

    // Regenerate documents
    const { docxUrl, pdfUrl } = await generateAllDocuments(formData, id);

    const updated = await prisma.documentSet.update({
      where: { id },
      data: {
        docxBlobUrl: docxUrl,
        pdfBlobUrl: pdfUrl,
        status: "complete",
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Regeneration error:", message);

    await prisma.documentSet.update({
      where: { id },
      data: { status: "error" },
    });

    return NextResponse.json(
      { error: `Failed to regenerate: ${message}` },
      { status: 500 }
    );
  }
}
