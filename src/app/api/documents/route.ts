import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAllDocuments } from "@/lib/documents/generator";
import { getOrCreateDefaultUser } from "@/lib/default-user";

export async function GET() {
  const documents = await prisma.documentSet.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  return NextResponse.json(documents);
}

export async function POST(request: Request) {
  const user = await getOrCreateDefaultUser();

  try {
    const formData = await request.json();

    const docSet = await prisma.documentSet.create({
      data: {
        createdById: user.id,
        employerName: formData.employer.legalBusinessName,
        employerEin: formData.employer.ein,
        formData: formData,
        status: "generating",
      },
    });

    try {
      const { docxUrl, pdfUrl } = await generateAllDocuments(formData, docSet.id);

      await prisma.documentSet.update({
        where: { id: docSet.id },
        data: {
          docxBlobUrl: docxUrl,
          pdfBlobUrl: pdfUrl,
          status: "complete",
        },
      });
    } catch (genError) {
      await prisma.documentSet.update({
        where: { id: docSet.id },
        data: { status: "error" },
      });
      throw genError;
    }

    const updated = await prisma.documentSet.findUnique({
      where: { id: docSet.id },
    });

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : "";
    console.error("Document generation error:", message, stack);
    return NextResponse.json(
      { error: `Failed to generate documents: ${message}` },
      { status: 500 }
    );
  }
}
