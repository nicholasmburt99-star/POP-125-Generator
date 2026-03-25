import { FormWizard } from "@/components/form-wizard/FormWizard";

export default function GeneratePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Generate POP Documents</h1>
        <p className="text-gray-500 text-sm">
          Fill in the employer information to generate a complete Section 125 POP
          document package.
        </p>
      </div>
      <FormWizard />
    </div>
  );
}
