import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, ArrowLeft, FileText, Pencil } from "lucide-react";
import { format } from "date-fns";
import { DeleteButton } from "@/components/dashboard/DeleteButton";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doc = await prisma.documentSet.findUnique({
    where: { id },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  if (!doc) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Documents
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{doc.employerName}</CardTitle>
              <CardDescription>
                {doc.employerEin && `EIN: ${doc.employerEin} · `}
                Created {format(doc.createdAt, "MMMM d, yyyy 'at' h:mm a")} by{" "}
                {doc.createdBy.name || doc.createdBy.email}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/generate/${doc.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Pencil className="h-3 w-3" />
                  Edit &amp; Regenerate
                </Button>
              </Link>
              <DeleteButton
                documentId={doc.id}
                employerName={doc.employerName}
                redirectTo="/dashboard"
              />
              <Badge
                variant={
                  doc.status === "complete"
                    ? "default"
                    : doc.status === "error"
                    ? "destructive"
                    : "secondary"
                }
              >
                {doc.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {doc.status === "complete" ? (
            <div className="space-y-4">
              <h3 className="font-medium">Download Document</h3>
              <p className="text-sm text-gray-500">
                Your complete POP document package — Plan Document, Summary Plan
                Description, Adoption Agreement, Certificate of Resolution, and
                all election forms — in a single file.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {doc.docxBlobUrl && (
                  <a href={doc.docxBlobUrl} download>
                    <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardContent className="flex items-center gap-3 p-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium">Word Document</p>
                          <p className="text-sm text-gray-500">
                            .docx format (editable)
                          </p>
                        </div>
                        <Download className="h-4 w-4 ml-auto text-gray-400" />
                      </CardContent>
                    </Card>
                  </a>
                )}
                {doc.pdfBlobUrl && (
                  <a href={doc.pdfBlobUrl} download>
                    <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardContent className="flex items-center gap-3 p-4">
                        <FileText className="h-8 w-8 text-red-600" />
                        <div>
                          <p className="font-medium">PDF Document</p>
                          <p className="text-sm text-gray-500">
                            .pdf format (final)
                          </p>
                        </div>
                        <Download className="h-4 w-4 ml-auto text-gray-400" />
                      </CardContent>
                    </Card>
                  </a>
                )}
              </div>
            </div>
          ) : doc.status === "generating" ? (
            <p className="text-gray-500">Documents are being generated...</p>
          ) : (
            <p className="text-red-600">
              Document generation failed. Please try again.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
