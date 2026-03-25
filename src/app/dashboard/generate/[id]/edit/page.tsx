import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { FormWizard } from "@/components/form-wizard/FormWizard";
import type { FormData } from "@/types";

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doc = await prisma.documentSet.findUnique({
    where: { id },
  });

  if (!doc) notFound();

  const formData = doc.formData as unknown as FormData;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit &amp; Regenerate</h1>
        <p className="text-gray-500 text-sm">
          Edit the information for <strong>{doc.employerName}</strong> and
          regenerate the documents.
        </p>
      </div>
      <FormWizard initialData={formData} editId={id} />
    </div>
  );
}
