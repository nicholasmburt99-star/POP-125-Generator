import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateAllDocuments } from "@/lib/documents/generator";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const documents = await prisma.documentSet.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  return NextResponse.json(documents);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const formData = await request.json();

    // Create document set record
    const docSet = await prisma.documentSet.create({
      data: {
        createdById: user.id,
        employerName: formData.employer.legalBusinessName,
        employerEin: formData.employer.ein,
        formData: JSON.stringify(formData),
        status: "generating",
      },
    });

    // Generate documents
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
    console.error("Document generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate documents" },
      { status: 500 }
    );
  }
}
