import { prisma } from "@/lib/db";
import { FormWizard } from "@/components/form-wizard/FormWizard";

export const dynamic = "force-dynamic";

export default async function GeneratePage() {
  const existingDocuments = await prisma.documentSet.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      employerName: true,
      createdAt: true,
      formData: true,
    },
  });

  // Strip formData down to just planType so we don't ship the entire form-data
  // payload to the client. (It's used only to label "POP" vs "Cafeteria" in
  // the duplicate warning.)
  const trimmed = existingDocuments.map((d) => {
    const planType =
      d.formData &&
      typeof d.formData === "object" &&
      !Array.isArray(d.formData) &&
      typeof (d.formData as { plan?: { planType?: string } }).plan?.planType === "string"
        ? (d.formData as { plan: { planType: string } }).plan.planType
        : "pop";
    return {
      id: d.id,
      employerName: d.employerName,
      createdAt: d.createdAt.toISOString(),
      planType,
    };
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Generate POP Documents</h1>
        <p className="text-gray-500 text-sm">
          Fill in the employer information to generate a complete Section 125 POP
          document package.
        </p>
      </div>
      <FormWizard existingDocuments={trimmed} />
    </div>
  );
}
