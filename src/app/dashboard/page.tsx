import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Download } from "lucide-react";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();
  const documents = await prisma.documentSet.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-gray-500 text-sm">
            All generated Section 125 POP document sets
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Generate New
          </Button>
        </Link>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">
              No documents generated yet
            </p>
            <Link href="/dashboard/generate">
              <Button>Generate Your First Document</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {doc.employerName}
                    </CardTitle>
                    <CardDescription>
                      {doc.employerEin && `EIN: ${doc.employerEin} · `}
                      Created {format(doc.createdAt, "MMM d, yyyy")} by{" "}
                      {doc.createdBy.name || doc.createdBy.email}
                    </CardDescription>
                  </div>
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
              </CardHeader>
              {doc.status === "complete" && (
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    {doc.docxBlobUrl && (
                      <a href={doc.docxBlobUrl} download>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-3 w-3" />
                          Word (.docx)
                        </Button>
                      </a>
                    )}
                    {doc.pdfBlobUrl && (
                      <a href={doc.pdfBlobUrl} download>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-3 w-3" />
                          PDF
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
